import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import './MobileTopBar.css';

const MobileTopBarGuest = () => {
  return (
    <div className="mobile-topbar">
      <Link to="/" className="mobile-topbar-logo">
        <img 
          src="./assets/logo/logocuencosroxa.png" 
          alt="Cuencos Logo" 
          className="mobile-topbar-logo-icon" 
        />
        <span className="mobile-topbar-logo-text">Cuencos</span>
      </Link>
      <Link to="/login" className="mobile-topbar-profile">
        <LogIn size={28} color="#a200ff" />
      </Link>
    </div>
  );
};

export default MobileTopBarGuest; 