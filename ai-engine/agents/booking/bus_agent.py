"""Bus Ticket Booking Agent — RedBus"""
import urllib.parse
from agents.booking.base_agent import BaseBookingAgent


class BusBookingAgent(BaseBookingAgent):
    def __init__(self, details):
        super().__init__(details)
        self.step_handlers = {
            "init":      self._init,
            "get_from":  self._get_from,
            "get_to":    self._get_to,
            "get_date":  self._get_date,
            "get_seats": self._get_seats,
            "launch":    self._launch,
        }

    def _init(self, _):
        if self.details.get("from"):
            return self._get_to({})
        return self.ask("🚌 Where are you travelling FROM?", "get_from")

    def _get_from(self, inp):
        self.details["from"] = inp.get("response", "")
        return self._get_to(inp)

    def _get_to(self, _):
        if self.details.get("to"):
            return self._get_date({})
        return self.ask(f"🏁 Where are you travelling TO?", "get_date")

    def _get_date(self, inp):
        if not self.details.get("to"):
            self.details["to"] = inp.get("response", "")
        if self.details.get("date"):
            return self._get_seats({})
        return self.ask("📅 Travel date? (e.g. Tomorrow, 28 March)", "get_seats")

    def _get_seats(self, inp):
        if not self.details.get("date"):
            self.details["date"] = inp.get("response", "")
        return self.ask("💺 How many seats?", "launch")

    def _launch(self, inp):
        self.details["seats"] = inp.get("response", "1")
        src = urllib.parse.quote(self.details.get("from", ""))
        dst = urllib.parse.quote(self.details.get("to", ""))
        url = f"https://www.redbus.in/bus-tickets/{src.lower()}-to-{dst.lower()}"
        return {
            "status": "navigating",
            "action": "open_url",
            "url": url,
            "message": f"🚌 Opening RedBus for **{self.details['from']} → {self.details['to']}**. Browse the available buses and I'll only need your **seat preference** and **payment PIN** to complete booking!",
            "next_step": "complete",
            "summary": self.details
        }
