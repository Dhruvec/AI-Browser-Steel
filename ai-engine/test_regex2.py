import re

SITE_SEARCH_PATTERNS = [
    (r"(?:open|play|search|find|show|watch)\s+(.+?)\s+(?:on|in)\s+youtube(?:\.com)?", "https://www.youtube.com/results?search_query={query}"),
    (r"(?:open|play|search|find|show|watch)\s+(.+?)\s+(?:on|in)\s+(?:yt)\b", "https://www.youtube.com/results?search_query={query}"),
    (r"^youtube\s+(?:search\s+)?(.+)$", "https://www.youtube.com/results?search_query={query}"),
    (r"(?:open|play|watch|find|show)\s+(.+?(?:video|lecture|course|tutorial|song|clip|movie|episode|series|class|chapter)s?)\s*$", "https://www.youtube.com/results?search_query={query}"),
    (r"^(?:play)\s+(.+)$", "https://www.youtube.com/results?search_query={query}"),
    (r"(?:open|search|find|show)\s+(.+?)\s+(?:on|in)\s+google(?:\.com)?", "https://www.google.com/search?q={query}"),
]

tests = ["open pw lecture video", "open pw phyics videos", "open pw physics lectures on youtube", "play PW physics lecture video", "open youtube"]
for phrase in tests:
    text = phrase.strip().lower()
    matched = False
    for pattern, tmpl in SITE_SEARCH_PATTERNS:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            q = m.group(1).strip().replace(" ", "+")
            print(f"OK: {phrase!r}")
            print(f"    -> {tmpl.replace('{query}', q)}")
            matched = True
            break
    if not matched:
        print(f"LLM: {phrase!r}")
