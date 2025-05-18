
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
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
    <div className="min-h-screen flex flex-col bg-rio-gradient bg-cover bg-center">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <Link to="/" className="text-cuencos-purple font-bold text-2xl">
              <img src="/logo.png" alt="Cuencos" className="h-8 inline-block mr-2" />
              Cuencos
            </Link>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">BEM-VINDO DE VOLTA!</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="johnfrontend@gmail.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-cuencos-purple/30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="************"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-cuencos-purple/30"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-cuencos-purple hover:bg-cuencos-darkPurple text-white rounded-md font-semibold transition-colors"
            >
              CONTINUAR
            </button>
          </form>
          
          <div className="my-6 text-center">
            <span className="text-gray-500 text-sm">Ou</span>
          </div>
          
          <button 
            type="button" 
            className="w-full py-2.5 border border-gray-300 rounded-md flex items-center justify-center mb-4"
          >
            <img src="/google-logo.png" alt="Google" className="h-5 mr-3" />
            <span className="text-gray-700">Faça login com o Google</span>
          </button>
          
          <div className="text-center mt-6">
            <span className="text-gray-600">Ainda não tem cadastro?</span>{' '}
            <Link to="/register" className="text-cuencos-purple font-semibold hover:underline">
              CLIQUE AQUI
            </Link>
          </div>
        </div>
      </div>
      
      <div className="text-center pb-4">
        <p className="text-white text-sm">Encontre as melhores festas universitárias com facilidade e a qualquer hora!</p>
      </div>
    </div>
  );
};

export default LoginPage;
