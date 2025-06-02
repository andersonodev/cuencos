import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEventById } from '../lib/events';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { toast } from '../components/ui/use-toast';
import '../styles/checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticketSelection, setTicketSelection] = useState(null);
  const [event, setEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadCheckoutData = async () => {
      const storedSelection = localStorage.getItem('ticketSelection');
      if (!storedSelection) {
        navigate('/');
        return;
      }
      
      try {
        const data = JSON.parse(storedSelection);
        
        // Verificar se os dados são recentes (menos de 24 horas)
        if (Date.now() - (data.timestamp || 0) > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('ticketSelection');
          navigate('/');
          return;
        }
        
        setTicketSelection(data);
        
        // Carregar dados do evento
        const eventData = await getEventById(data.eventId);
        if (eventData) {
          setEvent(eventData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do checkout:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCheckoutData();
  }, [navigate]);
  
  const closeModal = () => {
    setIsModalOpen(false);
    navigate(-1);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o campo está sendo editado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'Você deve aceitar os termos e condições';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro no formulário",
        description: "Por favor, corrija os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Preparar dados para o checkout
    const checkoutInfo = {
      eventId: ticketSelection.eventId,
      eventTitle: ticketSelection.eventTitle,
      ticketType: ticketSelection.ticketType,
      quantity: ticketSelection.quantity,
      unitPrice: ticketSelection.unitPrice,
      totalPrice: ticketSelection.totalPrice,
      participantInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || ''
      },
      finalTotal: ticketSelection.totalPrice,
      timestamp: Date.now()
    };
    
    // Salvar informações do checkout
    localStorage.setItem('checkoutInfo', JSON.stringify(checkoutInfo));
    
    // Redirecionar para página de sucesso
    navigate('/success');
  };
  
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
  
  if (!ticketSelection || !event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-white">Dados de checkout não encontrados</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow">
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Finalizar Compra"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resumo do pedido */}
            <div className="bg-cuencos-gray p-4 rounded-md mb-6">
              <h3 className="text-white font-medium mb-2">{ticketSelection.eventTitle}</h3>
              <p className="text-gray-300 text-sm">{ticketSelection.ticketType}</p>
              <p className="text-gray-300 text-sm">Quantidade: {ticketSelection.quantity}</p>
              <p className="text-white font-bold mt-2">
                Total: {ticketSelection.totalPrice > 0 ? `R$ ${ticketSelection.totalPrice.toFixed(2)}` : 'Gratuito'}
              </p>
            </div>
            
            {/* Dados do participante */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-medium">Dados do Participante</h3>
              
              <div>
                <label htmlFor="fullName" className="block text-white text-sm mb-2">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border rounded-md px-3 py-2 text-white ${
                    errors.fullName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Seu nome completo"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white text-sm mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border rounded-md px-3 py-2 text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-white text-sm mb-2">
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            
            {/* Termos e condições */}
            <div className="space-y-2">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 mr-2"
                />
                <span className="text-white text-sm">
                  Aceito os <a href="/terms" className="text-cuencos-purple underline">termos e condições</a>
                  {' '}e a <a href="/privacy" className="text-cuencos-purple underline">política de privacidade</a>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs">{errors.terms}</p>
              )}
            </div>
            
            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={closeModal}
                className="flex-1 border border-gray-600 text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Voltar
              </button>
              <button 
                type="submit"
                className="flex-1 bg-cuencos-purple hover:bg-cuencos-darkPurple text-white py-3 rounded-md transition-colors"
              >
                {ticketSelection.totalPrice > 0 ? 'Finalizar Compra' : 'Confirmar Participação'}
              </button>
            </div>
          </form>
        </Modal>
      </div>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
