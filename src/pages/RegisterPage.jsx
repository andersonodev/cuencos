import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../lib/auth';
import { toast } from '../components/ui/use-toast';
import AuthLayout from '../components/ui/auth-layout';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    tipo: 'cliente'  // Valor padrão: cliente
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Verifica se há um parâmetro de consulta para definir o tipo de usuário
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('role') === 'organizer') {
      setFormData(prev => ({ ...prev, tipo: 'organizador' }));
    }
  }, [location]);
  
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
      // Se for organizador, redireciona para o dashboard
      if (formData.tipo === 'organizador') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      toast({
        title: "Erro no cadastro",
        description: result.message || "Ocorreu um erro ao criar sua conta.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };
  
  const isOrganizerRegistration = formData.tipo === 'organizador';
  
  return (
    <AuthLayout
      backgroundImage="./assets/events/imagerio.png"
      promoText="Crie sua conta e conecte-se a experiências universitárias únicas e inesquecíveis."
      cardPosition="right"
    >
      {/* Conteúdo do card de registro */}
      {isOrganizerRegistration ? (
        <h1 className="text-center text-2xl font-medium mb-6 text-gray-900">Cadastro de Organizador</h1>
      ) : (
        <div className="mb-6">
          <div className="text-sm text-purple-600 font-medium text-center mb-2">VAMOS COMEÇAR</div>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Cadastre-se!</h1>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo*
          </label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input 
            type="email" 
            id="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha*
          </label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Campo oculto para o tipo */}
        <input 
          type="hidden" 
          name="tipo" 
          value={formData.tipo} 
        />
        
        <button 
          type="submit" 
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200"
          disabled={isLoading}
        >
          {isLoading ? "PROCESSANDO..." : "CONTINUAR"}
        </button>
      </form>
      
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">Ou</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
      
      <button 
        className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
        onClick={() => {
          // Implementar login com Google
          toast({
            title: "Em breve",
            description: "Login com Google será implementado em breve!",
            duration: 3000,
          });
        }}
      >
        <img src="/assets/icons/icon-google.png" alt="Google" className="h-5 w-5 mr-3" />
        <span className="text-gray-700">Faça login com o Google</span>
      </button>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">Já tem login? </span>
        <Link to="/login" className="text-purple-600 hover:text-purple-800 font-medium">
          FAÇA LOGIN AQUI
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
