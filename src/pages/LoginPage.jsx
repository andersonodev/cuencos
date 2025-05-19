import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import '../styles/login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: 'johnfrontend@gmail.com',
    password: '***************'
  });
  const [showPassword, setShowPassword] = useState(false);
  
  // Get the next page to navigate to after login
  const from = location.state?.from || '/';
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Erro de login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    // Mock login - in a real app, you would validate with a backend
    login({
      id: 'user-123',
      name: 'Beto Cuenca',
      email: formData.email,
      phone: '(21) 99997-9888'
    });
    
    // Navigate to the next page
    navigate(from);
  };
  
  return (
    <div className="login-container">
      {/* Logo à esquerda */}
      <div className="logo">
        <img src="/lovable-uploads/logo_preta.png" alt="Logo Cuencos" />
      </div>
      
      {/* Texto promocional à esquerda */}
      <div className="promo-text">
        <p>Encontre as melhores festas universitárias com facilidade e a qualquer hora!</p>
      </div>
      
      {/* Card de login */}
      <div className="login-card">
        <h1>BEM-VINDO DE VOLTA!</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span 
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          
          <button type="submit" className="continue-btn">CONTINUAR</button>
        </form>
        
        <div className="divider">
          <span>Ou</span>
        </div>
        
        <div className="google-login">
          <img src="/lovable-uploads/google.png" alt="Google" />
          <span>Faça login com o Google</span>
        </div>
        
        <div className="signup-link">
          <span>Ainda não tem cadastro? </span>
          <Link to="/register">CLIQUE AQUI</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
