
import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedEvent = ({ event }) => {
  return (
    <div className="relative h-[500px] bg-gradient-to-r from-cuencos-purple to-cuencos-darkPurple flex items-center">
      <div className="absolute inset-0 bg-center bg-cover opacity-40" style={{ backgroundImage: `url(${event.image})` }} />
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-start justify-center">
        <div className="text-white p-1 px-4 rounded bg-cuencos-purple mb-4 text-sm">
          {event.date}
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">{event.title}</h1>
        <p className="text-white text-lg mb-6 max-w-xl">
          {event.description}
        </p>
        <div className="flex space-x-4">
          <Link to={`/events/${event.id}/buy`} className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-6 rounded-full text-lg font-medium">
            Comprar
          </Link>
          <Link to={`/events/${event.id}`} className="border border-white hover:bg-white/10 text-white py-2 px-6 rounded-full text-lg font-medium">
            Saiba Mais
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
