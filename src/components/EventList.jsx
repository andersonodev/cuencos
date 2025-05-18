
import React from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';

const EventList = ({ title, events }) => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-cuencos-purple">{title}</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <select className="appearance-none bg-white bg-opacity-10 border border-gray-600 rounded-full py-1 pl-4 pr-8 text-white">
                <option>Dias da Semana</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <div className="relative">
              <select className="appearance-none bg-white bg-opacity-10 border border-gray-600 rounded-full py-1 pl-4 pr-8 text-white">
                <option>Qualquer Categoria</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {events.length > 6 && (
          <div className="text-center mt-8">
            <Link to="/events" className="border border-cuencos-purple text-cuencos-purple hover:bg-cuencos-purple hover:text-white py-2 px-8 rounded-full inline-block transition-colors">
              Explorar Mais
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
