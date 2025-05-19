
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import { Star, Ticket, User, Heart } from 'lucide-react';

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
            <Link to="/favorites" className="header-link flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Favoritos</span>
            </Link>
            <Link to="/my-tickets" className="header-link flex items-center gap-1">
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">Meus ingressos</span>
            </Link>
            <Link to="/account" className="header-link">
              <User className="h-5 w-5" />
            </Link>
            <div className="header-link cursor-pointer">
              <Heart className="h-5 w-5" />
            </div>
          </nav>
        </div>
      </header>
      <div className="header-spacer"></div>
    </>
  );
};

export default ModernHeader;
