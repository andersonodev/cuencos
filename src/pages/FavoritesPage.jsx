
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModernHeader from '../components/ModernHeader';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { getFavorites } from '../lib/favorites';
import { getEventById } from '../lib/events';
import { ArrowLeft } from 'lucide-react';

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  
  useEffect(() => {
    if (user) {
      const favoriteIds = getFavorites(user.id);
      const events = favoriteIds.map(id => getEventById(id)).filter(Boolean);
      setFavoriteEvents(events);
    }
  }, [user]);
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-cuencos-black">
        <ModernHeader />
        <div className="container mx-auto py-12 px-4 text-center flex-grow">
          <h1 className="text-2xl font-bold mb-4 text-white">Você precisa estar logado para acessar esta página</h1>
          <Link to="/login" className="text-cuencos-purple hover:underline">Fazer login</Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-cuencos-black">
      <ModernHeader />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Link to="/" className="text-white mr-2 hover:text-gray-300">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Favoritos</h1>
          </div>
          
          {favoriteEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-cuencos-gray rounded-lg p-12 text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-white mb-4">Você ainda não tem favoritos</h2>
              <p className="text-gray-400 mb-6">Adicione eventos aos seus favoritos para encontrá-los facilmente aqui.</p>
              <Link 
                to="/"
                className="bg-cuencos-purple hover:bg-cuencos-darkPurple text-white px-6 py-2 rounded-md inline-block"
              >
                Explorar Eventos
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FavoritesPage;
