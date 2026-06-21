import sys
from pathlib import Path

AI_ENGINE_DIR = Path(__file__).resolve().parent.parent / "ai-engine"
if str(AI_ENGINE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_ENGINE_DIR))

from app import app  # noqa: E402
