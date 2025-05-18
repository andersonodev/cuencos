import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
    
    toast({
      title: "Sucesso!",
      description: "Sua conta foi criada com sucesso."
    });
    
    navigate('/');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-cuencos-gray p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-cuencos-purple mb-6 text-center">Criar conta</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-1">Nome completo</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-cuencos-black border border-gray-700 rounded-md p-2 text-white"
                placeholder="Digite seu nome completo"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-white mb-1">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-cuencos-black border border-gray-700 rounded-md p-2 text-white"
                placeholder="Digite seu e-mail"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-white mb-1">Senha</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-cuencos-black border border-gray-700 rounded-md p-2 text-white"
                placeholder="Digite sua senha"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-cuencos-purple hover:bg-cuencos-darkPurple text-white py-3 rounded-md font-medium"
            >
              Cadastrar
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-white">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-cuencos-purple hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
