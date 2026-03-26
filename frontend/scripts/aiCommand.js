const AI_SESSION_ID = "session_" + Date.now();

async function sendAICommand(){
    const input = document.getElementById("aiInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";

    addChat("You", text);

    try {
        const response = await fetch("http://127.0.0.1:8000/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text, session_id: AI_SESSION_ID })
        });

        const data = await response.json();

        if (data.action === "open_url") {
            openURL(data.url);
            const msg = data.message || ("Opening: " + data.url);
            addChat("AI", msg, data.booking ? "booking" : "normal");

            // Execute any JS scripts in the webview after navigation
            if (data.scripts && data.scripts.length > 0) {
                setTimeout(() => {
                    const wv = getActiveWebview();
                    if (wv) {
                        data.scripts.forEach(script => {
                            wv.executeJavaScript(script).catch(e => console.warn("Script error:", e));
                        });
                    }
                }, 3000);
            }
        } else if (data.action === "chat") {
            addChat("AI", data.message || "Done!", data.booking ? "booking" : "normal");
        } else {
            // Fallback — don't pretty-print raw JSON
            addChat("AI", data.message || "✅ Done!");
        }
    } catch(e) {
        addChat("AI", "Error: Could not reach the AI server. Is the backend running?");
    }
}


function addChat(sender, message, style = "normal"){
    const chat = document.getElementById("chatArea");
    const div = document.createElement("div");
    div.className = sender === "You" ? "mb-2 text-right" : "mb-2 text-left";

    let bubbleClass = "bg-gray-700 text-gray-200";
    if (sender === "You") bubbleClass = "bg-blue-600 text-white";
    else if (style === "booking") bubbleClass = "bg-amber-700/80 text-amber-100 border border-amber-500/30";

    // Support basic markdown bold (**text**)
    const formatted = message.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
    div.innerHTML = `<span class="inline-block px-3 py-2 rounded-xl max-w-full text-sm ${bubbleClass}">${formatted}</span>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}