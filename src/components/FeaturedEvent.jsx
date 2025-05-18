
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedEvent = ({ event }) => {
  if (!event) return null;
  
  return (
    <div className="relative h-96 bg-black">
      <div className="absolute inset-0 z-0">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-16 z-10">
        <div className="max-w-lg">
          <div className="bg-cuencos-purple/80 text-white inline-block px-4 py-1 mb-4 rounded">
            09.MAIO
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
          <p className="text-gray-300 mb-6">{event.description}</p>
          <div className="flex space-x-4">
            <Link 
              to={`/events/${event.id}`}
              className="bg-cuencos-purple hover:bg-cuencos-darkPurple text-white py-3 px-8 rounded inline-flex items-center"
            >
              Comprar
            </Link>
            <Link 
              to={`/events/${event.id}`}
              className="border border-white text-white py-3 px-8 rounded inline-flex items-center hover:bg-white/10"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
