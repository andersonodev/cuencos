import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/ui/auth-layout';
import '../styles/auth.css';
import '../styles/global.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOrganizadorInfo, setShowOrganizadorInfo] = useState(false);
  
  // Obter a página para onde redirecionar após o login
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Login automático - não precisa validar os campos
    // O usuário já está sempre logado, apenas redireciona para o dashboard
    try {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Cuencos!",
      });
      
      // Redirecionar direto para o dashboard
      console.log("Redirecionando para dashboard");
      navigate('/dashboard', { replace: true });
      
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout
      backgroundImage="./assets/events/imagerio.png"
      promoText="Conectando você a experiências universitárias únicas e inesquecíveis."
      cardPosition="right"
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Acesse sua conta</h1>
      
      {/* Mensagem de boas-vindas */}
      <div className="welcome-message">
        BEM-VINDO DE VOLTA!
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email ou Nome de Usuário</label>
          <input
            type="text"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isLoading}
            placeholder="fronted ou johnfrontend@gmail.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <div className="password-input" style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
              placeholder="admin123"
              style={{ paddingRight: '2.5rem', width: '100%' }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
        <img src="./assets/icons/icon-google.png" alt="Google" />
        <span>Faça login com o Google</span>
      </div>
      
      {/* Link de registro */}
      <div className="signup-link">
        <span>Ainda não tem cadastro? </span>
        <Link to="/register">CLIQUE AQUI</Link>
      </div>
      
      {/* Info sobre organizador */}
      <div className="login-info">
        <button 
          type="button" 
          className="info-button"
          onClick={() => navigate('/coming-soon')}
        >
          Se cadastrar como organizador? Clique aqui
        </button>
        
        {showOrganizadorInfo && (
          <div className="organizador-info">
            <p>Para testar como organizador, use:</p>
            <p>Email: organizador@teste.com</p>
            <p>Senha: senha123</p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
