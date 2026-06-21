def search_web(query):

    url = f"https://www.google.com/search?q={query}"

    return {
        "action":"open_url",
        "url":url
    }