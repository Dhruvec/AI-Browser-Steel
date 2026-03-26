import re

SITE_SEARCH_PATTERNS = [
    (r"(?:open|play|search|find|show|watch)\s+(.+?)\s+(?:on|in)\s+youtube(?:\.com)?", 
     "https://www.youtube.com/results?search_query={query}"),
    (r"(?:open|play|search|find|show|watch)\s+(.+?)\s+(?:on|in)\s+(?:yt)\b", 
     "https://www.youtube.com/results?search_query={query}"),
    (r"^youtube\s+(?:search\s+)?(.+)$",
     "https://www.youtube.com/results?search_query={query}"),
    (r"(?:open|search|find|show)\s+(.+?)\s+(?:on|in)\s+google(?:\.com)?",
     "https://www.google.com/search?q={query}"),
    (r"(?:open|search|find|show)\s+(.+?)\s+(?:on|in)\s+wikipedia(?:\.org)?",
     "https://en.wikipedia.org/w/index.php?search={query}"),
    (r"(?:open|search|find|show)\s+(.+?)\s+(?:on|in)\s+amazon(?:\.com)?",
     "https://www.amazon.com/s?k={query}"),
]

test_phrases = [
    "open pw lecture video",
    "open pw physics lectures on youtube",
    "play PW physics lecture video on youtube",
    "open pw phyics videos",
    "open youtube",
    "search for black holes",
]

for phrase in test_phrases:
    text = phrase.strip().lower()
    matched = False
    for pattern, url_template in SITE_SEARCH_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            query = match.group(1).strip()
            encoded = query.replace(" ", "+")
            url = url_template.replace("{query}", encoded)
            print(f"INPUT: {phrase!r}")
            print(f"  -> REGEX MATCH -> {url}")
            matched = True
            break
    if not matched:
        print(f"INPUT: {phrase!r}")
        print(f"  -> No regex match, falls through to LLM")
