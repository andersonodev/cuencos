import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../lib/auth'; // Importando a função de registro
import { toast } from '../components/ui/use-toast';
import '../styles/register.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''  // Adicionando campo de telefone para completar o cadastro
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validação simples
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Erro no cadastro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Tentativa de registro usando localStorage
    const result = registerUser(formData);
    
    if (result.success) {
      toast({
        title: "Cadastro realizado!",
        description: "Sua conta foi criada com sucesso.",
      });
      
      // Redireciona para a página inicial após cadastro bem-sucedido
      navigate('/');
    } else {
      toast({
        title: "Erro no cadastro",
        description: result.message || "Ocorreu um erro ao criar sua conta.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
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
            <label htmlFor="name">Nome Completo*</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha*</label>
            <div className="password-input">
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <span 
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="continue-btn"
            disabled={isLoading}
          >
            {isLoading ? "PROCESSANDO..." : "CONTINUAR"}
          </button>
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
        
        {/* Link de login */}
        <div className="login-link">
          <span>Já tem login? </span>
          <Link to="/login">FAÇA LOGIN AQUI</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
