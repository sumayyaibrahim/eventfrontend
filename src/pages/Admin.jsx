
import { useEffect, useState } from "react";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../eventapi";
import { useNavigate } from "react-router-dom";

/* ================== UTIL FUNCTIONS ================== */
const timeToMinutes = (time) => {
  if (!time || typeof time !== "string") return null;
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
};

const to12Hour = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
};

/* ================== ADMIN PAGE ================== */
export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState({ title: "", date: "", start: "", end: "" });

  const navigate = useNavigate();

  /* ========== PREFILL FORM WHEN EDITING ========== */
  useEffect(() => {
    if (editEvent) setForm(editEvent);
  }, [editEvent]);

  /* ========== LOAD EVENTS ========== */
  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };
  useEffect(() => {
    loadEvents();
  }, []);

  /* ========== LOGOUT ========== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login"; // Hard redirect ensures logout
  };

  /* ========== HANDLE FORM CHANGE ========== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ========== SAVE EVENT (NO OVERLAP) ========== */
  const saveEvent = async (e) => {
    e.preventDefault();
    const { title, date, start, end } = form;

    if (!title || !date || !start || !end) {
      alert("All fields are required");
      return;
    }

    const newStart = timeToMinutes(start);
    const newEnd = timeToMinutes(end);

    if (newEnd <= newStart) {
      alert("End time must be after start time");
      return;
    }

    if (newStart < 600 || newEnd > 1200) {
      alert("Events allowed only between 10 AM and 8 PM");
      return;
    }

    const hasOverlap = events.some((ev) => {
      if (editEvent && ev._id === editEvent._id) return false;
      if (ev.date !== date) return false;

      const existStart = timeToMinutes(ev.start);
      const existEnd = timeToMinutes(ev.end);
      return newStart < existEnd && newEnd > existStart;
    });

    if (hasOverlap) {
      alert("Time slot already booked for this date");
      return;
    }

    if (editEvent) {
      await updateEvent(editEvent._id, form);
      setEditEvent(null);
    } else {
      await createEvent(form);
    }

    setForm({ title: "", date: "", start: "", end: "" });
    loadEvents();
  };

  const handleEvent = (event) => {
    setEditEvent(event);
    setForm(event);
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    loadEvents();
  };

  /* ========== GROUP AND SORT EVENTS BY DATE ========== */
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

  /* ================== UI ================== */
  return (
    <div className="p-6">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ========= FORM ========= */}
        <form
          onSubmit={saveEvent}
          className="bg-white p-4 rounded shadow space-y-3"
        >
          <h2 className="text-lg font-semibold">
            {editEvent ? "Edit Event" : "Create Event"}
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event title"
            className="w-full border p-2 rounded"
          />

          <input
            type="date"
            name="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="time"
            name="start"
            min="10:00"
            max="20:00"
            value={form.start}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input
            type="time"
            name="end"
            min="10:00"
            max="20:00"
            value={form.end}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {editEvent ? "Update Event" : "Add Event"}
          </button>
        </form>

        {/* ========= EVENT LIST ========= */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Scheduled Events</h2>

          {sortedDates.length === 0 && (
            <p className="text-gray-500">No events scheduled</p>
          )}

          {sortedDates.map((date) => (
            <div key={date} className="mb-4">
              <h3 className="text-lg font-bold mb-2">📅 {date}</h3>

              {groupedEvents[date].map((event) => (
                <div
                  key={event._id}
                  className="border p-3 rounded flex justify-between items-center mb-2"
                >
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {to12Hour(event.start)} – {to12Hour(event.end)}
                    </p>
                  </div>

                  <div className="space-x-2">
                    <button
                      onClick={() => handleEvent(event)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
