
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites, toggleFavorite, isFavorite } from '../lib/favorites';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do localStorage quando o usuário mudar
  useEffect(() => {
    if (user) {
      const userFavorites = getFavorites(user.id);
      setFavorites(userFavorites);
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Função para adicionar/remover favorito
  const toggleUserFavorite = (eventId) => {
    if (!user) return false;
    
    const isFav = toggleFavorite(user.id, eventId);
    
    // Atualizar o estado local
    setFavorites(getFavorites(user.id));
    
    return isFav;
  };
  
  // Verificar se um evento está nos favoritos
  const checkIsFavorite = (eventId) => {
    if (!user) return false;
    return isFavorite(user.id, eventId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      toggleFavorite: toggleUserFavorite, 
      isFavorite: checkIsFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
