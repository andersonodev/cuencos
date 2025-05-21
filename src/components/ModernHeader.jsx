
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/modern-header.css';
import { Ticket, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RoleSwitcher from './RoleSwitcher';

const ModernHeader = () => {
  const { user, logout, isOrganizer } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="header-modern">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <img 
              src="/lovable-uploads/0859a779-d4bb-47a6-9f22-1e2c2b6498a7.png" 
              alt="Cuencos" 
              className="header-logo-icon" 
            />
            <span className="header-logo-text">Cuencos</span>
          </Link>
          
          <nav className="header-nav">
            <Link to="/favorites" className="header-link flex items-center gap-1">
              <img 
                src="/images/heart-icon.png" 
                alt="Favoritos"
                className="header-icon" 
                style={{ width: "18px", height: "18px" }}
              />
              <span className="hidden sm:inline">Favoritos</span>
            </Link>
            <Link to="/my-tickets" className="header-link flex items-center gap-1">
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">Meus ingressos</span>
            </Link>
            {user ? (
              <>
                {isOrganizer() && (
                  <Link to="/dashboard" className="header-link flex items-center gap-1">
                    <img 
                      src="/lovable-uploads/f7b0388e-b525-439e-bd9f-f75673f8fe89.png" 
                      alt="Dashboard"
                      className="header-icon" 
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}
                {/* Botão de alternância de papel - Mostrar somente se o usuário for organizador ou tiver papel anterior de organizador */}
                {(isOrganizer() || user.previousRole === 'organizador') && (
                  <RoleSwitcher />
                )}
                <Link to="/account" className="header-link">
                  <User className="h-5 w-5" />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="header-link cursor-pointer">
                    <ChevronDown className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuLabel>Olá, {user.name?.split(' ')[0] || user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      className="hover:bg-gray-700 cursor-pointer focus:bg-gray-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login" className="header-link">
                <User className="h-5 w-5" />
              </Link>
            )}
          </nav>
        </div>
      </header>
      <div className="header-spacer"></div>
    </>
  );
};

export default ModernHeader;
