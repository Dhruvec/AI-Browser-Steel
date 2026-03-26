import json
from llm.groq_client import ask_groq
from llm.prompts import command_prompt


def detect_intent(user_input):

    prompt = command_prompt(user_input)

    response = ask_groq(prompt)

    try:
        # Resilient markdown stripping
        clean_res = response.strip()
        if "```json" in clean_res:
            clean_res = clean_res.split("```json")[-1].split("```")[0].strip()
        elif "```" in clean_res:
            clean_res = clean_res.split("```")[-1].split("```")[0].strip()
            
        result = json.loads(clean_res)
    except Exception as e:
        print("Intent Parse Error:", e, "Response was:", response)
        result = {"action":"unknown"}

    return result
