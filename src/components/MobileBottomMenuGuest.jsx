import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Home } from 'lucide-react';
import './MobileBottomMenu.css'; // Reutilizar o mesmo CSS

const MobileBottomMenuGuest = () => {
  return (
    <nav className="mobile-bottom-menu">
      <Link to="/" className="menu-item">
        <Home size={24} className="menu-icon" />
        <span>Home</span>
      </Link>
      <Link to="/login" className="menu-item">
        <img
          src="./assets/icons/icone-ingresso.png"
          alt="Venda aqui"
          className="menu-icon"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik01LjUgMmgxM2w0IDgtNCA4aC0xM2wtNC04IDQtOFoiPjwvcGF0aD48cGF0aCBkPSJNMTIgNnY4Ij48L3BhdGg+PHBhdGggZD0iTTggMTBoOCI+PC9wYXRoPjwvc3ZnPg==';
          }}
        />
        <span>Venda aqui</span>
      </Link>
      <Link to="/login" className="menu-item">
        <LogIn size={24} className="menu-icon" />
        <span>Login</span>
      </Link>
    </nav>
  );
};

export default MobileBottomMenuGuest; 