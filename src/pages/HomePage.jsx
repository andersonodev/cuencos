import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EventFilter from '../components/EventFilter';
import EventCard from '../components/EventCard';
import { getEvents, getFeaturedEvents } from '../lib/events';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../styles/homepage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [eventsToShow, setEventsToShow] = useState(8);

  useEffect(() => {
    const loadHomeData = async () => {
      setIsLoading(true);
      try {
        console.log('HomePage: Carregando dados da home...');
        
        // Carregar eventos em destaque
        const featuredEvents = await getFeaturedEvents();
        console.log('HomePage: Eventos em destaque carregados:', featuredEvents.length);
        setFeaturedEvents(featuredEvents.slice(0, 6)); // Limitar a 6 eventos
        
        // Carregar todos os eventos publicados
        const allEvents = await getEvents();
        console.log('HomePage: Todos os eventos carregados:', allEvents.length);
        setEvents(allEvents);
        
      } catch (error) {
        console.error('HomePage: Erro ao carregar dados da home:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (featuredEvents.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleShowMore = () => {
    if (showAllEvents) {
      // Se já está mostrando todos, volta para o estado inicial
      setShowAllEvents(false);
      setEventsToShow(8);
      // Rolar suavemente para a seção de eventos
      const eventsSection = document.getElementById('events-section');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Expandir para mostrar todos os eventos
      setShowAllEvents(true);
      setEventsToShow(events.length);
    }
  };

  if (isLoading) {
    return (
      <div className="homepage">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="homepage">
      <Header />
      
      {/* Banner Carousel */}
      {featuredEvents.length > 0 && (
        <section className="hero full-width">
          <div className="hero-carousel">
            {featuredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(${event.imageData || event.image || '/assets/events/puc-in-rio.jpg'})`
                }}
              >
                <div className="hero-content">
                  <h1 className="hero-title">{event.title}</h1>
                  <p className="hero-description">
                    {event.description}
                  </p>
                  
                  <div className="hero-buttons">
                    <button
                      onClick={() => navigate(`/events/${event.id}/buy`)}
                      className="btn-primary"
                    >
                      Comprar
                    </button>
                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="btn-secondary"
                    >
                      Saiba Mais
                    </button>
                  </div>
                  
                  <div className="hero-info">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                    {event.price > 0 && (
                      <span>💰 R$ {event.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Controls */}
            {featuredEvents.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="hero-carousel-control prev"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="carousel-arrow" />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="hero-carousel-control next"
                  aria-label="Próximo slide"
                >
                  <ChevronRight className="carousel-arrow" />
                </button>

                <div className="hero-carousel-dots">
                  {featuredEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                      aria-label={`Ir para slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}
      
      {/* Filtro de eventos */}
      <div className="container mx-auto px-4 py-8">
        <EventFilter />
      </div>
      
      {/* Lista de eventos */}
      <div id="events-section" className="container mx-auto px-4 pb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-cuencos-purple mb-6">
            Eventos em alta
          </h2>
          
          {events.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.slice(0, eventsToShow).map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              
              {/* Botão Ver mais/menos */}
              {events.length > 8 && (
                <div className="text-center mt-8">
                  <button 
                    onClick={handleShowMore}
                    className="border border-cuencos-purple text-cuencos-purple hover:bg-cuencos-purple hover:text-white py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
                  >
                    {showAllEvents ? (
                      <>
                        <span>Ver menos eventos</span>
                        <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Ver todos os eventos ({events.length})</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <h3 className="text-xl text-white mb-2">Nenhum evento disponível</h3>
              <p className="text-gray-400">
                Não há eventos cadastrados no momento. Volte em breve!
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;
