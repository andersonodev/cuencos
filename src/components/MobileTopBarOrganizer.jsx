import React from 'react';
import { Link } from 'react-router-dom';
import './MobileTopBar.css';

const MobileTopBarOrganizer = () => {
  return (
    <div className="mobile-topbar">
      <Link to="/dashboard" className="mobile-topbar-logo">
        <img 
          src="/assets/logo/logocuencosroxa.png" 
          alt="Cuencos Logo" 
          className="mobile-topbar-logo-icon" 
        />
        <span className="mobile-topbar-logo-text">Cuencos</span>
      </Link>
      <Link to="/dashboard/account" className="mobile-topbar-profile">
        <img 
          src="/assets/icons/profilebutton.png" 
          alt="Perfil" 
          className="mobile-topbar-profile-icon" 
        />
      </Link>
    </div>
  );
};

export default MobileTopBarOrganizer; 