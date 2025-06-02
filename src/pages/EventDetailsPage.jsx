import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById } from '../lib/events';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { Heart, Calendar, Clock, MapPin, ArrowLeft, Share, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from '../components/ui/use-toast';
import { getTicketsByUserId } from '../lib/tickets';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [userTickets, setUserTickets] = useState([]);
  const [hasTicketForEvent, setHasTicketForEvent] = useState(false);
  const { user } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Função para rolar para o topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  
  // Efeito para rolar para o topo quando o componente for montado
  useEffect(() => {
    scrollToTop();
  }, []);
  
  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Carregando evento com ID:', id);
        const eventData = await getEventById(parseInt(id));
        
        if (eventData) {
          console.log('Evento carregado com sucesso:', eventData);
          setEvent(eventData);
          // Rolar para o topo após carregar o evento
          scrollToTop();
        } else {
          console.warn('Evento não encontrado');
          setError('Evento não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar evento:', err);
        setError('Não foi possível carregar os detalhes do evento');
      } finally {
        setIsLoading(false);
      }
    };
    
    const loadUserTickets = async () => {
      if (user && id) {
        try {
          const tickets = await getTicketsByUserId(user.id || user.email);
          setUserTickets(tickets || []);
          
          // Verificar se o usuário já tem ingresso para este evento
          const hasTicket = tickets.some(ticket => 
            ticket.eventId == id && ticket.status === 'active'
          );
          setHasTicketForEvent(hasTicket);
        } catch (error) {
          console.error('Erro ao carregar tickets do usuário:', error);
        }
      }
    };
    
    if (id) {
      loadEvent();
      loadUserTickets();
    }
  }, [id, user]);
  
  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: "Ação necessária",
        description: "Faça login para adicionar eventos aos favoritos",
        variant: "warning"
      });
      return;
    }
    
    const eventId = parseInt(id);
    const wasFavorite = isFavorite(eventId);
    
    toggleFavorite(eventId);
    
    toast({
      title: wasFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: wasFavorite 
        ? "O evento foi removido dos seus favoritos" 
        : "O evento foi adicionado aos seus favoritos",
      variant: wasFavorite ? "default" : "success"
    });
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado",
          description: "URL do evento copiada para a área de transferência",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };
  
  const handlePurchaseTicket = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para comprar ingressos",
        variant: "warning"
      });
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    
    if (!event) {
      toast({
        title: "Erro",
        description: "Dados do evento não carregados",
        variant: "destructive"
      });
      return;
    }
    
    if (hasTicketForEvent) {
      toast({
        title: "Você já possui ingresso",
        description: "Você já comprou ingresso para este evento. Acesse 'Meus Ingressos' para visualizá-lo.",
        variant: "warning"
      });
      navigate('/my-tickets');
      return;
    }
    
    // Redirecionar para a página de seleção de ingressos
    navigate(`/events/${id}/buy`);
  };
  
  // Função para gerar URL de imagem compatível
  const getImageUrl = (imagePath, imageData) => {
    // PRIORIDADE 1: Se tiver imagem em base64, usar ela
    if (imageData && imageData.startsWith('data:')) {
      return imageData;
    }
    
    // PRIORIDADE 2: Se a imagem já é uma URL de dados (base64)
    if (imagePath && imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    if (!imagePath) return '/assets/images/placeholder-event.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Se a imagem começa com ./assets, remove o ponto inicial
    if (imagePath.startsWith('./assets')) {
      return imagePath.substring(1);
    }
    
    // Se a imagem começa com assets, adiciona a barra inicial
    if (imagePath.startsWith('assets')) {
      return '/' + imagePath;
    }
    
    return `/assets/events/${imagePath}`;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gray-900 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <h1 className="text-2xl text-white mb-4">Evento não encontrado</h1>
            <p className="text-gray-400 mb-6">{error || "Este evento não existe ou foi removido."}</p>
            <Link 
              to="/"
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md inline-block"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navegação de volta */}
        <div className="mb-6">
          <Link to="/" className="flex items-center text-white hover:text-gray-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à página inicial
          </Link>
        </div>
        
        {/* Banner do evento */}
        <div className="relative rounded-lg overflow-hidden mb-8 h-60 md:h-80 lg:h-96">
          <img 
            src={getImageUrl(event.image, event.imageData)} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/assets/images/placeholder-event.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
          
          {/* Informações no banner */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-gray-300 text-sm md:text-base">{event.description}</p>
          </div>
          
          {/* Botões de ação */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button 
              onClick={handleToggleFavorite}
              className="bg-black/40 hover:bg-black/60 p-2 rounded-full text-white"
              aria-label={isFavorite(parseInt(id)) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart className={`h-5 w-5 ${isFavorite(parseInt(id)) ? 'fill-pink-500 text-pink-500' : ''}`} />
            </button>
            <button 
              onClick={handleShare}
              className="bg-black/40 hover:bg-black/60 p-2 rounded-full text-white"
              aria-label="Compartilhar evento"
            >
              <Share className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Coluna principal */}
          <div className="flex-grow">
            {/* Detalhes do evento */}
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Sobre o evento</h2>
              <p className="text-gray-300 whitespace-pre-line mb-6">{event.longDescription || event.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">Data</h3>
                    <p className="text-white">{event.date}</p>
                    {event.endDate && event.endDate !== event.date && (
                      <p className="text-white">até {event.endDate}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">Horário</h3>
                    <p className="text-white">{event.time || "A definir"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400">Local</h3>
                    <p className="text-white">{event.location}</p>
                  </div>
                </div>
                
                {event.ageRestriction && (
                  <div className="flex items-start">
                    <div className="h-5 w-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0 flex items-center justify-center">
                      <span className="text-sm font-bold">18+</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-400">Restrição de idade</h3>
                      <p className="text-white">{event.ageRestriction}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Organizadores */}
            {event.organizers && (
              <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Organização</h2>
                <p className="text-gray-300">{event.organizers}</p>
              </div>
            )}
          </div>
          
          {/* Coluna lateral - Compra */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 text-green-500 mr-2" />
                <div className="text-2xl font-bold text-white">
                  {event.price > 0 ? `R$ ${event.price.toFixed(2)}` : "Gratuito"}
                </div>
              </div>
              
              {event.ticketName && (
                <div className="mb-4 text-sm">
                  <span className="text-gray-400">Ingresso: </span>
                  <span className="text-white">{event.ticketName}</span>
                </div>
              )}
              
              <button 
                onClick={handlePurchaseTicket}
                disabled={isPurchasing || hasTicketForEvent}
                className={`w-full py-3 rounded-md mb-4 transition-colors ${
                  hasTicketForEvent 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-purple-700 hover:bg-purple-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white'
                }`}
              >
                {isPurchasing 
                  ? 'Processando...' 
                  : hasTicketForEvent 
                    ? 'Ingresso já adquirido' 
                    : 'Comprar ingresso'
                }
              </button>
              
              {hasTicketForEvent && (
                <div className="text-center text-sm mb-4">
                  <button
                    onClick={() => navigate('/my-tickets')}
                    className="text-cuencos-purple hover:text-cuencos-darkPurple underline"
                  >
                    Ver meu ingresso
                  </button>
                </div>
              )}
              
              <div className="text-center text-sm text-gray-400">
                {event.salesCount > 0 && (
                  <p className="mb-2">{event.salesCount} pessoas já compraram</p>
                )}
                <p>Compra 100% segura via Cuencos</p>
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
