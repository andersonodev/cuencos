import React from 'react';
import { Link } from 'react-router-dom';
import './MobileTopBar.css';

const MobileTopBar = () => {
  return (
    <div className="mobile-topbar">
      <Link to="/" className="mobile-topbar-logo">
        <img 
          src="/assets/logo/logocuencosroxa.png" 
          alt="Cuencos Logo" 
          className="mobile-topbar-logo-icon" 
        />
        <span className="mobile-topbar-logo-text">Cuencos</span>
      </Link>
      <Link to="/account" className="mobile-topbar-profile">
        <img 
          src="./assets/icons/profilebutton.png" 
          alt="Perfil" 
          className="mobile-topbar-profile-icon" 
        />
      </Link>
    </div>
  );
};

export default MobileTopBar; 