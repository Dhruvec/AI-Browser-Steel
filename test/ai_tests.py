import requests

url = "http://127.0.0.1:8000/command"

data = {
    "text":"open youtube"
}

response = requests.post(url,json=data)

print("AI RESPONSE:")
print(response.json())