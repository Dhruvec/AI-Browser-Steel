"""Train Ticket Booking Agent — IRCTC"""
import urllib.parse
from agents.booking.base_agent import BaseBookingAgent


class TrainBookingAgent(BaseBookingAgent):
    def __init__(self, details):
        super().__init__(details)
        self.step_handlers = {
            "init":       self._init,
            "get_from":   self._get_from,
            "get_to":     self._get_to,
            "get_date":   self._get_date,
            "get_class":  self._get_class,
            "get_quota":  self._get_quota,
            "launch":     self._launch,
        }

    def _init(self, _):
        if self.details.get("from"):
            return self._get_to({})
        return self.ask("🚂 Which station are you departing from? (e.g. New Delhi, NDLS)", "get_from")

    def _get_from(self, inp):
        self.details["from"] = inp.get("response", "")
        return self._get_to(inp)

    def _get_to(self, _):
        if self.details.get("to"):
            return self._get_date({})
        return self.ask("🏁 Destination station? (e.g. Mumbai CST, CSTM)", "get_date")

    def _get_date(self, inp):
        if not self.details.get("to"):
            self.details["to"] = inp.get("response", "")
        if self.details.get("date"):
            return self._get_class({})
        return self.ask("📅 Journey date? (e.g. 28 March, Tomorrow)", "get_class")

    def _get_class(self, inp):
        if not self.details.get("date"):
            self.details["date"] = inp.get("response", "")
        if self.details.get("travel_class"):
            return self._launch({})
        return self.ask(
            "🪑 Which class?\n1. Sleeper (SL)\n2. 3rd AC (3A)\n3. 2nd AC (2A)\n4. 1st AC (1A)\n5. General (GN)",
            "get_quota"
        )

    def _get_quota(self, inp):
        mapping = {"1": "SL", "2": "3A", "3": "2A", "4": "1A", "5": "GN",
                   "sleeper": "SL", "3rd ac": "3A", "2nd ac": "2A", "1st ac": "1A", "general": "GN"}
        r = inp.get("response", "SL").lower()
        self.details["travel_class"] = mapping.get(r, r.upper())
        return self.ask("👥 Number of passengers?", "launch")

    def _launch(self, inp):
        self.details["passengers"] = inp.get("response", "1")
        src = self.details.get("from", "")
        dst = self.details.get("to", "")
        url = f"https://www.irctc.co.in/nget/train-search"
        fill_scripts = [
            f"setTimeout(() => {{ let f = document.querySelector('input[placeholder*=\"From\"]'); if(f) {{ f.click(); f.value='{src}'; f.dispatchEvent(new Event('input')); }} }}, 2000);",
            f"setTimeout(() => {{ let t = document.querySelector('input[placeholder*=\"To\"]'); if(t) {{ t.click(); t.value='{dst}'; t.dispatchEvent(new Event('input')); }} }}, 2500);"
        ]
        return {
            "status": "navigating",
            "action": "open_url",
            "url": url,
            "message": f"🚂 Opening IRCTC for **{src} → {dst}** on **{self.details.get('date')}** in **{self.details.get('travel_class')}** class. The booking page is opening — I'll try to autofill the details. You'll only need to **select your seat** and **enter payment PIN**!",
            "scripts": fill_scripts,
            "next_step": "complete",
            "summary": self.details
        }
