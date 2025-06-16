import React, { useState, useEffect, Suspense } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import '../styles/favorites.css';

const FavoritesPage = () => {
  const { getFavoriteEvents, loading: favoritesLoading } = useFavorites();
  const { user, loading: authLoading } = useAuth();
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Função para simular progresso de carregamento
  const startProgressSimulation = () => {
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + (95 - prev) / 10;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };
  
  const loadFavorites = async () => {
    if (!user) {
      setFavoriteEvents([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Iniciar simulação de progresso
    const stopProgressSimulation = startProgressSimulation();
    
    try {
      console.log('FavoritesPage: Carregando favoritos...');
      const events = await getFavoriteEvents();
      console.log('FavoritesPage: Favoritos carregados:', events.length);
      
      setFavoriteEvents(events || []);
      // Completar o progresso
      setLoadingProgress(100);
    } catch (error) {
      console.error("FavoritesPage: Erro ao carregar favoritos:", error);
      setError('Não foi possível carregar seus favoritos');
      setFavoriteEvents([]);
    } finally {
      // Limpar a simulação de progresso
      stopProgressSimulation();
      // Definir um timeout para que o usuário possa ver o 100% antes de remover a UI de loading
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  };
  
  useEffect(() => {
    // Aguardar o contexto de autenticação terminar de carregar
    if (!authLoading) {
      loadFavorites();
    }
  }, [user, authLoading, getFavoriteEvents]);
  
  // Aguardar autenticação carregar antes de redirecionar
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Verificando autenticação...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Redirecionar para a página de login apenas após verificar que não há usuário
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  if (loading || favoritesLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Header />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Carregando seus favoritos...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link to="/" className="text-white mr-2 hover:text-gray-300">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-3xl font-bold text-white">
                <img 
                  src="./assets/icons/star.png"
                  alt="Ícone de favoritos" 
                  className="inline-block mr-2 h-8 w-8 align-text-bottom"
                />
                Favoritos
              </h1>
            </div>
            
            {/* Botão de atualizar */}
            <button
              onClick={loadFavorites}
              className="text-gray-400 hover:text-white transition-colors"
              title="Atualizar favoritos"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-900/30 text-red-500 p-4 rounded-md mb-6">
              <p>{error}</p>
              <button 
                onClick={loadFavorites}
                className="mt-2 text-sm underline hover:text-red-400"
                disabled={loading}
              >
                Tentar novamente
              </button>
            </div>
          )}
          
          {favoriteEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-12 text-center">
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="text-2xl font-bold text-white mb-4">Você ainda não tem favoritos</h2>
              <p className="text-gray-400 mb-6">Adicione eventos aos seus favoritos para encontrá-los facilmente aqui.</p>
              <Link 
                to="/"
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md inline-block"
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
