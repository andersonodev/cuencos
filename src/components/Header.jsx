
import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isLoginPage) return null; // Hide header on login/register pages
  
  return (
    <header className="bg-cuencos-black shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/32356300-a01b-4b6e-ba0b-7a23804f784b.png" alt="Cuencos" className="h-8" />
          </Link>
          
          {/* Desktop Nav Links - Hidden on mobile */}
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" className={({isActive}) => isActive ? "text-cuencos-purple" : "text-white hover:text-cuencos-purple"}>
              Home
            </NavLink>
            <NavLink to="/search" className={({isActive}) => isActive ? "text-cuencos-purple" : "text-white hover:text-cuencos-purple"}>
              Explorar
            </NavLink>
          </div>
          
          {/* User Menu - Hidden on mobile */}
          <div className="hidden md:flex">
            {user ? (
              <div className="flex items-center space-x-4">
                <NavLink to="/my-tickets" className={({isActive}) => isActive ? "text-cuencos-purple" : "text-white hover:text-cuencos-purple"}>
                  Meus Ingressos
                </NavLink>
                <NavLink to="/favorites" className={({isActive}) => isActive ? "text-cuencos-purple" : "text-white hover:text-cuencos-purple"}>
                  Favoritos
                </NavLink>
                <div className="relative group">
                  <button className="flex items-center text-white">
                    <span className="mr-2">Olá, {user.name.split(' ')[0]}</span>
                    <span>▾</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <NavLink to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Perfil
                    </NavLink>
                    <NavLink to="/account" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Conta
                    </NavLink>
                    <NavLink to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Sair
                    </NavLink>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-white hover:text-cuencos-purple">
                  Entrar
                </Link>
                <Link to="/register" className="bg-cuencos-purple text-white px-4 py-1 rounded-md hover:bg-cuencos-darkPurple">
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <NavLink 
              to="/" 
              className={({isActive}) => 
                `block py-2 ${isActive ? "text-cuencos-purple" : "text-white"}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink 
              to="/search" 
              className={({isActive}) => 
                `block py-2 ${isActive ? "text-cuencos-purple" : "text-white"}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Explorar
            </NavLink>
            
            {user ? (
              <>
                <NavLink 
                  to="/my-tickets" 
                  className={({isActive}) => 
                    `block py-2 ${isActive ? "text-cuencos-purple" : "text-white"}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meus Ingressos
                </NavLink>
                <NavLink 
                  to="/favorites" 
                  className={({isActive}) => 
                    `block py-2 ${isActive ? "text-cuencos-purple" : "text-white"}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favoritos
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({isActive}) => 
                    `block py-2 ${isActive ? "text-cuencos-purple" : "text-white"}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Perfil
                </NavLink>
                <NavLink 
                  to="/account" 
                  className={({isActive}) => 
                    `block py-2 ${isActive ? "text-cuencos-purple" : "text-white"}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Conta
                </NavLink>
                <NavLink 
                  to="/logout" 
                  className={({isActive}) => 
                    `block py-2 ${isActive ? "text-cuencos-purple" : "text-white"}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sair
                </NavLink>
              </>
            ) : (
              <>
                <NavLink 
                  to="/login" 
                  className={({isActive}) => 
                    `block py-2 ${isActive ? "text-cuencos-purple" : "text-white"}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="block py-2 mt-2 bg-cuencos-purple text-white text-center rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </NavLink>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
