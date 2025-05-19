import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import '../styles/register.css'; // Usando o novo CSS específico para a página de registro

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: 'John Front End',
    email: 'johnfrontend@gmail.com',
    password: '***************'
  });
  const [showPassword, setShowPassword] = useState(false);
  
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
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Erro no cadastro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    // Mock registration - in a real app, you would send to a backend
    signup({
      id: 'user-' + Date.now(),
      name: formData.name,
      email: formData.email,
    });
    
    toast({
      title: "Sucesso!",
      description: "Sua conta foi criada com sucesso."
    });
    
    navigate('/');
  };
  
  return (
    <div className="register-container">
      {/* Logo à esquerda */}
      <div className="logo">
        <img src="/lovable-uploads/logo_preta.png" alt="Logo Cuencos" />
      </div>
      
      {/* Texto promocional à esquerda */}
      <div className="promo-text">
        <p>Crie sua conta e seja avisado sobre promoções e novas festas!</p>
      </div>
      
      {/* Card de cadastro */}
      <div className="register-card">
        <h1>CADASTRE-SE!</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
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
              ></span>
            </div>
          </div>
          
          <button type="submit" className="continue-btn">CONTINUAR</button>
        </form>
        
        {/* Divisor "Ou" estilizado */}
        <div className="divider-container">
          <hr className="divider-line" />
          <span className="divider-text">Ou</span>
          <hr className="divider-line" />
        </div>
        
        <div className="google-login">
          <img src="/lovable-uploads/google.png" alt="Google" />
          <span>Faça login com o Google</span>
        </div>
        
        {/* Link de login mantido dentro do card */}
        <div className="login-link">
          <span>Já tem login? </span>
          <Link to="/login">FAÇA LOGIN AQUI</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
