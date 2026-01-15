
function EventCard({ event, isAdmin, onEdit, onDelete }) {
  return (
    <div className="border rounded p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h3 className="font-semibold">{event.title}</h3>
        <p className="text-sm text-gray-600">
          {event.date} | {event.startTime} - {event.endTime}
        </p>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default EventCard;
