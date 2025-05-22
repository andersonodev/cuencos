import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard-header.css';
import RoleSwitcher from './RoleSwitcher';

const DashboardHeader = ({ user }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="dashboard-header">
      <div className="header-container">
        <Link to="/dashboard" className="header-logo">
          <img 
            src="../public/logo-roxa-pura.png" 
            alt="Cuencos" 
            className="logo-icon" 
          />
          <span className="logo-text">Cuencos</span>
        </Link>
        
        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-item">
            <img 
              src="../public/iconeDashboard.png" 
              alt="Dashboard" 
              className="nav-icon" 
            />
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/dashboard/management" className="nav-item">
            <img 
              src="../public/ion_ticket.png" 
              alt="Gerenciamento" 
              className="nav-icon" 
            />
            <span className="nav-text">Gerenciamento</span>
          </Link>
          
          {/* Botão de alternância de papel com design melhorado */}
          <div className="mx-2 flex items-center">
            <RoleSwitcher />
          </div>
          
          <div 
            className="profile-dropdown"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="nav-item">
              <img 
                src="../public/profilebutton.png" 
                alt="Perfil" 
                className="nav-icon" 
              />
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
