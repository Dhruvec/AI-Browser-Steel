from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64, re

from commands.command_parser import parse_command
from agents.booking.orchestrator import start_booking, continue_booking, get_session
from llm.groq_client import ask_whisper

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserCommand(BaseModel):
    text: str
    session_id: str = "default"


# Booking intent detection (deterministic, fast)
BOOKING_PATTERNS = [
    (r"\b(?:book|buy|get|purchase)\b.+\b(?:movie|film|cinema)\b", "movie"),
    (r"\b(?:book|buy|get|purchase)\b.+\b(?:bus)\b", "bus"),
    (r"\b(?:book|buy|get|purchase)\b.+\b(?:train|rail|irctc)\b", "train"),
    (r"\b(?:book|buy|get|purchase)\b.+\b(?:flight|plane|aeroplane|airplane|air ticket)\b", "flight"),
    (r"\b(?:movie ticket|cinema ticket)\b", "movie"),
    (r"\b(?:bus ticket|bus pass)\b", "bus"),
    (r"\b(?:train ticket|rail ticket)\b", "train"),
    (r"\b(?:flight ticket|air ticket|plane ticket|fly to)\b", "flight"),
]

def detect_booking_intent(text: str):
    lower = text.lower()
    for pattern, btype in BOOKING_PATTERNS:
        if re.search(pattern, lower):
            # Try to extract inline details (e.g. "book train ticket from Delhi to Mumbai")
            details = {}
            fm = re.search(r"\bfrom\s+([a-zA-Z\s]+?)(?:\s+to\b|\s+on\b|$)", lower)
            tm = re.search(r"\bto\s+([a-zA-Z\s]+?)(?:\s+on\b|\s+for\b|$)", lower)
            dm = re.search(r"\bon\s+(.+?)(?:\s+class|\s+for|$)", lower)
            mv = re.search(r"\b(?:for|watch|see)\s+([a-zA-Z ]+?)(?:\s+movie|\s+film|\s+ticket|$)", lower)
            if fm: details["from"] = fm.group(1).strip()
            if tm: details["to"] = tm.group(1).strip()
            if dm: details["date"] = dm.group(1).strip()
            if mv and btype == "movie": details["movie"] = mv.group(1).strip()
            return btype, details
    return None, {}


@app.post("/command")
def handle_command(command: UserCommand):
    text = command.text
    session_id = command.session_id

    # Check if there's an active booking session first
    session = get_session(session_id)
    if session:
        result = continue_booking(text, session_id)
        return _format_booking_result(result)

    # Check for new booking intent
    booking_type, details = detect_booking_intent(text)
    if booking_type:
        result = start_booking(booking_type, details, session_id)
        return _format_booking_result(result)

    # Normal command parsing
    parsed = parse_command(text)

    if parsed.get("type") == "browser":
        site = parsed.get("site", "")
        if not site.startswith("http"):
            site = "https://" + site
        return {"action": "open_url", "url": site}

    elif parsed.get("type") == "search":
        from agents.search_agent import search_web
        result = search_web(parsed.get("query", text))
        return result

    elif parsed.get("type") == "chat":
        return {"action": "chat", "message": parsed.get("message", "I didn't understand that.")}

    return {"action": "chat", "message": "I didn't understand that. Try: 'book movie ticket', 'book train ticket', 'open YouTube', etc."}


def _format_booking_result(result):
    """Convert booking agent result to a standard API response."""
    if result.get("status") == "asking":
        return {"action": "chat", "message": result["message"], "booking": True}
    elif result.get("status") in ("navigating", "filling"):
        resp = {
            "action": "open_url",
            "url": result.get("url", ""),
            "message": result.get("message", "Navigating..."),
            "booking": True
        }
        if result.get("scripts"):
            resp["scripts"] = result["scripts"]
        return resp
    elif result.get("status") == "complete":
        return {"action": "chat", "message": result.get("message", "Booking complete!")}
    elif result.get("status") == "error":
        return {"action": "chat", "message": "❌ " + result.get("message", "Something went wrong.")}
    return {"action": "chat", "message": str(result)}


class AudioCommand(BaseModel):
    base64_audio: str

@app.post("/transcribe")
def transcribe_audio(command: AudioCommand):
    try:
        audio_bytes = base64.b64decode(command.base64_audio)
        text = ask_whisper(audio_bytes, "audio.webm")
        return {"text": text}
    except Exception as e:
        return {"text": "", "error": str(e)}