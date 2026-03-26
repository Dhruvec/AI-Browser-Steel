import re
from commands.intent_detection import detect_intent


# Deterministic deep-link patterns - checked BEFORE asking the LLM
SITE_SEARCH_PATTERNS = [
    # Explicit: "open/play X on youtube"
    (r"(?:open|play|search|find|show|watch)\s+(.+?)\s+(?:on|in)\s+youtube(?:\.com)?", 
     "https://www.youtube.com/results?search_query={query}"),
    (r"(?:open|play|search|find|show|watch)\s+(.+?)\s+(?:on|in)\s+(?:yt)\b", 
     "https://www.youtube.com/results?search_query={query}"),
    # "youtube X" or "youtube search X"
    (r"^youtube\s+(?:search\s+)?(.+)$",
     "https://www.youtube.com/results?search_query={query}"),
    # IMPLICIT YouTube: "open/play/watch X video/lecture/course/tutorial/song/clip"
    (r"(?:open|play|watch|find|show)\s+(.+?(?:video|lecture|course|tutorial|song|clip|movie|episode|series|class|chapter)s?)\s*$",
     "https://www.youtube.com/results?search_query={query}"),
    # IMPLICIT YouTube: "play X" — play without a site always means YouTube
    (r"^(?:play)\s+(.+)$",
     "https://www.youtube.com/results?search_query={query}"),
    # Explicit: "open/search X on google"
    (r"(?:open|search|find|show)\s+(.+?)\s+(?:on|in)\s+google(?:\.com)?",
     "https://www.google.com/search?q={query}"),
    # Explicit: "open/find X on wikipedia"
    (r"(?:open|search|find|show)\s+(.+?)\s+(?:on|in)\s+wikipedia(?:\.org)?",
     "https://en.wikipedia.org/w/index.php?search={query}"),
    # Explicit: "open/find X on amazon"
    (r"(?:open|search|find|show)\s+(.+?)\s+(?:on|in)\s+amazon(?:\.com)?",
     "https://www.amazon.com/s?k={query}"),
]


def parse_command(user_input):
    text = user_input.strip().lower()

    # Step 1: Try deterministic pattern matching first
    for pattern, url_template in SITE_SEARCH_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            query = match.group(1).strip()
            encoded = query.replace(" ", "+")
            url = url_template.replace("{query}", encoded)
            return {
                "type": "browser",
                "task": "open",
                "site": url
            }

    # Step 2: Fall back to LLM for everything else
    intent = detect_intent(user_input)
    action = intent.get("action")

    if action == "open_website":
        site = intent.get("site", "")
        # If LLM returned a plain domain, make sure it's a valid URL
        if not site.startswith("http"):
            site = "https://" + site
        return {
            "type": "browser",
            "task": "open",
            "site": site
        }

    elif action == "search":
        from agents.search_agent import search_web
        return search_web(intent.get("query", user_input))

    elif action == "summarize_page":
        return {
            "type": "ai",
            "task": "summarize"
        }

    else:
        return {
            "type": "chat",
            "message": user_input
        }