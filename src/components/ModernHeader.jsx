
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/modern-header.css';
import { Star, Ticket, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ModernHeader = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
  };

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
            {user ? (
              <>
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
