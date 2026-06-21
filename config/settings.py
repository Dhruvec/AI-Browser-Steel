import json
import os
from dotenv import load_dotenv

load_dotenv()


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def load_browser_config():
    path = os.path.join(BASE_DIR, "browser_config.json")

    with open(path, "r") as f:
        return json.load(f)


def load_ai_config():
    path = os.path.join(BASE_DIR, "ai_config.json")

    with open(path, "r") as f:
        return json.load(f)


def get_env_variable(name):
    return os.getenv(name)