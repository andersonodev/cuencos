
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(credentials.email, credentials.password);
      
      if (result.success) {
        toast({
          description: "Login realizado com sucesso!",
          duration: 2000,
        });
        
        // Redirect to the page the user was trying to access or to home
        const from = location.state?.from || '/';
        navigate(from);
      } else {
        toast({
          variant: "destructive",
          description: result.message || "Credenciais inválidas. Tente novamente.",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Ocorreu um erro ao fazer login. Tente novamente mais tarde.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" 
           style={{backgroundImage: 'url(/public/loginimage.png)'}}>
      </div>
      
      <div className="w-full md:w-1/2 bg-black py-8 px-4 md:px-16 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src="/lovable-uploads/ticket-icon-purple.svg" alt="Cuencos" className="w-8 h-8" />
            <h1 className="text-3xl font-bold text-white">Cuencos</h1>
          </Link>
          
          <h2 className="text-2xl font-bold text-white mb-6">Bem-vindo(a) de volta!</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cuencos-purple"
                placeholder="Seu endereço de e-mail"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="block text-gray-300">Senha</label>
                <a href="#" className="text-cuencos-purple text-sm">Esqueceu a senha?</a>
              </div>
              <input
                id="password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cuencos-purple"
                placeholder="Sua senha"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-md text-white font-medium ${
                isLoading ? 'bg-cuencos-purple/70' : 'bg-cuencos-purple hover:bg-cuencos-darkPurple'
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-8">
            <p className="text-gray-400 text-center">
              Não tem uma conta? <Link to="/register" className="text-cuencos-purple hover:underline">Cadastre-se</Link>
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 mb-4">Entre também com</p>
            <button className="bg-white text-black px-6 py-2 rounded-md flex items-center justify-center gap-2 w-full hover:bg-gray-100 transition-colors">
              <img src="/google-logo.png" alt="Google" className="w-5 h-5" />
              <span>Continuar com Google</span>
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 text-center">
            <p>
              Ao entrar você concorda com nossos <a href="#" className="text-cuencos-purple hover:underline">Termos de Serviço</a> e <a href="#" className="text-cuencos-purple hover:underline">Política de Privacidade</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
