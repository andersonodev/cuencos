import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './MobileBottomMenu.css';

const MobileBottomMenuOrganizer = ({ onLogout }) => {
  return (
    <nav className="mobile-bottom-menu">
      <Link to="/dashboard" className="menu-item">
        <img src="/assets/icons/iconeDashboard.png" alt="Dashboard" className="menu-icon" />
        <span>Dashboard</span>
      </Link>
      <Link to="/dashboard/management" className="menu-item">
        <img src="/assets/icons/icone-ingresso.png" alt="Gerenciamento" className="menu-icon" />
        <span>Gerenciar</span>
      </Link>
      <Link to="/dashboard/account" className="menu-item">
        <img src="/assets/icons/profilebutton.png" alt="Perfil" className="menu-icon" />
        <span>Perfil</span>
      </Link>
      <button className="menu-item" onClick={onLogout}>
        <LogOut size={24} className="menu-icon" />
        <span>Sair</span>
      </button>
    </nav>
  );
};

export default MobileBottomMenuOrganizer; 