
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
            src="/lovable-uploads/0859a779-d4bb-47a6-9f22-1e2c2b6498a7.png" 
            alt="Cuencos" 
            className="logo-icon" 
          />
        </Link>
        
        <nav className="dashboard-nav">
          <Link to="/dashboard" className="nav-item">
            <img 
              src="/lovable-uploads/f7b0388e-b525-439e-bd9f-f75673f8fe89.png" 
              alt="Dashboard" 
              className="nav-icon" 
            />
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/dashboard/management" className="nav-item">
            <img 
              src="/lovable-uploads/7e83847f-48e6-435e-acbd-e3b33bbe865b.png" 
              alt="Gerenciamento" 
              className="nav-icon" 
            />
            <span className="nav-text">Gerenciamento</span>
          </Link>
          
          {/* Botão de alternância de papel */}
          <RoleSwitcher />
          
          <div 
            className="profile-dropdown"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="nav-item">
              <img 
                src="/lovable-uploads/47ae5152-5c24-4e41-9c18-8fa227e7eb18.png" 
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
