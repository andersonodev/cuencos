import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Extract month abbreviation for the small badge
  const monthAbbr = event.date?.split(' ')[1]?.toUpperCase() || 'MAY';
  
  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="bg-cuencos-gray rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:-translate-y-1 transition-transform">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-400 mb-1">{monthAbbr}</div>
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <p className="text-sm text-gray-300 mt-2 line-clamp-2">{event.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
