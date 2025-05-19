
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const ModernHeader = () => {
  return (
    <>
      <header className="header-modern">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <img 
              src="/lovable-uploads/ticket-icon-purple.svg" 
              alt="Cuencos" 
              className="header-logo-icon" 
            />
            <span className="header-logo-text">Cuencos</span>
          </Link>
          
          <nav className="header-nav">
            <Link to="/sell" className="header-link">Venda aqui</Link>
            <Link to="/login" className="header-login-button">Login</Link>
          </nav>
        </div>
      </header>
      <div className="header-spacer"></div>
    </>
  );
};

export default ModernHeader;
