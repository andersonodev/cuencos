import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/use-toast';
import '../styles/login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Estado para armazenar os valores dos campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Obter a página para onde redirecionar após o login
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro no login",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Verificação especial para login de organizador
      if (email === 'organizador@cuencos.com' && password === 'admin123') {
        // Armazenar dados do organizador no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify({
          tipo: 'organizador',
          nome: 'Organizador Cuencos',
          email: 'organizador@cuencos.com'
        }));
        
        toast({
          title: "Login realizado!",
          description: "Bem-vindo, Organizador Cuencos!",
        });
        
        navigate('/dashboard');
        return;
      }
      
      // Login regular para outros usuários
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo de volta, ${result.user.name?.split(' ')[0] || result.user.email}!`,
        });
        // Redireciona para a página anterior ou home
        navigate(from, { replace: true });
      } else {
        toast({
          title: "Erro no login",
          description: result.message || "Usuário ou senha incorretos.",
          variant: "destructive"
        });
      }
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
    <div className="login-container">
      {/* Logo à esquerda */}
      <div className="logo">
        <img src="/images/logo-roxa-pura.png" alt="Logo Cuencos" />
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
            <label htmlFor="email">Email ou Nome de Usuário</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="fronted ou johnfrontend@gmail.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="admin123"
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
          <img src="/images/google.png" alt="Google" />
          <span>Faça login com o Google</span>
        </div>
        
        {/* Link de registro */}
        <div className="signup-link">
          <span>Ainda não tem cadastro? </span>
          <Link to="/register">CLIQUE AQUI</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
