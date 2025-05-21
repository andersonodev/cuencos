import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import '../styles/mobile-menu.css';

const GuestNavbar = () => {
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
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="/lovable-uploads/fee83771-ef35-43dc-ac79-f030ffeafafa.png" 
            alt="Cuencos Logo" 
            className="logo-icon" 
          />
          <span className="logo-text">Cuencos</span>
        </Link>
        
        <div className="menu-toggle" onClick={openMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`navbar-right ${isMenuOpen ? 'active' : ''}`}>
          <div className="close-menu" onClick={closeMenu}></div>
          <Link to="/login" className="nav-item" onClick={closeMenu}>
            <span>Venda aqui</span>
          </Link>
          <Link to="/login" className="nav-item login-button" onClick={closeMenu}>
            <span>Login</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default GuestNavbar;
