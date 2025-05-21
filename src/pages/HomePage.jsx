import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../lib/events';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header'; // Usando o Header ao invés de GuestNavbar
import EventCard from '../components/EventCard';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Adicionando a importação dos ícones
import '../styles/homepage.css';

const HomePage = () => {
  const events = getEvents();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroEvents = [
    {
      id: 1,
      title: "PUC IN RIO",
      description: "Quem aí não perde uma festa da MAIOR DA CAPITAL? Pensando em vocês, o Hellboy soltou mais uma edição da PUC IN RIO!!",
      image: "/lovable-uploads/4d09bc83-a8f8-4a0c-aebc-e51cd1526dee.png",
    },
    {
      id: 2,
      title: "BAILE DO MAGNA",
      description: "Venha curtir a melhor festa universitária do semestre! Uma noite inesquecível com as melhores atrações.",
      image: "/lovable-uploads/3e8b36aa-1f23-4483-97b1-67d9521b5e6a.png",
    },
    {
      id: 3,
      title: "CALOURADA 2025.1",
      description: "A festa de boas-vindas aos calouros que vai agitar o campus! Não perca essa celebração incrível.",
      image: "/lovable-uploads/68619dad-8ba1-48be-8d77-8858c3151a75.png",
    }
  ];
  
  // Funções para navegação do carousel
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === heroEvents.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? heroEvents.length - 1 : prev - 1));
  };
  
  // Função para abrir o menu
  const openMenu = () => {
    setIsMenuOpen(true);
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden'; // Impede rolagem quando menu está aberto
  };
  
  // Função para fechar o menu
  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('menu-open');
    document.body.style.overflow = ''; // Restaura rolagem
  };
  
  // Fecha o menu ao redimensionar a tela para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  // Autoplay para o carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <>
      <Header />
      
      <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      <main>
        {/* Hero Section com Carousel */}
        <section className="hero-carousel">
          {heroEvents.map((heroEvent, index) => (
            <div 
              key={heroEvent.id}
              className={`hero-slide ${index === activeSlide ? 'active' : ''}`}
              style={{ backgroundImage: `linear-gradient(to right, rgba(162, 0, 255, 0.7), rgba(162, 0, 255, 0.4)), url(${heroEvent.image})` }}
            >
              <div className="hero-content">
                <h1 className="hero-title">{heroEvent.title}</h1>
                <p className="hero-description">{heroEvent.description}</p>
                <div className="hero-buttons">
                  <Link to="/login" className="btn-primary">Comprar</Link>
                  <Link to={`/events/${heroEvent.id}`} className="btn-secondary">Saiba Mais</Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Controles do carousel */}
          <button className="hero-carousel-control prev" onClick={prevSlide} aria-label="Slide anterior">
            <ChevronLeft className="carousel-arrow" />
          </button>
          <button className="hero-carousel-control next" onClick={nextSlide} aria-label="Próximo slide">
            <ChevronRight className="carousel-arrow" />
          </button>
          
          {/* Indicadores do carousel */}
          <div className="carousel-indicators">
            {heroEvents.map((_, index) => (
              <button 
                key={index}
                className={`carousel-indicator ${index === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="filtro">
          <div className="filtro-box">
            <div className="filtro-item">
              <span className="filtro-label">Search Event</span>
              <span className="filtro-valor">Jogos</span>
              <div className="filtro-linha"></div>
            </div>
            <div className="filtro-item">
              <span className="filtro-label">Local</span>
              <span className="filtro-valor">Todos</span>
              <div className="filtro-linha"></div>
            </div>
            <div className="filtro-item">
              <span className="filtro-label">Data</span>
              <span className="filtro-valor dropdown">Qualquer Data</span>
              <div className="filtro-linha"></div>
            </div>
          </div>
        </section>
          
        <section className="eventos">
          <div className="eventos-header">
            <h2>Eventos em alta</h2>
            <div className="eventos-filtros">
              <select>
                <option>Dias da Semana</option>
                <option>Segunda</option>
                <option>Sexta</option>
                <option>Sábado</option>
              </select>
              <select>
                <option>Qualquer Categoria</option>
                <option>Festas</option>
                <option>Shows</option>
                <option>Eventos Acadêmicos</option>
              </select>
            </div>
          </div>

          <div className="eventos-grid">
            {events.slice(0, 6).map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="explorar">
            <button>Explorar Mais</button>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-col">
              <img src="/images/logo-cuencos-roxa.png" alt="Logo Cuencos" className="footer-logo" />
              <p>
                Cuencos é uma plataforma de autoatendimento para venda de ingressos que conecta
                universitários a eventos criados por e para a comunidade acadêmica.
              </p>
            </div>

            <div className="footer-col" style={{padding: "0 3rem 0 6rem"}}>
              <h4>Sobre Nós</h4>
              <ul>
                <li><Link to="#">Conheça o Cuencos</Link></li>
                <li><Link to="#">Contato</Link></li>
                <li><Link to="#">Política de Privacidade</Link></li>
                <li><Link to="#">Termos de Uso</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Anuncie na Cuencos!</h4>
              <p>Buscando anunciar num local de confiança a sua festa?</p>
              <Link to="#" className="footer-btn">Anunciar Agora</Link>
            </div>
          </div>

          <hr className="footer-divider" />

          <p className="footer-copy">Copyright © 2025 Cuencos</p>
        </footer>
      </main>
    </>
  );
};

export default HomePage;
