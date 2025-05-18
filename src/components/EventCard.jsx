import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="bg-cuencos-gray rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <div className="flex items-center mt-2">
            <span className="text-gray-400 mr-2">📅</span>
            <span className="text-gray-200">{event.date}</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-gray-400 mr-2">📍</span>
            <span className="text-gray-200">{event.location}</span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-cuencos-purple font-bold">R${event.price.toFixed(2)}</span>
            <span className="bg-cuencos-purple/20 text-cuencos-purple px-2 py-1 rounded text-xs">
              Comprar
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
