"""Base class for all booking agents."""

class BaseBookingAgent:
    def __init__(self, initial_details: dict):
        self.details = initial_details.copy()
        self.step_handlers = {}

    def next_step(self, step: str, user_input: dict) -> dict:
        handler = self.step_handlers.get(step)
        if handler:
            return handler(user_input)
        return {"status": "error", "message": f"Unknown step: {step}"}

    def ask(self, question, next_step, context=None):
        resp = {
            "status": "asking",
            "message": question,
            "next_step": next_step,
            "type": "input"
        }
        if context:
            resp["context"] = context
        return resp

    def navigate(self, url, message, next_step):
        return {
            "status": "navigating",
            "action": "open_url",
            "url": url,
            "message": message,
            "next_step": next_step
        }

    def fill_form(self, scripts, message, next_step):
        """Execute JS scripts in the active webview to fill form fields."""
        return {
            "status": "filling",
            "action": "execute_js",
            "scripts": scripts,
            "message": message,
            "next_step": next_step
        }

    def complete(self, message):
        return {
            "status": "complete",
            "message": message
        }

    def error(self, message):
        return {
            "status": "error",
            "message": message
        }
