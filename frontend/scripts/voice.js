let mediaRecorder;
let audioChunks = [];
let isRecording = false;

async function startVoice() {
    const btn = document.getElementById("aiMicBtn");
    
    if (isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        if(btn) btn.classList.remove("bg-red-600", "animate-pulse");
        if(btn) btn.classList.add("bg-blue-600");
        if(typeof addChat === "function") addChat("AI", "Processing your voice with Whisper...");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async function() {
                const base64data = reader.result.split(',')[1];
                
                try {
                    const response = await fetch("http://127.0.0.1:8000/transcribe", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ base64_audio: base64data })
                    });
                    const data = await response.json();
                    if (data.text) {
                        document.getElementById("aiInput").value = data.text;
                        sendAICommand();
                    } else {
                        if(typeof addChat === "function") addChat("AI", "Voice Error: " + (data.error || "Could not transcribe audio"));
                    }
                } catch(e){
                    if(typeof addChat === "function") addChat("AI", "Voice Error: " + e.message);
                }
            }
        };

        mediaRecorder.start();
        isRecording = true;
        if(btn) {
            btn.classList.remove("text-text-secondary");
            btn.classList.add("text-red-500", "animate-pulse");
        }
        if(typeof addChat === "function") addChat("AI", "🎤 Listening... Click mic again to stop.");

    } catch(err) {
        if(typeof addChat === "function") addChat("AI", "Mic Error: " + err.message);
    }
}