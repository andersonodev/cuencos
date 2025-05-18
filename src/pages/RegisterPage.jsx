
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
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
    
    // Navigate to homepage
    navigate('/');
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
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">VAMOS COMEÇAR</h2>
          <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">Cadastre-se!</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Front End"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-cuencos-purple/30"
              />
            </div>
            
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
            <span className="text-gray-600">Já tem login?</span>{' '}
            <Link to="/login" className="text-cuencos-purple font-semibold hover:underline">
              FAÇA LOGIN AQUI
            </Link>
          </div>
        </div>
      </div>
      
      <div className="text-center pb-4">
        <p className="text-white text-sm">Crie sua conta e seja avisado sobre promoções e novas festas!</p>
      </div>
    </div>
  );
};

export default RegisterPage;
