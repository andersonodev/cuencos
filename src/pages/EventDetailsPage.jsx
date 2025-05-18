
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getEventById, getEvents } from '../lib/events';
import { toggleFavorite, isFavorite } from '../lib/favorites';
import EventCard from '../components/EventCard';

const EventDetailsPage = () => {
  const { id } = useParams();
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

  const handleFavoriteToggle = () => {
    if (!user) return;
    const newStatus = toggleFavorite(user.id, event.id);
    setIsFav(newStatus);
  };
  
  // Get other events for recommendations
  const otherEvents = getEvents()
    .filter(e => e.id !== event.id)
    .slice(0, 3);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="bg-cuencos-black">
        <div className="relative h-80 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          
          <div className="flex justify-between mt-4">
            <div className="flex space-x-4">
              <button 
                onClick={handleFavoriteToggle}
                className={`rounded-full p-2 ${isFav ? 'bg-cuencos-purple text-white' : 'bg-cuencos-gray text-white'}`}
              >
                ★
              </button>
              <button className="rounded-full p-2 bg-cuencos-gray text-white">
                ↗
              </button>
            </div>
            
            <div className="bg-cuencos-gray rounded-md py-2 px-4">
              <div className="text-xs text-gray-400">Ingresso</div>
              <div className="flex items-center">
                <div className="bg-orange-500 h-2 w-2 rounded-full mr-2"></div>
                <span className="text-white font-medium">A partir de R${event.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Data e Horário</h2>
                <div className="flex items-start space-x-3">
                  <div className="text-gray-400 mt-1">📅</div>
                  <div>
                    <div className="text-white">{event.date}</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 mt-2">
                  <div className="text-gray-400 mt-1">⏰</div>
                  <div>
                    <div className="text-white">{event.time || '21:00 PM - 4:00 AM'}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Endereço e Local</h2>
                <div className="flex items-start space-x-3">
                  <div className="text-gray-400 mt-1">📍</div>
                  <div>
                    <div className="text-white">{event.location}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Faixa Etária</h2>
                <div className="flex items-start space-x-3">
                  <div className="text-gray-400 mt-1">🔞</div>
                  <div>
                    <div className="text-white">{event.ageRestriction || 'Proibido menores de 18'}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Organizadores</h2>
                <div className="flex items-start space-x-3">
                  <div className="text-gray-400 mt-1">👥</div>
                  <div>
                    <div className="text-white">{event.organizers || 'Associação Atlética'}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Descrição do Evento</h2>
                <div className="text-white whitespace-pre-line">
                  {event.longDescription || event.description}
                </div>
              </div>
            </div>
            
            <div>
              <Link 
                to={`/events/${event.id}/buy`}
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-md font-medium mb-4"
              >
                Comprar
              </Link>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Outros eventos que você pode gostar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EventDetailsPage;
