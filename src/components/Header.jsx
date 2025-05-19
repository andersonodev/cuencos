import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
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
      <div className="navbar-section">
        <Link to="/">
          <img 
            src="/lovable-uploads/32356300-a01b-4b6e-ba0b-7a23804f784b.png" 
            alt="Cuencos Logo" 
            className="logo" 
          />
        </Link>
      </div>
      
      <div className="menu-toggle" onClick={openMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div className={`navbar-section navbar-end ${isMenuOpen ? 'active' : ''}`}>
        <div className="close-menu" onClick={closeMenu}></div>
        <Link to="/favorites" className="nav-item" onClick={closeMenu}>
          <img src="/lovable-uploads/star-icon.png" alt="Favoritos" className="nav-icon" />
          <span>Favoritos</span>
        </Link>
        <Link to="/my-tickets" className="nav-item" onClick={closeMenu}>
          <img src="/lovable-uploads/ticket-icon.png" alt="Meus Ingressos" className="nav-icon" />
          <span>Meus Ingressos</span>
        </Link>
        <Link to="/account">
          <img 
            src="/lovable-uploads/profile-dropdown.png" 
            alt="Perfil" 
            className="profile-icon" 
            onClick={closeMenu}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
