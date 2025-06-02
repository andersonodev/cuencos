import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { getEventById } from '../lib/events';
import { getTicketsByUserId } from '../lib/tickets';

const TicketSelectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTicketForEvent, setHasTicketForEvent] = useState(false);
  
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setIsLoading(true);
        console.log('Carregando evento para seleção de tickets:', id);
        
        const eventData = await getEventById(parseInt(id));
        console.log('Evento carregado:', eventData);
        
        if (eventData) {
          setEvent(eventData);
        } else {
          console.error('Evento não encontrado');
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao carregar evento:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    const checkExistingTicket = async () => {
      if (user && id) {
        try {
          const tickets = await getTicketsByUserId(user.id || user.email);
          const hasTicket = tickets.some(ticket => 
            ticket.eventId == id && ticket.status === 'active'
          );
          
          if (hasTicket) {
            setHasTicketForEvent(true);
            toast({
              title: "Você já possui ingresso",
              description: "Você já comprou ingresso para este evento.",
              variant: "warning"
            });
            navigate('/my-tickets');
            return;
          }
        } catch (error) {
          console.error('Erro ao verificar tickets existentes:', error);
        }
      }
    };
    
    if (id) {
      loadEvent();
      checkExistingTicket();
    }
  }, [id, navigate, user]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-white">Evento não encontrado</p>
        </div>
        <Footer />
      </div>
    );
  }

  const increaseQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleProceed = () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}/buy` } });
      return;
    }
    
    if (!event) {
      console.error('Evento não carregado');
      return;
    }
    
    // Armazenar a seleção de ingressos no localStorage
    const ticketSelection = {
      eventId: parseInt(event.id),
      eventTitle: event.title,
      ticketType: event.ticketName || `Ingresso: ${event.title}`,
      quantity,
      unitPrice: event.price || 0,
      totalPrice: (event.price || 0) * quantity,
      timestamp: Date.now(),
    };
    
    console.log('Salvando seleção de ticket:', ticketSelection);
    localStorage.setItem('ticketSelection', JSON.stringify(ticketSelection));
    navigate('/checkout');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate(`/events/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow">
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Selecione o Ticket"
        >
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-white">Tipos de Ingresso</div>
              <div className="text-white">Quantidade</div>
            </div>
            
            <div className="flex items-center justify-between bg-cuencos-gray p-4 rounded-md border-l-4 border-cuencos-purple mb-8">
              <div>
                <h3 className="text-xl font-medium text-white">
                  {event.ticketName || 'Sexto Lote'}
                </h3>
                <p className="text-white">
                  {event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={decreaseQuantity}
                  className="w-10 h-10 rounded-full bg-cuencos-black border border-gray-600 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-2xl text-white min-w-[2rem] text-center">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="w-10 h-10 rounded-full bg-cuencos-black border border-gray-600 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-cuencos-gray pt-4 pb-4">
            <div className="flex justify-between text-lg text-white">
              <span>Qtd: <span className="text-cuencos-purple">{quantity}</span></span>
              <span>Total: <span className="text-cuencos-purple">
                {event.price > 0 ? `R$ ${(event.price * quantity).toFixed(2)}` : 'Gratuito'}
              </span></span>
            </div>
          </div>
          
          <button 
            onClick={handleProceed}
            className="w-full bg-cuencos-purple hover:bg-cuencos-darkPurple text-white py-4 rounded-md text-lg font-medium flex items-center justify-center transition-colors"
          >
            Proceed <span className="ml-2">→</span>
          </button>
        </Modal>
      </div>
      
      <Footer />
    </div>
  );
};

export default TicketSelectionPage;
