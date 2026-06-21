from llm.groq_client import ask_groq


def summarize(text):

    prompt = f"""
Summarize this webpage content:

{text}
"""

    summary = ask_groq(prompt)

    return summary