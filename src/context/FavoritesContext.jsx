import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do localStorage quando o componente montar
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Salvar favoritos no localStorage quando houver mudanças
  useEffect(() => {
    if (user) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Adicionar um evento aos favoritos
  const addFavorite = (event) => {
    if (!user) return false;
    
    setFavorites(prevFavorites => {
      // Verifica se o evento já está nos favoritos
      if (prevFavorites.some(fav => fav.id === event.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, event];
    });
    return true;
  };

  // Remover um evento dos favoritos
  const removeFavorite = (eventId) => {
    if (!user) return false;
    
    setFavorites(prevFavorites => 
      prevFavorites.filter(event => event.id !== eventId)
    );
    return true;
  };

  // Verificar se um evento está nos favoritos
  const isFavorite = (eventId) => {
    return favorites.some(event => event.id === eventId);
  };

  // Toggle favorito (adiciona se não existir, remove se existir)
  const toggleFavorite = (event) => {
    if (!user) return false;
    
    if (isFavorite(event.id)) {
      return removeFavorite(event.id);
    } else {
      return addFavorite(event);
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite, 
      isFavorite,
      toggleFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
