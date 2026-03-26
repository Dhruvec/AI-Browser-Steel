"""
Agentic Booking Orchestrator
Manages multi-step ticket booking workflows for:
- Movie (BookMyShow)
- Bus (RedBus)
- Train (IRCTC)
- Flight (MakeMyTrip)
"""

from agents.booking.movie_agent import MovieBookingAgent
from agents.booking.bus_agent import BusBookingAgent
from agents.booking.train_agent import TrainBookingAgent
from agents.booking.flight_agent import FlightBookingAgent

# Active booking sessions per user
_sessions = {}

def get_session(session_id="default"):
    return _sessions.get(session_id)

def set_session(session_id, data):
    _sessions[session_id] = data

def clear_session(session_id="default"):
    if session_id in _sessions:
        del _sessions[session_id]

def start_booking(booking_type, details, session_id="default"):
    """Start a new booking flow and return the first prompt."""
    agents = {
        "movie": MovieBookingAgent,
        "bus": BusBookingAgent,
        "train": TrainBookingAgent,
        "flight": FlightBookingAgent,
    }
    AgentClass = agents.get(booking_type)
    if not AgentClass:
        return {"status": "error", "message": f"Unknown booking type: {booking_type}"}
    
    agent = AgentClass(details)
    session = {
        "type": booking_type,
        "agent": agent,
        "step": "init",
        "details": details
    }
    set_session(session_id, session)
    return agent.next_step("init", {})

def continue_booking(user_response, session_id="default"):
    """Continue an ongoing booking flow with user's response."""
    session = get_session(session_id)
    if not session:
        return {"status": "error", "message": "No active booking session. Please start a new booking."}
    
    agent = session["agent"]
    result = agent.next_step(session["step"], {"response": user_response})
    next_step = result.get("next_step", session["step"])
    
    # Clear session if this is the final step
    if result.get("status") == "complete" or next_step == "complete":
        clear_session(session_id)
    else:
        session["step"] = next_step
        set_session(session_id, session)
    
    return result
