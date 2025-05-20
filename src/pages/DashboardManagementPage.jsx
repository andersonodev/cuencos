
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import Footer from '../components/Footer';
import '../styles/dashboard.css';
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

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
        toast({
          variant: "destructive",
          title: "Acesso restrito",
          description: "Essa área é exclusiva para organizadores",
        });
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

  // Dados para a tabela de produtos mais vendidos
  const popularEvents = [
    { id: "01", nome: "PUC IN RIO", popularidade: 84, color: "bg-amber-500" },
    { id: "02", nome: "Engenharias Paranaense 2025 com...", popularidade: 44, color: "bg-cyan-400" },
  ];

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
              <h2>Produtos mais vendidos</h2>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-800">
                  <TableHead className="text-gray-400 font-medium w-16">#</TableHead>
                  <TableHead className="text-gray-400 font-medium">Nome</TableHead>
                  <TableHead className="text-gray-400 font-medium">Popularidade</TableHead>
                  <TableHead className="text-gray-400 font-medium w-24">Vendas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularEvents.map((event) => (
                  <TableRow key={event.id} className="border-b border-gray-800">
                    <TableCell className="text-gray-300">{event.id}</TableCell>
                    <TableCell className="text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                      {event.nome}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="w-full h-[6px] bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${event.color}`} 
                          style={{ width: `${event.popularidade}%`, transition: 'width 1s ease-in-out' }} 
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`text-right px-2 py-1 rounded ${event.popularidade >= 80 ? 'bg-amber-900/30 text-amber-500' : 'bg-cyan-900/30 text-cyan-400'}`}>
                        {event.popularidade}%
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardManagementPage;
