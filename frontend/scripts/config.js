function getSteelApiBase() {
    if (window.STEEL_API_BASE) return window.STEEL_API_BASE;

    const isLocalFile = window.location.protocol === "file:";
    const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    window.STEEL_API_BASE = (isLocalFile || isLocalHost) ? "http://127.0.0.1:8000" : "";
    return window.STEEL_API_BASE;
}
