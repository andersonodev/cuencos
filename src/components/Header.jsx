
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-cuencos-black py-4 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-cuencos-purple font-bold text-2xl flex items-center">
          <img src="/logo.png" alt="Cuencos" className="h-8 mr-2" />
          Cuencos
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/favorites" className="text-white hover:text-cuencos-purple">
                <div className="flex flex-col items-center">
                  <span className="text-xl">⭐</span>
                  <span className="text-xs">Favoritos</span>
                </div>
              </Link>
              <Link to="/my-tickets" className="text-white hover:text-cuencos-purple">
                <div className="flex flex-col items-center">
                  <span className="text-xl">🎟️</span>
                  <span className="text-xs">Meus Ingressos</span>
                </div>
              </Link>
              <div className="relative group">
                <button className="text-white hover:text-cuencos-purple flex items-center space-x-1">
                  <div className="flex flex-col items-center">
                    <span className="text-xl">👤</span>
                    <span className="text-xs">▼</span>
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-cuencos-black border border-cuencos-gray rounded-md shadow-lg hidden group-hover:block z-10">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-cuencos-gray">Perfil</Link>
                  <Link to="/account" className="block px-4 py-2 text-sm text-white hover:bg-cuencos-gray">Configurações</Link>
                  <Link to="/logout" className="block px-4 py-2 text-sm text-white hover:bg-cuencos-gray">Sair</Link>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login" className="bg-cuencos-purple hover:bg-cuencos-darkPurple text-white py-2 px-4 rounded-full">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
