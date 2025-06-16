import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GuestNavbar from './GuestNavbar';
import Container from './ui/Container';
import '../styles/navbar.css';
import RoleSwitcher from './RoleSwitcher';
import MobileBottomMenu from './MobileBottomMenu';
import MobileTopBar from './MobileTopBar';

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Função para lidar com o logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Função para verificar se é organizador
  const isOrganizer = () => user && (user.role === 'organizador' || user.previousRole === 'organizador');

  if (!user) {
    return <GuestNavbar />;
  }

  const firstName = user && user.name ? user.name.split(' ')[0] : 'Usuário';

  if (isMobile) {
    return (
      <>
        <MobileTopBar />
        <MobileBottomMenu onLogout={handleLogout} />
      </>
    );
  }

  return (
    <>
      <header className="navbar">
        <Container padding={false}>
          <div className="navbar-container w-full">
            <Link to="/" className="navbar-logo header-mobile-logo">
              <img 
                src="/assets/logo/logocuencosroxa.png" 
                alt="Cuencos Logo" 
                className="logo-icon" 
              />
              <span className="logo-text-headeruser">Cuencos</span>
            </Link>
            <div className="navbar-right header-desktop-menu">
              <Link to="/favorites" className="nav-item">
                <img 
                  src="/assets/icons/star.png" 
                  alt="Favoritos" 
                  className="nav-icon"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5Z29uIHBvaW50cz0iMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMiI+PC9wb2x5Z29uPjwvc3ZnPg==';
                  }}
                />
                <span>Favoritos</span>
              </Link>
              <Link to="/my-tickets" className="nav-item">
                <img 
                  src="/assets/icons/icone-ingresso.png" 
                  alt="Meus Ingressos" 
                  className="nav-icon"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik01LjUgMmgxM2w0IDgtNCA4aC0xM2wtNC04IDQtOFoiPjwvcGF0aD48cGF0aCBkPSJNMTIgNnY4Ij48L3BhdGg+PHBhdGggZD0iTTggMTBoOCI+PC9wYXRoPjwvc3ZnPg==';
                  }}
                />
                <span>Meus Ingressos</span>
              </Link>
              {isOrganizer() && (
                <div className="nav-item">
                  <RoleSwitcher />
                </div>
              )}
              <Link to="/account" className="nav-item">
                <img 
                  src="/assets/icons/profilebutton.png" 
                  alt="Perfil" 
                  className="nav-icon"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjEyIiBjeT0iOCIgcj0iNSI+PC9jaXJjbGU+PHBhdGggZD0iTTIwIDIxYTggOCAwIDAgMC0xNiAwIj48L3BhdGg+PC9zdmc+';
                  }}
                />
                <span>Perfil{isOrganizer() ? ' (Organizador)' : ''}</span>
              </Link>
              <button onClick={handleLogout} className="nav-item">
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </Container>
      </header>
      <MobileBottomMenu onLogout={handleLogout} />
    </>
  );
};

export default Header;
