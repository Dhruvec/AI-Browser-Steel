"""Flight Ticket Booking Agent — MakeMyTrip"""
import urllib.parse
from agents.booking.base_agent import BaseBookingAgent


class FlightBookingAgent(BaseBookingAgent):
    def __init__(self, details):
        super().__init__(details)
        self.step_handlers = {
            "init":          self._init,
            "get_from":      self._get_from,
            "get_to":        self._get_to,
            "get_date":      self._get_date,
            "get_class":     self._get_class,
            "get_passengers":self._get_passengers,
            "launch":        self._launch,
        }

    def _init(self, _):
        if self.details.get("from"):
            return self._get_to({})
        return self.ask("✈️ Which city/airport are you flying FROM? (e.g. Delhi, DEL)", "get_from")

    def _get_from(self, inp):
        self.details["from"] = inp.get("response", "")
        return self._get_to(inp)

    def _get_to(self, _):
        if self.details.get("to"):
            return self._get_date({})
        return self.ask("🛬 Which city are you flying TO?", "get_date")

    def _get_date(self, inp):
        if not self.details.get("to"):
            self.details["to"] = inp.get("response", "")
        if self.details.get("date"):
            return self._get_class({})
        return self.ask("📅 Departure date? (e.g. 28 March, Tomorrow)", "get_class")

    def _get_class(self, inp):
        if not self.details.get("date"):
            self.details["date"] = inp.get("response", "")
        if self.details.get("flight_class"):
            return self._get_passengers({})
        return self.ask(
            "💺 Cabin class?\n1. Economy\n2. Business\n3. First Class",
            "get_passengers"
        )

    def _get_passengers(self, inp):
        mapping = {"1": "Economy", "economy": "Economy", "2": "Business", "business": "Business", "3": "First", "first": "First"}
        r = inp.get("response", "Economy").lower()
        self.details["flight_class"] = mapping.get(r, "Economy")
        return self.ask("👥 Number of passengers? (Adults)", "launch")

    def _launch(self, inp):
        self.details["passengers"] = inp.get("response", "1")
        frm = self.details.get("from", "")
        to  = self.details.get("to", "")
        date = self.details.get("date", "")
        flight_class = self.details.get("flight_class", "Economy")
        passengers = self.details.get("passengers", "1")

        # Google Flights is more reliable inside a webview
        g_query = urllib.parse.quote(f"flights from {frm} to {to} {date} {flight_class}")
        google_url = f"https://www.google.com/travel/flights?q={g_query}"

        # Also build MakeMyTrip URL as primary attempt
        mmt_url = f"https://www.makemytrip.com/flights/"

        # JS autofill scripts for MakeMyTrip
        autofill_scripts = [
            f"""setTimeout(() => {{
                let from = document.querySelector('#fromCity, [data-cy="from"], input[placeholder*="From"]');
                if(from) {{ from.click(); from.value = '{frm}'; from.dispatchEvent(new Event('input', {{bubbles:true}})); }}
            }}, 2000);""",
            f"""setTimeout(() => {{
                let to = document.querySelector('#toCity, [data-cy="to"], input[placeholder*="To"]');
                if(to) {{ to.click(); to.value = '{to}'; to.dispatchEvent(new Event('input', {{bubbles:true}})); }}
            }}, 3000);"""
        ]

        return {
            "status": "navigating",
            "action": "open_url",
            "url": mmt_url,
            "message": (
                f"✈️ Booking flight **{frm} → {to}** on **{date}** "
                f"({flight_class} class, {passengers} passenger(s)).\n\n"
                f"Opening **MakeMyTrip** and auto-filling your details.\n\n"
                f"If the site doesn't load, I also searched **[Google Flights]({google_url})** — click there as a backup!"
            ),
            "scripts": autofill_scripts,
            "next_step": "complete",
            "summary": self.details
        }
