import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronDown, Settings, User, Menu, X, LayoutDashboard, FileText, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard-header.css';
import RoleSwitcher from './RoleSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = ({ user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="header-modern">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img 
            src={import.meta.env.BASE_URL + "assets/logo/logocuencosroxa.png"} 
            alt="Cuencos" 
            className="header-logo-icon" 
          />
          <span className="header-logo-text">Cuencos</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <nav className={`header-nav ${mobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <Link to="/dashboard" className="header-link flex items-center gap-1">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/dashboard/management" className="header-link flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Gerenciamento</span>
            </Link>
            
            <div className="mx-2">
              <RoleSwitcher />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="header-link cursor-pointer">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Perfil</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                <DropdownMenuLabel>Olá, {user?.name?.split(' ')[0] || user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="hover:bg-gray-700 cursor-pointer focus:bg-gray-700"
                  onClick={() => navigate('/dashboard/account')}
                >
                  <User className="mr-2 h-4 w-4" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-gray-700 cursor-pointer focus:bg-gray-700"
                  onClick={() => navigate('/dashboard/email')}
                >
                  <Mail className="mr-2 h-4 w-4" /> Mudar Email
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="hover:bg-gray-700 cursor-pointer focus:bg-gray-700"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
