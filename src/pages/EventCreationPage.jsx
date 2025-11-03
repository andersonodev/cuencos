import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import Footer from '../components/Footer';
import EditionStep from '../components/eventCreation/EditionStep';
import CoverStep from '../components/eventCreation/CoverStep';
import TicketStep from '../components/eventCreation/TicketStep';
import ReviewStep from '../components/eventCreation/ReviewStep';
import ProgressBar from '../components/eventCreation/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { updateEvent, addEvent, getEventById, deleteEvent } from '../lib/events';
import DeleteEventModal from '../components/DeleteEventModal';

const EventCreationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isOrganizer } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    image: null,
    ticketType: 'paid',
    ticketName: '',
    ticketPrice: '',
    isDraft: true,
    createdBy: user?.id || user?.email
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const loadEventData = async () => {
      if (!user) {
        toast({
          title: "Acesso restrito",
          description: "Faça login para criar ou editar eventos",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // If we have an ID, try to load existing event data
      if (id && id !== 'new') {
        try {
          console.log('Carregando evento da API para edição:', id);
          const event = await getEventById(parseInt(id));
          
          if (!event) {
            toast({
              title: "Evento não encontrado",
              description: "O evento que você está tentando editar não existe na API",
              variant: "destructive",
            });
            navigate('/dashboard/management');
            return;
          }

          console.log('Evento carregado da API:', event.title);
          
          // Format event data for form
          setEventData({
            title: event.title || '',
            description: event.description || '',
            category: event.category || '',
            date: event.date?.split(' de ')[0] || '',
            startTime: event.time?.split(' - ')[0] || '',
            endTime: event.time?.split(' - ')[1] || '',
            location: event.location || '',
            image: event.image || null,
            ticketType: event.price > 0 ? 'paid' : 'free',
            ticketName: event.ticketName || 'Ingresso Padrão',
            ticketPrice: event.price?.toString() || '0',
            isDraft: event.isDraft || false,
            createdBy: event.createdBy || user?.id || user?.email
          });
        } catch (error) {
          console.error('Error loading event from API:', error);
          toast({
            title: "Erro ao carregar evento",
            description: "Não foi possível carregar os dados do evento da API",
            variant: "destructive",
          });
        }
      } else {
        // Check if we have draft data in localStorage
        try {
          const editionData = localStorage.getItem('eventoDraft_edicao');
          const coverData = localStorage.getItem('eventoDraft_capa');
          const ticketData = localStorage.getItem('eventoDraft_ingresso');

          if (editionData) {
            const parsedData = JSON.parse(editionData);
            setEventData(prev => ({ ...prev, ...parsedData }));
          }

          if (coverData) {
            const parsedCover = JSON.parse(coverData);
            setEventData(prev => ({ ...prev, image: parsedCover.image }));
          }

          if (ticketData) {
            const parsedTicket = JSON.parse(ticketData);
            setEventData(prev => ({ ...prev, ...parsedTicket }));
          }
        } catch (error) {
          console.error('Error loading draft data:', error);
        }
      }

      setIsLoading(false);
    };

    loadEventData();
  }, [id, user, isOrganizer, navigate, toast]);

  const steps = [
    { name: 'Edição', component: EditionStep },
    { name: 'Capa', component: CoverStep },
    { name: 'Ingresso', component: TicketStep },
    { name: 'Revisão', component: ReviewStep },
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleEditionSave = (editionFormData) => {
    const updatedData = { ...eventData, ...editionFormData };
    setEventData(updatedData);
    
    // Save to localStorage
    localStorage.setItem('eventoDraft_edicao', JSON.stringify(updatedData));
    
    goToNextStep();
  };

  const handleCoverSave = (coverFormData) => {
    const updatedData = { 
      ...eventData, 
      image: coverFormData.image, // Esta será a imagem em base64 ou URL
      imageFile: coverFormData.imageFile // Informações do arquivo
    };
    setEventData(updatedData);
    
    // Save to localStorage - salvar a imagem em base64
    localStorage.setItem('eventoDraft_capa', JSON.stringify({ 
      image: coverFormData.image,
      imageFile: coverFormData.imageFile 
    }));
    
    goToNextStep();
  };

  const handleTicketSave = (ticketFormData) => {
    const updatedData = { ...eventData, ...ticketFormData };
    setEventData(updatedData);
    
    // Save to localStorage
    localStorage.setItem('eventoDraft_ingresso', JSON.stringify(ticketFormData));
    
    goToNextStep();
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      
      // Preparar dados para publicação
      const publishData = {
        ...eventData,
        isDraft: false, // Publicar imediatamente
        featured: false, // Pode ser alterado depois
        createdBy: user?.id || user?.email || 'organizador@cuencos.com'
      };
      
      let result;
      if (id && id !== 'new') {
        // Atualizar evento existente
        result = await updateEvent(parseInt(id), publishData);
        toast({
          title: "Evento atualizado!",
          description: "Seu evento foi atualizado e publicado com sucesso",
          variant: "success",
        });
      } else {
        // Criar novo evento
        result = await addEvent(publishData);
        toast({
          title: "Evento publicado!",
          description: "Seu evento foi criado e publicado com sucesso",
          variant: "success",
        });
      }
      
      // Limpar dados temporários
      ['eventoDraft_edicao', 'eventoDraft_capa', 'eventoDraft_ingresso'].forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Redirecionar para a página de gerenciamento
      navigate('/dashboard/management');
      
    } catch (error) {
      console.error('Erro ao publicar evento:', error);
      toast({
        title: "Erro ao publicar",
        description: error.message || "Não foi possível publicar o evento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true);
      
      // Preparar dados para rascunho
      const draftData = {
        ...eventData,
        isDraft: true,
        createdBy: user?.id || user?.email || 'organizador@cuencos.com'
      };
      
      let result;
      if (id && id !== 'new') {
        // Atualizar rascunho existente
        result = await updateEvent(parseInt(id), draftData);
        toast({
          title: "Rascunho salvo!",
          description: "Suas alterações foram salvas",
          variant: "success",
        });
      } else {
        // Criar novo rascunho
        result = await addEvent(draftData);
        toast({
          title: "Rascunho salvo!",
          description: "Seu evento foi salvo como rascunho",
          variant: "success",
        });
      }
      
      // Redirecionar para o dashboard
      navigate('/dashboard/management');
      
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o rascunho",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirmation = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    try {
      if (!eventId) return;
      
      deleteEvent(parseInt(eventId));
      
      toast({
        title: "Evento excluído",
        description: "O evento foi excluído com sucesso",
        variant: "success",
      });
      
      setDeleteModalOpen(false);
      
      navigate('/dashboard/management');
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o evento",
        variant: "destructive",
      });
    }
  };
  
  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  const getPageTitle = () => {
    if (id && id !== 'new') {
      return eventData.title || "Editar Evento";
    }
    return "Criar Novo Evento";
  };

  const handleComponentProps = () => {
    const isEditMode = id && id !== 'new';
    
    switch (currentStep) {
      case 0:
        return {
          onSave: handleEditionSave,
          initialData: eventData,
          onBack: () => navigate('/dashboard/management'),
          onDelete: handleDeleteConfirmation,
          isEditMode
        };
      case 1:
        return {
          onSave: handleCoverSave,
          initialData: eventData,
          onBack: goToPreviousStep,
          onDelete: handleDeleteConfirmation,
          isEditMode
        };
      case 2:
        return {
          onSave: handleTicketSave,
          initialData: eventData,
          onBack: goToPreviousStep,
          onDelete: handleDeleteConfirmation,
          isEditMode
        };
      case 3:
        return {
          eventData: eventData,
          onPublish: handlePublish,
          onSaveAsDraft: handleSaveAsDraft,
          onBack: goToPreviousStep,
          onDelete: handleDeleteConfirmation,
          isEditMode
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <DashboardHeader user={user} />
      
      <div className="flex-grow px-4 sm:px-6 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-400 hover:text-white mb-4 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
        </div>
        
        <ProgressBar 
          steps={steps.map(s => s.name)} 
          currentStep={currentStep} 
        />
        
        <div className="my-8">
          {CurrentStepComponent && (
            <CurrentStepComponent 
              {...handleComponentProps()} 
            />
          )}
        </div>
        
        {/* Remover botão de exclusão daqui, pois agora está em cada etapa */}
        
      </div>
      
      {/* Modal de confirmação de exclusão */}
      <DeleteEventModal 
        isOpen={deleteModalOpen}
        event={eventData}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
      
      <Footer />
    </div>
  );
};

export default EventCreationPage;
