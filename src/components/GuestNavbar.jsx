import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/guest-navbar.css';

const GuestNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Função para abrir o menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden'; // Impede rolagem quando menu está aberto
    } else {
      document.body.style.overflow = ''; // Restaura rolagem
    }
  };
  
  // Fechar o menu ao redimensionar a tela para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  return (
    <nav className="guest-navbar">
      <div className="guest-navbar-container">
        {/* Logo à esquerda */}
        <Link to="/" className="guest-navbar-logo">
          <img src="/images/logo-roxa-pura.png" alt="Logo" className="logo-icon" />
          <span className="logo-text">Cuencos</span>
        </Link>
        
        {/* Botão de hambúrguer para mobile */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMenu}
          aria-label="Menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Navegação à direita */}
        <div className={`guest-navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/sell" className="nav-link" onClick={() => isMenuOpen && toggleMenu()}>
            Venda aqui
          </Link>
          <Link to="/login" className="login-button" onClick={() => isMenuOpen && toggleMenu()}>
            Login
          </Link>
        </div>
        
        {/* Overlay para quando o menu mobile estiver aberto */}
        {isMenuOpen && <div className="mobile-overlay" onClick={toggleMenu}></div>}
      </div>
    </nav>
  );
};

export default GuestNavbar;
