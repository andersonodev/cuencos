
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const EventCard = ({ event }) => {
  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="bg-cuencos-gray rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
        <div className="absolute top-2 right-2 z-10">
          <button 
            className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              // Adicionar aos favoritos
            }}
          >
            <Star className="w-5 h-5 text-cuencos-purple" />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row h-full">
          <div className="md:w-1/3 h-32 md:h-auto overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="p-4 md:w-2/3 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white line-clamp-2 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-300">
                {event.date} | {event.location}
              </p>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs font-semibold text-white border-cuencos-purple">
                {event.duration || "3 DIAS"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
