
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import Footer from '../components/Footer';
import '../styles/dashboard.css';
import { useToast } from "@/components/ui/use-toast";

const DashboardManagementPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Verificar se o usuário está logado e é um organizador
  useEffect(() => {
    try {
      const loggedUser = JSON.parse(localStorage.getItem('usuarioLogado'));
      
      if (!loggedUser) {
        navigate('/login');
        return;
      }

      if (loggedUser.tipo !== 'organizador') {
        toast.error("Acesso restrito para organizadores");
        navigate('/');
        return;
      }

      setUser(loggedUser);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      navigate('/login');
    }
  }, [navigate, toast]);

  if (isLoading) {
    return <div className="dashboard-loading">Carregando...</div>;
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader user={user} />
      
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Gerenciamento de Eventos</h1>
          <p>Gerencie seus eventos, ingressos e configurações</p>
        </div>
        
        <div className="dashboard-grid management-content">
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Eventos</h2>
            </div>
            <p className="text-center py-8 text-gray-400">
              Em breve você poderá gerenciar seus eventos aqui.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardManagementPage;
