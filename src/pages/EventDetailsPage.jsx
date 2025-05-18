import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getEventById, getEvents } from '../lib/events';
import { toggleFavorite, isFavorite } from '../lib/favorites';
import EventCard from '../components/EventCard';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = getEventById(Number(id));
  const [isFav, setIsFav] = useState(user ? isFavorite(user.id, Number(id)) : false);
  
  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Evento não encontrado</h1>
          <Link to="/" className="text-cuencos-purple hover:underline">Voltar para a página inicial</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const result = toggleFavorite(user.id, event.id);
    setIsFav(result);
  };
  
  const handleBuyTickets = () => {
    navigate(`/events/${id}/buy`);
  };
  
  // Get related events (simplified implementation)
  const allEvents = getEvents();
  const relatedEvents = allEvents.filter(e => e.id !== event.id).slice(0, 3);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="relative">
        <div className="bg-rio-gradient bg-cover bg-center h-64 flex items-end">
          <div className="container mx-auto px-4 pb-6">
            <h1 className="text-4xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Event details column */}
          <div className="w-full md:w-2/3">
            <div className="bg-cuencos-gray rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-cuencos-purple">Detalhes do evento</h2>
                <button 
                  onClick={handleToggleFavorite}
                  className="text-white bg-cuencos-gray hover:bg-cuencos-lightGray p-2 rounded-full"
                >
                  {isFav ? (
                    <svg className="w-6 h-6 text-cuencos-purple" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full rounded-lg object-cover aspect-video"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-white">
                    <span className="mr-2">📅</span>
                    <div>
                      <p className="font-medium">{event.date}</p>
                      <p className="text-sm text-gray-300">{event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-white">
                    <span className="mr-2">📍</span>
                    <p>{event.location}</p>
                  </div>
                  
                  {event.ageRestriction && (
                    <div className="flex items-center text-white">
                      <span className="mr-2">🔞</span>
                      <p>{event.ageRestriction}</p>
                    </div>
                  )}
                  
                  {event.organizers && (
                    <div className="flex items-center text-white">
                      <span className="mr-2">👥</span>
                      <p>{event.organizers}</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <p className="text-white text-lg mb-2">Preço: <span className="text-cuencos-purple">R${event.price.toFixed(2)}</span></p>
                    <button
                      onClick={handleBuyTickets}
                      className="w-full bg-cuencos-purple hover:bg-cuencos-darkPurple text-white py-3 rounded-md font-medium"
                    >
                      Comprar ingressos
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Sobre o evento</h3>
                <div className="text-white whitespace-pre-line">
                  {event.longDescription || event.description}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-cuencos-gray rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-cuencos-purple mb-4">Eventos Relacionados</h2>
              <div className="space-y-4">
                {relatedEvents.map((relEvent) => (
                  <div key={relEvent.id} className="border-b border-cuencos-lightGray pb-4 last:border-0">
                    <Link to={`/events/${relEvent.id}`} className="group">
                      <h3 className="text-white font-medium group-hover:text-cuencos-purple">{relEvent.title}</h3>
                      <p className="text-sm text-gray-300">{relEvent.date}</p>
                      <p className="text-sm text-gray-300">{relEvent.location}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetailsPage;
