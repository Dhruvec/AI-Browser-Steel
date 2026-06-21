const API_BASE = getSteelApiBase();
const AUTH_TOKEN_KEY = "steelAuthToken";
const AUTH_USER_KEY = "steelAuthUser";

async function apiFetch(path, options = {}) {
    const token = getAuthToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.detail || data.message || `Request failed with status ${response.status}`);
    }

    return data;
}

function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setAuthState(token, user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

function clearAuthState() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || "null");
    } catch {
        return null;
    }
}

async function getCurrentUser() {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const data = await apiFetch("/me");
        const user = data.user;
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return user;
    } catch {
        return null;
    }
}

function isLoginPage() {
    return window.location.pathname.toLowerCase().endsWith("/login.html");
}

async function initAuthGuard() {
    if (isLoginPage()) {
        if (getAuthToken()) {
            const user = await getCurrentUser();
            if (user) {
                window.location.href = "index.html";
                return null;
            }
        }
        return null;
    }

    const user = await getCurrentUser();
    if (!user) {
        clearAuthState();
        window.location.href = "login.html";
        return null;
    }

    return user;
}

async function logout() {
    const token = getAuthToken();
    if (token) {
        try {
            await apiFetch("/logout", { method: "POST" });
        } catch {
        }
    }

    clearAuthState();
    window.location.href = "login.html";
}

function renderAuthUI() {
    const user = getStoredUser();
    const nameEl = document.getElementById("authUserName");
    const panelEl = document.getElementById("authUserPanel");

    if (!user || !panelEl) return;

    if (nameEl) {
        nameEl.textContent = user.username || user.email || "User";
    }
    panelEl.classList.remove("hidden");
}

window.addEventListener("DOMContentLoaded", renderAuthUI);
