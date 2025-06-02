import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import { getTicketById } from '../lib/tickets';
import QRCode from 'react-qr-code';
import { Download, ArrowLeft, Calendar, MapPin, User, Hash, Apple, Wallet, Share2 } from 'lucide-react';
import { generateTicketPDF } from '../lib/pdfGenerator';
import { toast } from '../components/ui/use-toast';

const TicketDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const ticketData = await getTicketById(id);
        if (!ticketData || ticketData.userId !== (user.id || user.email)) {
          navigate('/my-tickets');
          return;
        }

        setTicket(ticketData);
      } catch (error) {
        console.error('Erro ao carregar ticket:', error);
        toast({
          title: "Erro ao carregar ingresso",
          description: "Não foi possível carregar os detalhes do ingresso",
          variant: "destructive"
        });
        navigate('/my-tickets');
      } finally {
        setIsLoading(false);
      }
    };

    loadTicket();
  }, [id, user, navigate]);

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

  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "Gerando PDF...",
        description: "Aguarde enquanto seu ingresso está sendo preparado",
        duration: 2000,
      });
      
      const result = await generateTicketPDF(ticket);
      
      if (result.success) {
        toast({
          title: "Download concluído!",
          description: `Arquivo ${result.fileName} foi baixado com sucesso`,
          variant: "success",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    }
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
        title: `Ingresso para ${ticket.eventTitle}`,
        text: `Meu ingresso para ${ticket.eventTitle} em ${ticket.eventDate}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Erro ao compartilhar:', err);
      });
    } else {
      navigator.clipboard.writeText(`Meu ingresso para ${ticket.eventTitle}`);
      toast({
        title: "Copiado!",
        description: "Informações do ingresso copiadas para a área de transferência",
        variant: "success"
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/my-tickets');
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
    
    return `/assets/events/${imagePath}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cuencos-purple mx-auto mb-4"></div>
          <p>Carregando ingresso...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Ingresso não encontrado</h1>
          <button 
            onClick={() => navigate('/my-tickets')}
            className="bg-cuencos-purple text-white px-6 py-2 rounded-md hover:bg-cuencos-darkPurple transition-colors"
          >
            Voltar aos meus ingressos
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="flex-grow">
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
          title="Detalhes do Ingresso"
          className="max-w-lg"
        >
          <div className="p-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">Seu ingresso</h3>
              
              <div className="bg-gray-800 p-4 rounded mb-4">
                <img 
                  src={getImageUrl(ticket.eventImage, ticket.eventImageData)} 
                  alt={ticket.eventTitle} 
                  className="w-full h-32 object-cover rounded mb-3"
                  onError={(e) => {
                    e.target.src = '/assets/images/placeholder-event.jpg';
                  }}
                />
                
                <h4 className="text-lg font-bold text-white uppercase line-clamp-2 mb-2">
                  {ticket.eventTitle}
                </h4>
                <p className="text-gray-400 text-sm mb-3">
                  {ticket.eventDate} - {ticket.eventLocation}
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-3 border-t border-gray-700 pt-3">
                  <div>
                    <p className="text-xs text-cuencos-purple mb-1">Data</p>
                    <p className="text-white text-xs">{ticket.eventDate.split(' ')[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cuencos-purple mb-1">Tipo</p>
                    <p className="text-white text-xs truncate">{ticket.ticketType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cuencos-purple mb-1">Nome</p>
                    <p className="text-white text-xs truncate">{ticket.attendeeName.split(' ')[0]}</p>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <div className="bg-white p-3 rounded-md w-48 h-48 mx-auto">
                    <QRCode 
                      value={generateTicketQRData(ticket)}
                      size={192}
                      style={{ width: '100%', height: '100%' }}
                      level="H"
                    />
                  </div>
                  
                  <p className="text-gray-400 text-xs mt-2">Escaneie esse QR Code na entrada.</p>
                  <p className="text-gray-400 text-xs mb-3 break-all px-2">
                    ID: {generateTicketIdentifier(ticket)}
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
                      onClick={handleDownloadPDF}
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
                
                {/* Informações adicionais */}
                <div className="mt-4 text-left">
                  <h5 className="text-white font-semibold mb-2 text-sm">Informações do Ingresso</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Portador:</span>
                      <span className="text-white">{ticket.attendeeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white truncate">{ticket.attendeeEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quantidade:</span>
                      <span className="text-white">{ticket.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">{ticket.status || 'Ativo'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      
      <Footer />
    </div>
  );
};

export default TicketDetailsPage;