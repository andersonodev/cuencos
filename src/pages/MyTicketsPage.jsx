import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { getTicketsByUserId } from '../lib/tickets';
import QRCode from 'react-qr-code';
import { Wallet, Share2, Apple, Download, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { generateTicketPDF } from '../lib/pdfGenerator';
import { toast } from '../components/ui/use-toast';

const MyTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadTickets = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const userTickets = await getTicketsByUserId(user.id || user.email);
          console.log('Tickets carregados:', userTickets);
          setTickets(userTickets || []);
        } catch (error) {
          console.error('Erro ao carregar tickets:', error);
          toast({
            title: "Erro ao carregar ingressos",
            description: "Não foi possível carregar seus ingressos",
            variant: "destructive"
          });
          setTickets([]);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadTickets();
  }, [user]);
  
  // Gera um identificador único para o ticket baseado nos seus dados
  const generateTicketIdentifier = (ticket) => {
    return `CUENCOS-${ticket.id}-${ticket.eventId}-${(ticket.userId || '').substring(0, 8)}`;
  };
  
  // Gera dados estruturados para o QR Code em formato JSON
  const generateTicketQRData = (ticket) => {
    const ticketData = {
      id: ticket.id,
      eventId: ticket.eventId,
      eventTitle: ticket.eventTitle,
      attendeeName: ticket.attendeeName,
      attendeeEmail: ticket.attendeeEmail,
      ticketType: ticket.ticketType,
      quantity: ticket.quantity,
      eventDate: ticket.eventDate,
      eventLocation: ticket.eventLocation,
      identifier: generateTicketIdentifier(ticket),
      validationUrl: `https://cuencos.com/validate/${ticket.id}/${generateTicketIdentifier(ticket)}`
    };
    
    return JSON.stringify(ticketData);
  };
  
  const openTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };
  
  const addToAppleWallet = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A integração com Apple Wallet será implementada em breve!",
      duration: 3000,
    });
  };
  
  const shareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ingresso para ${selectedTicket.eventTitle}`,
        text: `Meu ingresso para ${selectedTicket.eventTitle} em ${selectedTicket.eventDate}`,
        url: `https://cuencos.com/ticket/${selectedTicket.id}/${generateTicketIdentifier(selectedTicket)}`,
      }).catch(err => {
        console.error('Erro ao compartilhar:', err);
      });
    } else {
      // Fallback para navegadores que não suportam a Web Share API
      navigator.clipboard.writeText(`Meu ingresso para ${selectedTicket.eventTitle}`);
      toast({
        title: "Copiado!",
        description: "Informações do ingresso copiadas para a área de transferência",
        variant: "success"
      });
    }
  };
  
  const handleDownloadTicket = async (ticket) => {
    try {
      toast({
        title: "Gerando PDF...",
        description: "Preparando seu ingresso para download",
        duration: 2000,
      });
      
      const result = await generateTicketPDF(ticket);
      
      if (result.success) {
        toast({
          title: "Download concluído!",
          description: `Ingresso baixado: ${result.fileName}`,
          variant: "success",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erro ao baixar ingresso:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o ingresso. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Função para gerar URL da imagem - CORRIGIDA
  const getImageUrl = (imagePath, imageData) => {
    // PRIORIDADE 1: Se tiver imagem em base64, usar ela
    if (imageData && imageData.startsWith('data:')) {
      return imageData;
    }
    
    // PRIORIDADE 2: Se a imagem já é uma URL de dados (base64)
    if (imagePath && imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    if (!imagePath) return '/assets/images/placeholder-event.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Se a imagem começa com ./assets, remove o ponto inicial
    if (imagePath.startsWith('./assets')) {
      return imagePath.substring(1);
    }
    
    // Se a imagem começa com assets, adiciona a barra inicial
    if (imagePath.startsWith('assets')) {
      return '/' + imagePath;
    }
    
    return `/assets/events/${imagePath}`;
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-12 px-4 text-center flex-grow">
          <h1 className="text-2xl font-bold mb-4 text-white">Você precisa estar logado para acessar esta página</h1>
          <Link to="/login" className="text-cuencos-purple hover:underline">Fazer login</Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-white">Carregando seus ingressos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      
      {/* Espaçador para compensar o header fixo */}
      <div className="h-16 md:h-20"></div>
      
      <main className="flex-grow py-4 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-cuencos-gray rounded-lg p-4 md:p-6 flex-shrink-0">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Configurações da Conta</h2>
              
              <nav className="space-y-1">
                <Link to="/account" className="block px-3 md:px-4 py-2 hover:bg-gray-700 rounded text-white text-sm md:text-base">
                  Informação da Conta
                </Link>
                <div className="bg-cuencos-purple px-3 md:px-4 py-2 rounded text-white text-sm md:text-base">
                  Meus ingressos
                </div>
                <Link to="/account/email" className="block px-3 md:px-4 py-2 hover:bg-gray-700 rounded text-white text-sm md:text-base">
                  Mudar email
                </Link>
              </nav>
            </div>
            
            {/* Main content */}
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Meus Ingressos</h1>
              <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">Clique para visualizar o QR Code</p>
              
              {tickets.length > 0 ? (
                <div className="grid gap-4 md:gap-6">
                  {tickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className="bg-gray-900 rounded-lg p-4 md:p-6 cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => openTicketDetails(ticket)}
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Imagem do evento */}
                        <div className="w-full md:w-32 h-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={getImageUrl(ticket.eventImage, ticket.eventImageData)} 
                            alt={ticket.eventTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/assets/images/placeholder-event.jpg';
                            }}
                          />
                        </div>
                        
                        {/* Informações do ticket */}
                        <div className="flex-grow">
                          <h3 className="text-lg md:text-xl font-semibold text-white mb-2 line-clamp-1">
                            {ticket.eventTitle}
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-300">
                              <Calendar className="h-4 w-4 mr-2 text-cuencos-purple" />
                              <span>{ticket.eventDate}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-300">
                              <MapPin className="h-4 w-4 mr-2 text-cuencos-purple" />
                              <span className="truncate">{ticket.eventLocation}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-block bg-cuencos-purple text-white text-xs px-2 py-1 rounded">
                              {ticket.ticketType}
                            </span>
                            <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">
                              {ticket.status || 'Ativo'}
                            </span>
                            {ticket.quantity > 1 && (
                              <span className="inline-block bg-gray-600 text-white text-xs px-2 py-1 rounded">
                                {ticket.quantity}x
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Ações rápidas */}
                        <div className="flex md:flex-col gap-2 justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewEvent(ticket.eventId);
                            }}
                            className="text-cuencos-purple hover:text-cuencos-darkPurple text-sm"
                          >
                            Ver Evento
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadTicket(ticket);
                            }}
                            className="text-gray-400 hover:text-white text-sm"
                          >
                            Baixar PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-8 md:p-12 text-center">
                  <div className="text-4xl md:text-6xl mb-4">🎫</div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Você ainda não possui ingressos</h2>
                  <p className="text-gray-400 mb-6">Explore nossos eventos e garante seu lugar!</p>
                  <button 
                    onClick={() => navigate('/')}
                    className="bg-cuencos-purple hover:bg-cuencos-darkPurple text-white px-6 py-3 rounded-md transition-colors"
                  >
                    Explorar Eventos
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal de detalhes do ingresso */}
      {selectedTicket && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          title="Seu ingresso"
          className="max-w-lg"
        >
          <div className="p-4">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Aqui está seu ingresso</h3>
              
              <div className="bg-gray-800 p-4 rounded mb-4">
                <img 
                  src={getImageUrl(selectedTicket.eventImage, selectedTicket.eventImageData)} 
                  alt={selectedTicket.eventTitle} 
                  className="w-full h-32 object-cover rounded mb-3"
                  onError={(e) => {
                    e.target.src = '/assets/images/placeholder-event.jpg';
                  }}
                />
                
                <h4 className="text-lg font-bold text-white uppercase line-clamp-2 mb-2">
                  {selectedTicket.eventTitle}
                </h4>
                <p className="text-gray-400 text-sm mb-3">
                  {selectedTicket.eventDate} - {selectedTicket.eventLocation}
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-3 border-t border-gray-700 pt-3">
                  <div>
                    <p className="text-xs text-cuencos-purple mb-1">Data</p>
                    <p className="text-white text-xs">{selectedTicket.eventDate.split(' ')[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cuencos-purple mb-1">Tipo</p>
                    <p className="text-white text-xs truncate">{selectedTicket.ticketType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cuencos-purple mb-1">Nome</p>
                    <p className="text-white text-xs truncate">{selectedTicket.attendeeName.split(' ')[0]}</p>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-3 rounded-md w-48 h-48 mx-auto">
                    <QRCode 
                      value={generateTicketQRData(selectedTicket)}
                      size={192}
                      style={{ width: '100%', height: '100%' }}
                      level="H"
                      className="border-0"
                    />
                  </div>
                  
                  <p className="text-gray-400 text-xs mt-2">Escaneie esse QR Code na entrada.</p>
                  <p className="text-gray-400 text-xs mb-3 break-all px-2">
                    ID: {generateTicketIdentifier(selectedTicket)}
                  </p>
                  
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={addToAppleWallet}
                      className="flex items-center justify-center gap-2 bg-black text-white py-2 px-3 rounded-md border border-gray-600 hover:bg-gray-900 transition-colors text-sm"
                    >
                      <Apple size={14} />
                      <Wallet size={14} />
                      <span>Apple Wallet</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownloadTicket(selectedTicket)}
                      className="flex items-center justify-center gap-2 bg-cuencos-purple text-white py-2 px-3 rounded-md hover:bg-cuencos-darkPurple transition-colors text-sm"
                    >
                      <Download size={14} />
                      <span>Baixar PDF</span>
                    </button>
                    
                    <button
                      onClick={shareTicket}
                      className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-3 rounded-md hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Share2 size={14} />
                      <span>Compartilhar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      
      <Footer />
    </div>
  );
};

export default MyTicketsPage;
