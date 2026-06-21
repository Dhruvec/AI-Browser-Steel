"""Movie Ticket Booking Agent — BookMyShow"""
import urllib.parse
from agents.booking.base_agent import BaseBookingAgent


class MovieBookingAgent(BaseBookingAgent):
    def __init__(self, details):
        super().__init__(details)
        self.step_handlers = {
            "init":       self._init,
            "get_movie":  self._get_movie,
            "get_city":   self._get_city,
            "get_date":   self._get_date,
            "get_time":   self._get_time,
            "get_seats":  self._get_seats,
            "launch":     self._launch_bms,
        }

    def _init(self, _):
        if self.details.get("movie"):
            return self._get_city({})
        return self.ask("🎬 Which movie would you like to watch?", "get_movie")

    def _get_movie(self, inp):
        self.details["movie"] = inp.get("response", "")
        return self._get_city(inp)

    def _get_city(self, _):
        if self.details.get("city"):
            return self._get_date({})
        return self.ask("📍 Which city are you in?", "get_date")

    def _get_date(self, inp):
        if not self.details.get("city"):
            self.details["city"] = inp.get("response", "")
        if self.details.get("date"):
            return self._launch_bms({})
        return self.ask("📅 Which date? (e.g. Today, Tomorrow, 27 March)", "get_time")

    def _get_time(self, inp):
        if not self.details.get("date"):
            self.details["date"] = inp.get("response", "")
        if self.details.get("time"):
            return self._launch_bms({})
        return self.ask("🕐 Preferred show time? (e.g. 7 PM, Morning, Evening)", "get_seats")

    def _get_seats(self, inp):
        if not self.details.get("time"):
            self.details["time"] = inp.get("response", "")
        return self.ask("💺 How many seats? (e.g. 2)", "launch")

    def _launch_bms(self, inp):
        if not self.details.get("seats"):
            self.details["seats"] = inp.get("response", "2")
        movie = self.details.get("movie", "")
        city = self.details.get("city", "")
        query = urllib.parse.quote(f"{movie} {city}")
        url = f"https://in.bookmyshow.com/explore/movies-{city.lower().replace(' ', '-')}"
        return {
            "status": "navigating",
            "action": "open_url",
            "url": url,
            "message": f"🎬 Opening BookMyShow for **{movie}** in **{city}**. I've navigated to the listings — please select your preferred showtime. I'll handle the rest and only ask for your **seat number** and **payment PIN**!",
            "next_step": "complete",
            "summary": self.details
        }
