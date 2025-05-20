
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DashboardManagementPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'products', 'drafts'
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

  // Dados dos eventos ativos
  const activeEvents = [
    { 
      id: 1, 
      nome: "PUC IN RIO", 
      imagem: "/images/puc-in-rio.jpg"
    },
    { 
      id: 2, 
      nome: "BLACK OUT", 
      imagem: "/images/blackout.jpg"
    },
    { 
      id: 3, 
      nome: "CLUBE HOUSE", 
      imagem: "/images/clubhouse.jpg"
    }
  ];

  // Dados dos rascunhos
  const drafts = [
    { 
      id: 1, 
      nome: "PUC IN RIO", 
      imagem: "/images/puc-in-rio.jpg"
    }
  ];

  // Dados para a tabela de produtos mais vendidos
  const popularEvents = [
    { id: "01", nome: "PUC IN RIO", popularidade: 84, color: "bg-amber-500" },
    { id: "02", nome: "Engenharias Paranaense 2025 com...", popularidade: 44, color: "bg-cyan-400" },
  ];

  if (isLoading) {
    return <div className="dashboard-loading">Carregando...</div>;
  }

  // Componente de evento (card)
  const EventCard = ({ event }) => (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden">
      <img 
        src={event.imagem} 
        alt={event.nome} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-white font-bold text-xl mb-3">{event.nome}</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            className="border border-gray-500 text-white hover:border-cuencos-purple hover:text-cuencos-purple"
          >
            Detalhes
          </Button>
          <Button 
            variant="outline"
            className="border border-gray-500 text-white hover:border-cuencos-purple hover:text-cuencos-purple"
          >
            Editar
          </Button>
          <Button 
            className="bg-cuencos-purple text-white hover:bg-cuencos-darkPurple"
          >
            Visualizar
          </Button>
        </div>
      </div>
    </div>
  );

  // Componente de rascunho (card)
  const DraftCard = ({ draft }) => (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden">
      <img 
        src={draft.imagem} 
        alt={draft.nome} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-white font-bold text-xl mb-3">{draft.nome}</h3>
        <Button 
          className="bg-cuencos-purple text-white hover:bg-cuencos-darkPurple w-full"
        >
          Continuar edição
        </Button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <DashboardHeader user={user} />
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="bg-[#2D2D2D] w-full md:w-64 flex-shrink-0 p-6">
          <h2 className="text-white font-bold text-xl mb-4">Configurações da Conta</h2>
          
          <nav className="flex flex-col space-y-2">
            <a 
              href="#" 
              className="text-gray-300 py-2 px-3 rounded hover:bg-cuencos-purple/10 hover:text-white transition-colors"
            >
              Informação da Conta
            </a>
            <a 
              href="#" 
              className="text-cuencos-purple py-2 px-3 rounded bg-cuencos-purple/10 font-medium"
            >
              Gerenciamento de Eventos
            </a>
            <a 
              href="#" 
              className="text-gray-300 py-2 px-3 rounded hover:bg-cuencos-purple/10 hover:text-white transition-colors"
            >
              Mudar email
            </a>
          </nav>
        </aside>
        
        {/* Conteúdo principal */}
        <main className="bg-black flex-grow p-6">
          {/* Seção de Eventos */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-cuencos-purple text-2xl font-bold">Eventos</h1>
            <Button 
              className="bg-cuencos-purple text-white hover:bg-cuencos-darkPurple"
            >
              Criar Evento
            </Button>
          </div>
          
          {/* Cards de eventos ativos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {activeEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {/* Seção de Rascunhos */}
          <div className="mb-6">
            <h2 className="text-cuencos-purple text-xl font-bold mb-4">Rascunhos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map(draft => (
                <DraftCard key={draft.id} draft={draft} />
              ))}
            </div>
          </div>

          {/* Seção de Produtos mais vendidos */}
          <div className="mt-12">
            <h2 className="text-cuencos-purple text-xl font-bold mb-4">Produtos mais vendidos</h2>
            <Card className="bg-[#1e1e1e] border-gray-800 shadow-lg">
              <CardContent className="p-4">
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
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default DashboardManagementPage;
