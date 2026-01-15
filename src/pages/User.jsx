


import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { getEvents } from "../eventapi";
import { useNavigate } from "react-router-dom";

// Convert 24h time string to 12-hour format
const to12Hour = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
};

// Convert time to minutes (for sorting)
const timeToMinutes = (time) => {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export default function User() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login"; // ensures logout
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    getEvents()
      .then((res) => {
        setEvents(Array.isArray(res) ? res : []);
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  /* ===== GROUP AND SORT EVENTS BY DATE ===== */
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  sortedDates.forEach((date) => {
    groupedEvents[date].sort(
      (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
    );
  });

  return (
    <div className="min-h-screen bg-purple-600 py-8">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Events</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Empty state */}
        {events.length === 0 && (
          <p className="text-gray-500 text-center">No events scheduled</p>
        )}

        {/* Events List grouped by date */}
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <h3 className="text-lg font-bold mb-2">📅 {date}</h3>
              <div className="space-y-3">
                {groupedEvents[date].map((event) => (
                  <EventCard
                    key={event._id}
                    event={{
                      ...event,
                      startTime: to12Hour(event.start),
                      endTime: to12Hour(event.end),
                    }}
                    isAdmin={false} // hide edit/delete buttons
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
