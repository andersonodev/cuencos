import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import './MobileBottomMenu.css';

const MobileBottomMenu = ({ onLogout }) => {
  return (
    <nav className="mobile-bottom-menu">
      <Link to="/" className="menu-item">
        <Home size={24} className="menu-icon" />
        <span>Home</span>
      </Link>
      <Link to="/favorites" className="menu-item">
        <img
          src="/assets/icons/star.png"
          alt="Favoritos"
          className="menu-icon"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiI+PC9wb2x5Z29uPjwvc3ZnPg==';
          }}
        />
        <span>Favoritos</span>
      </Link>
      <Link to="/my-tickets" className="menu-item">
        <img
          src="/assets/icons/icone-ingresso.png"
          alt="Ingressos"
          className="menu-icon"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik01LjUgMmgxM2w0IDgtNCA4aC0xM2wtNC04IDQtOFoiPjwvcGF0aD48cGF0aCBkPSJNMTIgNnY4Ij48L3BhdGg+PHBhdGggZD0iTTggMTBoOCI+PC9wYXRoPjwvc3ZnPg==';
          }}
        />
        <span>Ingressos</span>
      </Link>
      <Link to="/account" className="menu-item">
        <img
          src="/assets/icons/profilebutton.png"
          alt="Perfil"
          className="menu-icon"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNSI+PC9jaXJjbGU+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIj48L3BhdGg+PC9zdmc+';
          }}
        />
        <span>Perfil</span>
      </Link>
      <button className="menu-item" onClick={onLogout}>
        <LogOut size={24} className="menu-icon" />
        <span>Sair</span>
      </button>
    </nav>
  );
};

export default MobileBottomMenu; 