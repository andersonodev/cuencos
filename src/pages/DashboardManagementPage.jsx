
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
import { PlusCircle, Edit, Eye, FileText } from "lucide-react";
import { getEvents } from '../lib/events';
import { useAuth } from '../context/AuthContext';

const DashboardManagementPage = () => {
  const navigate = useNavigate();
  const { user, isOrganizer } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const { toast } = useToast();

  // Verificar se o usuário está logado e é um organizador
  useEffect(() => {
    if (!user) {
      toast({
        title: "Acesso restrito",
        description: "Faça login para acessar esta página",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!isOrganizer()) {
      toast({
        variant: "destructive",
        title: "Acesso restrito",
        description: "Essa área é exclusiva para organizadores",
      });
      navigate('/');
      return;
    }

    // Carregar dados dos eventos
    const loadEvents = () => {
      try {
        // Carregar eventos do localStorage via lib/events.js
        const allEvents = getEvents();
        
        // Separar eventos ativos e rascunhos (eventos com status draft)
        const activeEventsList = allEvents.filter(event => !event.isDraft);
        const draftsList = allEvents.filter(event => event.isDraft);
        
        setEvents(activeEventsList);
        setDrafts(draftsList);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar seus eventos",
        });
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [user, isOrganizer, navigate, toast]);

  // Dados para a tabela de produtos mais vendidos
  const popularEvents = [
    { id: "01", nome: "PUC IN RIO", popularidade: 84, color: "bg-amber-500" },
    { id: "02", nome: "Engenharias Paranaense 2025 com...", popularidade: 44, color: "bg-cyan-400" },
  ];

  // Função para criar um novo evento
  const handleCreateEvent = () => {
    // Criar um rascunho de evento
    const newDraft = {
      id: Date.now(),
      title: "Novo Evento",
      description: "Descrição do evento",
      image: "/lovable-uploads/placeholder.svg",
      isDraft: true,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    // Adicionar ao localStorage
    const allEvents = getEvents();
    allEvents.push(newDraft);
    localStorage.setItem('cuencos_events', JSON.stringify(allEvents));
    
    // Adicionar à lista de rascunhos
    setDrafts([...drafts, newDraft]);
    
    toast({
      title: "Rascunho criado",
      description: "Novo evento criado com sucesso!",
      variant: "success",
    });
    
    // Redirecionar para edição (em uma implementação real)
    // navigate(`/dashboard/management/event/${newDraft.id}/edit`);
  };

  // Funções para gerenciar eventos
  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleEditEvent = (eventId) => {
    toast({
      title: "Função em desenvolvimento",
      description: "A edição de eventos estará disponível em breve!",
    });
    // Implementação real: navigate(`/dashboard/management/event/${eventId}/edit`);
  };

  const handleEventDetails = (eventId) => {
    toast({
      title: "Função em desenvolvimento",
      description: "Os detalhes de eventos estarão disponíveis em breve!",
    });
    // Implementação real: navigate(`/dashboard/management/event/${eventId}`);
  };

  const handleContinueEditing = (draftId) => {
    toast({
      title: "Função em desenvolvimento",
      description: "A edição de rascunhos estará disponível em breve!",
    });
    // Implementação real: navigate(`/dashboard/management/event/${draftId}/edit`);
  };

  if (isLoading) {
    return <div className="dashboard-loading">Carregando...</div>;
  }

  // Componente de evento (card)
  const EventCard = ({ event }) => (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden">
      <img 
        src={event.image} 
        alt={event.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-white font-bold text-xl mb-3">{event.title}</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            className="border border-gray-500 text-white hover:border-cuencos-purple hover:text-cuencos-purple"
            onClick={() => handleEventDetails(event.id)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Detalhes
          </Button>
          <Button 
            variant="outline"
            className="border border-gray-500 text-white hover:border-cuencos-purple hover:text-cuencos-purple"
            onClick={() => handleEditEvent(event.id)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            className="bg-cuencos-purple text-white hover:bg-cuencos-darkPurple"
            onClick={() => handleViewEvent(event.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
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
        src={draft.image} 
        alt={draft.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-white font-bold text-xl mb-3">{draft.title}</h3>
        <Button 
          className="bg-cuencos-purple text-white hover:bg-cuencos-darkPurple w-full"
          onClick={() => handleContinueEditing(draft.id)}
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
              onClick={handleCreateEvent}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar Evento
            </Button>
          </div>
          
          {/* Cards de eventos ativos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.length > 0 ? (
              events.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-8">
                Você ainda não tem eventos ativos. Clique em "Criar Evento" para começar.
              </div>
            )}
          </div>
          
          {/* Seção de Rascunhos */}
          <div className="mb-6">
            <h2 className="text-cuencos-purple text-xl font-bold mb-4">Rascunhos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.length > 0 ? (
                drafts.map(draft => (
                  <DraftCard key={draft.id} draft={draft} />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-400 py-8">
                  Nenhum rascunho disponível.
                </div>
              )}
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
