from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional
import base64
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

router = APIRouter()

DB_PATH = Path(os.getenv("STEEL_DB_PATH", "/tmp/users.db" if os.getenv("VERCEL") else Path(__file__).resolve().parent.parent / "users.db"))
SESSION_DAYS = 30
TOKEN_VERSION = "v1"
AUTH_SECRET = os.getenv("STEEL_AUTH_SECRET", "steel-local-dev-secret-change-me")
USERNAME_PATTERN = re.compile(r"^[a-zA-Z0-9_]{3,32}$")
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class UserIn(BaseModel):
    username: str
    email: str = ""
    password: str


def utcnow():
    return datetime.now(timezone.utc)


def parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT NOT NULL DEFAULT '',
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )

    columns = {row[1] for row in cursor.execute("PRAGMA table_info(users)")}
    if "email" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT ''")
    if "salt" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN salt TEXT NOT NULL DEFAULT ''")
    if "created_at" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP")

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )
        """
    )

    conn.commit()
    conn.close()


init_db()


def normalize_username(username: str) -> str:
    normalized = username.strip().lower()
    if not USERNAME_PATTERN.match(normalized):
        raise HTTPException(
            status_code=400,
            detail="Username must be 3-32 characters and use only letters, numbers, or underscores.",
        )
    return normalized


def normalize_email(email: str) -> str:
    normalized = email.strip().lower()
    if not EMAIL_PATTERN.match(normalized):
        raise HTTPException(status_code=400, detail="Enter a valid email address.")
    return normalized


def validate_password(password: str) -> None:
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")


def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000)
    return salt, digest.hex()


def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    if salt:
        _, computed_hash = hash_password(password, salt)
        return hmac.compare_digest(computed_hash, stored_hash)
    legacy_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return hmac.compare_digest(legacy_hash, stored_hash)


def cleanup_expired_sessions(cursor):
    cursor.execute("DELETE FROM sessions WHERE expires_at <= ?", (utcnow().isoformat(),))


def create_session(conn, user_id: int) -> str:
    cursor = conn.cursor()
    cleanup_expired_sessions(cursor)
    token = secrets.token_urlsafe(32)
    created_at = utcnow().isoformat()
    expires_at = (utcnow() + timedelta(days=SESSION_DAYS)).isoformat()
    cursor.execute(
        "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
        (token, user_id, created_at, expires_at),
    )
    conn.commit()
    return token


def _base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("ascii").rstrip("=")


def _base64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(value + padding)


def create_auth_token(user: dict) -> str:
    expires_at = int((utcnow() + timedelta(days=SESSION_DAYS)).timestamp())
    payload = {
        "id": user["id"],
        "username": user["username"],
        "email": user.get("email", ""),
        "exp": expires_at,
    }
    payload_part = _base64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(AUTH_SECRET.encode("utf-8"), payload_part.encode("ascii"), hashlib.sha256).digest()
    return f"{TOKEN_VERSION}.{payload_part}.{_base64url_encode(signature)}"


def verify_auth_token(token: str) -> Optional[dict]:
    try:
        version, payload_part, signature_part = token.split(".", 2)
        if version != TOKEN_VERSION:
            return None
        expected_signature = hmac.new(AUTH_SECRET.encode("utf-8"), payload_part.encode("ascii"), hashlib.sha256).digest()
        provided_signature = _base64url_decode(signature_part)
        if not hmac.compare_digest(expected_signature, provided_signature):
            return None
        payload = json.loads(_base64url_decode(payload_part).decode("utf-8"))
        if int(payload.get("exp", 0)) <= int(utcnow().timestamp()):
            return None
        return {
            "id": payload["id"],
            "username": payload["username"],
            "email": payload.get("email", ""),
        }
    except (KeyError, TypeError, ValueError, json.JSONDecodeError):
        return None


def extract_token(authorization: Optional[str]) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authentication token")
    return authorization.split(" ", 1)[1]


def get_current_user(authorization: Optional[str]) -> dict:
    token = extract_token(authorization)
    stateless_user = verify_auth_token(token)
    if stateless_user:
        return stateless_user

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT s.expires_at, u.id, u.username, u.email
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.token = ?
        """,
        (token,),
    )
    row = cursor.fetchone()

    if not row:
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    expires_at, user_id, username, email = row
    if parse_datetime(expires_at) <= utcnow():
        cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    conn.close()
    return {"id": user_id, "username": username, "email": email}


@router.post("/signup")
def signup(user: UserIn):
    username = normalize_username(user.username)
    email = normalize_email(user.email)
    validate_password(user.password)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username or email already exists")

        salt, password_hash = hash_password(user.password)
        created_at = utcnow().isoformat()
        cursor.execute(
            "INSERT INTO users (username, email, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?)",
            (username, email, password_hash, salt, created_at),
        )
        user_id = cursor.lastrowid
        conn.commit()
        return {
            "message": "Signup successful. Please log in to continue.",
            "user": {"id": user_id, "username": username, "email": email},
        }
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    finally:
        conn.close()


@router.post("/login")
def login(user: UserIn):
    identifier = user.username.strip().lower()
    validate_password(user.password)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, username, email, password_hash, salt FROM users WHERE username = ? OR email = ?",
        (identifier, identifier),
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id, username, email, password_hash, salt = row
    if not verify_password(user.password, password_hash, salt):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_data = {"id": user_id, "username": username, "email": email}
    token = create_auth_token(user_data)

    return {
        "message": "Login successful",
        "token": token,
        "user": user_data,
    }


@router.get("/me")
def me(authorization: Optional[str] = Header(default=None)):
    return {"user": get_current_user(authorization)}


@router.post("/logout")
def logout(authorization: Optional[str] = Header(default=None)):
    try:
        token = extract_token(authorization)
    except HTTPException:
        return {"message": "Logged out"}

    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
    finally:
        conn.close()

    return {"message": "Logged out"}
