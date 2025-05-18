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
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      </div>
      
      <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-16 z-10">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
          <p className="text-gray-300 mb-4">{event.description}</p>
          <div className="flex items-center mb-4">
            <span className="text-gray-400 mr-2">📍</span>
            <span className="text-white">{event.location}</span>
          </div>
          <div className="flex items-center mb-6">
            <span className="text-gray-400 mr-2">📅</span>
            <span className="text-white">{event.date}</span>
          </div>
          <Link 
            to={`/events/${event.id}`}
            className="bg-cuencos-purple hover:bg-cuencos-darkPurple text-white py-3 px-8 rounded-full inline-flex items-center"
          >
            Saiba mais
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
