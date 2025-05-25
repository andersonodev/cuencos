import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GuestNavbar from './GuestNavbar';
import Container from './ui/container';
import '../styles/navbar.css';
import '../styles/mobile-menu.css';
import RoleSwitcher from './RoleSwitcher';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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

  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
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

  // IMPORTANTE: Verificamos se o usuário está logado para exibir o menu correto
  if (!user) {
    return <GuestNavbar />;
  }
  
  // Get the first name safely
  const firstName = user && user.name ? user.name.split(' ')[0] : 'Usuário';
  
  // Se chegou aqui, o usuário está logado e verá o menu de usuário autenticado
  return (
    <header className="navbar">
      <Container padding={false}>
        <div className="navbar-container w-full">
          <Link to="/" className="navbar-logo">
            <img 
              src="/assets/logo/logocuencosroxa.png" 
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
            <Link to="/favorites" className="nav-item" onClick={closeMenu}>
              {/* Invertendo a ordem: texto primeiro, depois o ícone */}
              <span>Favoritos</span>
              <img src="/assets/icons/star.png" alt="Favoritos" className="nav-icon" />
            </Link>
            <Link to="/my-tickets" className="nav-item" onClick={closeMenu}>
              <span>Meus Ingressos</span>
              <img src="/assets/icons/ticket.png" alt="Meus Ingressos" className="nav-icon" />
            </Link>
            
            {/* Adicionando o botão de alternância de papel aqui */}
            <div className="nav-item">
              <RoleSwitcher />
            </div>
            
            <Link to="/account" className="nav-item" onClick={closeMenu}>
              <span>Perfil ({firstName})</span>
              <img src="/assets/icons/profile.png" alt="Perfil" className="nav-icon" />
            </Link>
            <button onClick={handleLogout} className="nav-item logout-button">
              <span>Sair</span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
