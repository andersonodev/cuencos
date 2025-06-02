import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/use-toast';
import { Heart } from 'lucide-react';
import '../styles/eventCard.css';

const EventCard = ({ event }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const favorite = isFavorite(event.id);
  
  // Função aprimorada para gerar URLs de imagem compatíveis com API ou localStorage
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
    
    // Se a imagem já começa com http, é uma URL completa da API
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Se começa com /, é um caminho absoluto relativo à raiz do servidor
    if (imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Se começa com ./, é um caminho relativo
    if (imagePath.startsWith('./')) {
      return imagePath.substring(1); // Remove o ponto inicial
    }
    
    // Se começa com assets, adiciona a barra inicial
    if (imagePath.startsWith('assets')) {
      return '/' + imagePath;
    }
    
    // Caso contrário, assume-se que é um nome de arquivo na pasta assets/events
    return `/assets/events/${imagePath}`;
  };
  
  // Extrair mês da data do evento - melhorada para lidar com diferentes formatos
  const getMonthAbbreviation = (dateString) => {
    if (!dateString) return 'MAI';
    
    // Mapeamento de meses em português para abreviações de 3 letras
    const mesesAbrev = {
      'janeiro': 'JAN', 'fevereiro': 'FEV', 'março': 'MAR', 'abril': 'ABR',
      'maio': 'MAI', 'junho': 'JUN', 'julho': 'JUL', 'agosto': 'AGO',
      'setembro': 'SET', 'outubro': 'OUT', 'novembro': 'NOV', 'dezembro': 'DEZ'
    };
    
    // Formato "09 de Maio de 2025"
    const regex = /(\d+)\s+de\s+(\w+)/i;
    const match = dateString.match(regex);
    
    if (match && match[2]) {
      const mes = match[2].toLowerCase();
      for (const [chave, valor] of Object.entries(mesesAbrev)) {
        if (chave.startsWith(mes) || mes.startsWith(chave)) {
          return valor;
        }
      }
    }
    
    // Fallback para exibição padrão
    return dateString.split(' ')[0] || 'MAI';
  };
  
  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Ação necessária",
        description: "Faça login para adicionar eventos aos favoritos",
        variant: "warning"
      });
      return;
    }
    
    // Correção: Passando o ID do evento em vez do objeto evento completo
    const result = toggleFavorite(event.id);
    
    toast({
      title: favorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: favorite ? "O evento foi removido dos seus favoritos" : "O evento foi adicionado aos seus favoritos",
      variant: favorite ? "default" : "success"
    });
  };
  
  return (
    <div className="event-card">
      <Link to={`/events/${event.id}`} className="event-card-link">
        <div className="event-card-image-container">
          <img 
            src={getImageUrl(event.image, event.imageData)} 
            alt={event.title} 
            className="event-card-image"
            onError={(e) => {
              e.target.src = '/assets/images/placeholder-event.jpg';
            }}
          />
          
          <button 
            className={`favorite-button ${favorite ? 'favorited' : ''}`} 
            onClick={handleToggleFavorite}
            aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart 
              className={`h-6 w-6 ${favorite ? 'fill-cuencos-purple text-cuencos-purple' : 'text-white'}`}
            />
          </button>
        </div>
        
        <div className="event-card-content">
          <div className="event-card-month">
            {getMonthAbbreviation(event.date)}
          </div>
          <h3 className="event-card-title">{event.title}</h3>
          <p className="event-card-description">{event.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
