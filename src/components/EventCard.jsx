
import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <Link to={`/events/${event.id}`}>
        <div className="relative h-52 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 bg-cuencos-black px-2 py-1 text-xs text-white rounded">
            {event.month}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{event.title}</h3>
          <p className="text-sm text-gray-400 mt-2">{event.description}</p>
          {event.date && (
            <div className="mt-3 text-xs text-cuencos-purple font-semibold">
              {event.date}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
