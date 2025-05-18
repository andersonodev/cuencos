
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { addTicket } from '../lib/tickets';
import { getEventById } from '../lib/events';

const SuccessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [addedTicket, setAddedTicket] = useState(null);
  
  useEffect(() => {
    const storedInfo = sessionStorage.getItem('checkoutInfo');
    if (!storedInfo) {
      navigate('/');
      return;
    }
    
    setCheckoutInfo(JSON.parse(storedInfo));
  }, [navigate]);
  
  useEffect(() => {
    if (checkoutInfo && !isPaymentCompleted) {
      // Simulate payment processing
      const timer = setTimeout(() => {
        setIsPaymentCompleted(true);
        
        // Add ticket to user's account
        const event = getEventById(checkoutInfo.eventId);
        const newTicket = addTicket({
          userId: user.id,
          eventId: checkoutInfo.eventId,
          eventTitle: event.title,
          eventImage: event.image,
          eventDate: event.date,
          eventLocation: event.location,
          ticketType: checkoutInfo.ticketType,
          quantity: checkoutInfo.quantity,
          attendeeName: checkoutInfo.participantInfo.fullName,
          attendeeEmail: checkoutInfo.participantInfo.email,
          attendeePhone: checkoutInfo.participantInfo.phone,
        });
        
        setAddedTicket(newTicket);
        
        // Clear session storage
        sessionStorage.removeItem('ticketSelection');
        sessionStorage.removeItem('checkoutInfo');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [checkoutInfo, user, isPaymentCompleted]);
  
  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/');
  };
  
  const viewTicket = () => {
    setIsModalOpen(false);
    navigate('/my-tickets');
  };
  
  if (!checkoutInfo) return null;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-grow">
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Resumo da compra"
        >
          {!isPaymentCompleted ? (
            <div className="py-8 text-center">
              <div className="animate-pulse mb-4">
                <div className="w-12 h-12 mx-auto bg-cuencos-purple rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>
              <h3 className="text-xl text-white mb-2">Processando pagamento...</h3>
              <p className="text-gray-400">Por favor, aguarde enquanto processamos o seu pagamento.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-center text-2xl font-bold text-white mb-4">Pagamento Confirmado!</h2>
              
              <div className="bg-cuencos-gray rounded-lg p-4 mb-6">
                <div className="flex justify-center mb-4">
                  <img src={getEventById(checkoutInfo.eventId).image} alt={checkoutInfo.eventTitle} className="h-48 object-cover rounded" />
                </div>
                
                <div className="text-center">
                  <h3 className="text-white font-bold text-lg">PUC IN RIO</h3>
                  <p className="text-gray-400">09 de Maio 21:00 até 10 de Maio 04:00 – Em breve... - Curitiba / Paraná</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4 border-t border-cuencos-gray pt-4">
                  <div className="text-center">
                    <p className="text-xs text-cuencos-purple">Data</p>
                    <p className="text-white">09 de Maio</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-cuencos-purple">Horário</p>
                    <p className="text-white">9:00 PM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-cuencos-purple">Nome</p>
                    <p className="text-white">{checkoutInfo.participantInfo.fullName.split(' ')[0]}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <div className="w-48 h-48 bg-white p-2 rounded">
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <span className="text-white text-xs">QR Code</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-400 text-xs text-center mt-3">Escaneie esse QR Code na entrada.</p>
              </div>
              
              <button
                onClick={viewTicket}
                className="w-full bg-cuencos-purple hover:bg-cuencos-darkPurple text-white py-4 rounded-md text-lg font-medium"
              >
                Veja-o em Meus Ingressos
              </button>
            </div>
          )}
        </Modal>
      </div>
      
      <Footer />
    </div>
  );
};

export default SuccessPage;
