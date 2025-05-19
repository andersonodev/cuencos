
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite, isFavorite } from '../lib/favorites';

const EventCard = ({ event }) => {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(user ? isFavorite(user.id, event.id) : false);
  
  const handleToggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigation
    if (user) {
      const result = toggleFavorite(user.id, event.id);
      setIsFav(result);
    }
  };

  // Extract month from date
  const getMonth = () => {
    try {
      if (event.date) {
        const dateParts = event.date.split(' ');
        return dateParts[0].substring(0, 3).toUpperCase();
      }
      return 'MAY'; // Fallback
    } catch (error) {
      return 'MAY'; // Fallback
    }
  };

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="bg-cuencos-gray rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button 
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70"
            onClick={handleToggleFavorite}
          >
            <Star 
              className={`w-5 h-5 ${isFav ? 'fill-cuencos-purple text-cuencos-purple' : 'text-cuencos-purple'}`} 
            />
          </button>
        </div>
        
        <div className="p-4">
          <div className="text-xs font-semibold text-cuencos-purple mb-2">
            {getMonth()}
          </div>
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{event.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{event.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
