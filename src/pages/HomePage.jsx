import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../lib/events';
import ModernHeader from '../components/ModernHeader';
import '../styles/homepage.css';

const HomePage = () => {
  const events = getEvents();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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

  return (
    <>
      <ModernHeader />
      
      <div className={`menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>PUC IN RIO</h1>
            <p>Quem aí não perde uma festa da MAIOR DA CAPITAL? Pensando em vocês, o Hellboy soltou mais uma edição da PUC IN RIO!!</p>
            <div className="hero-buttons">
              <Link to="#" className="btn primary">Comprar</Link>
              <Link to="#" className="btn secondary">Saiba Mais</Link>
            </div>
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
              <Link to={`/events/${event.id}`} key={event.id}>
                <div className="card-evento">
                  <img src={event.image} alt={event.title} />
                  <div className="info">
                    <span>{event.date?.split(' ')[1]?.toUpperCase() || 'MAY'}</span>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="explorar">
            <button>Explorar Mais</button>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-col">
              <img src="/lovable-uploads/logo-cuencos-roxa.png" alt="Logo Cuencos" className="footer-logo" />
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
