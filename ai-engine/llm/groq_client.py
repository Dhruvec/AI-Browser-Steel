import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def ask_groq(prompt):

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role":"system", "content":"You must ALWAYS reply with valid JSON only."},
            {"role":"user","content":prompt}
        ],
        response_format={"type": "json_object"}
    )

    return response.choices[0].message.content

def ask_whisper(audio_bytes, filename="audio.webm"):
    response = client.audio.transcriptions.create(
        file=(filename, audio_bytes),
        model="whisper-large-v3"
    )
    return response.text