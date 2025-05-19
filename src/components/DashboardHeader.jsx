import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, Ticket, User, LogOut, ChevronDown, Settings } from 'lucide-react';
import '../styles/dashboard-header.css';

const DashboardHeader = ({ user }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/');
  };
  
  return (
    <header className="dashboard-header">
      <div className="header-container">
        <Link to="/dashboard" className="header-logo">
          <img 
            src="/lovable-uploads/ticket-icon-purple.svg" 
            alt="Cuencos" 
            className="logo-icon" 
          />
          <span className="logo-text">Cuencos</span>
        </Link>
        
        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-item">
            <BarChart2 className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/dashboard/management" className="nav-item">
            <Ticket className="nav-icon" />
            <span className="nav-text">Gerenciamento</span>
          </Link>
          <div 
            className="profile-dropdown"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="nav-item">
              <User className="nav-icon" />
              <span className="nav-text">{user?.nome || 'Perfil'}</span>
              <ChevronDown className="dropdown-icon" />
            </div>
            
            {profileOpen && (
              <div className="dropdown-menu">
                <Link to="/dashboard/profile" className="dropdown-item">
                  <User size={16} className="dropdown-icon" />
                  <span>Meu Perfil</span>
                </Link>
                <Link to="/dashboard/settings" className="dropdown-item">
                  <Settings size={16} className="dropdown-icon" />
                  <span>Configurações</span>
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <LogOut size={16} className="dropdown-icon" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default DashboardHeader;
