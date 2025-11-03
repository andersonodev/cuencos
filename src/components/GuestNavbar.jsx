import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Container from './ui/Container';
import '../styles/navbar.css';
import MobileTopBarGuest from './MobileTopBarGuest';
import MobileBottomMenuGuest from './MobileBottomMenuGuest';

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const GuestNavbar = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Função para fazer login automático e redirecionar
  const handleLoginClick = (e) => {
    e.preventDefault();
    // Redirecionar direto para o dashboard
    navigate('/dashboard');
  };

  if (isMobile) {
    return (
      <>
        <MobileTopBarGuest />
        <MobileBottomMenuGuest />
      </>
    );
  }
  return (
    <header className="navbar">
      <Container padding={false}>
        <div className="navbar-container w-full">
          <Link to="/" className="navbar-logo">
            <img 
              src="./assets/logo/logocuencosroxa.png" 
              alt="Cuencos Logo" 
              className="logo-icon" 
            />
            <span className="logo-text-visitante">Cuencos</span>
          </Link>
          
          <div className="navbar-right">
            <Link to="/dashboard" className="nav-item">
              <img 
                src="./assets/icons/icone-ingresso.png" 
                alt="Venda aqui" 
                className="nav-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik01LjUgMmgxM2w0IDgtNCA4aC0xM2wtNC04IDQtOFoiPjwvcGF0aD48cGF0aCBkPSJNMTIgNnY4Ij48L3BhdGg+PHBhdGggZD0iTTggMTBoOCI+PC9wYXRoPjwvc3ZnPg==';
                }}
              />
              <span>Venda aqui</span>
            </Link>
            <button onClick={handleLoginClick} className="nav-item login-button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogIn size={20} />
              <span>Login</span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default GuestNavbar;
