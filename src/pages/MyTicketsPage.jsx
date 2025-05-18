
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { getTicketsByUserId } from '../lib/tickets';

const MyTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      const userTickets = getTicketsByUserId(user.id);
      setTickets(userTickets);
    }
  }, [user]);
  
  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-12 px-4 text-center flex-grow">
          <h1 className="text-2xl font-bold mb-4">Você precisa estar logado para acessar esta página</h1>
          <Link to="/login" className="text-cuencos-purple hover:underline">Fazer login</Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-cuencos-gray rounded-lg p-6 md:mr-8 mb-8 md:mb-0">
              <h2 className="text-xl font-bold text-white mb-6">Configurações da Conta</h2>
              
              <nav className="space-y-1">
                <Link to="/account" className="block px-4 py-2 hover:bg-gray-700 rounded text-white">
                  Informação da Conta
                </Link>
                <div className="bg-cuencos-purple px-4 py-2 rounded text-white">
                  Meus ingressos
                </div>
                <Link to="/account/email" className="block px-4 py-2 hover:bg-gray-700 rounded text-white">
                  Mudar email
                </Link>
              </nav>
            </div>
            
            {/* Main content */}
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-white mb-6">Meus Ingressos</h1>
              <p className="text-gray-400 mb-6">Clique para visualizar o QR Code</p>
              
              {tickets.length > 0 ? (
                <div className="space-y-6">
                  {tickets.map(ticket => (
                    <div 
                      key={ticket.id}
                      className="bg-cuencos-gray p-4 rounded-lg flex cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => openTicketDetails(ticket)}
                    >
                      <div className="w-28 h-28 mr-4">
                        <img 
                          src={ticket.eventImage} 
                          alt={ticket.eventTitle} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-white">{ticket.eventTitle}</h3>
                        <div className="flex items-center my-1">
                          <span className="text-gray-400 mr-2">📍</span>
                          <span className="text-gray-300">{ticket.eventLocation}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">📅</span>
                          <span className="text-gray-300">{ticket.eventDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-cuencos-gray rounded-lg">
                  <div className="text-5xl mb-4">🎫</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Você ainda não tem ingressos</h3>
                  <p className="text-gray-400 mb-6">Explore eventos e compre ingressos para vê-los aqui</p>
                  <Link 
                    to="/"
                    className="bg-cuencos-purple hover:bg-cuencos-darkPurple text-white px-6 py-2 rounded-md inline-block"
                  >
                    Explorar Eventos
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {selectedTicket && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          title="Seu ingresso"
        >
          <div className="text-center my-4">
            <h2 className="text-2xl font-bold text-white mb-4">Aqui está seu ingresso</h2>
            
            <div className="bg-gray-800 p-4 rounded mb-4">
              <img 
                src={selectedTicket.eventImage} 
                alt={selectedTicket.eventTitle} 
                className="w-full h-48 object-cover rounded mb-4" 
              />
              
              <h3 className="text-xl font-bold text-white uppercase">{selectedTicket.eventTitle}</h3>
              <p className="text-gray-400 text-sm mb-4">{selectedTicket.eventDate} - {selectedTicket.eventLocation}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4 border-t border-gray-700 pt-4">
                <div>
                  <p className="text-xs text-cuencos-purple mb-1">Data</p>
                  <p className="text-white">{selectedTicket.eventDate.split(' ')[0]}</p>
                </div>
                <div>
                  <p className="text-xs text-cuencos-purple mb-1">Horário</p>
                  <p className="text-white">9:00 PM</p>
                </div>
                <div>
                  <p className="text-xs text-cuencos-purple mb-1">Nome</p>
                  <p className="text-white">{selectedTicket.attendeeName.split(' ')[0]}</p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded-md w-48 h-48 mx-auto">
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="text-white text-xs">QR Code</div>
                </div>
              </div>
              
              <p className="text-gray-400 text-xs mt-2">Escaneie esse QR Code na entrada.</p>
            </div>
          </div>
        </Modal>
      )}
      
      <Footer />
    </div>
  );
};

export default MyTicketsPage;
