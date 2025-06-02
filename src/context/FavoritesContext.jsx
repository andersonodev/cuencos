import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getEventById } from '../lib/events';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para obter chave única por usuário
  const getFavoritesKey = (userId) => {
    if (!userId) return null;
    return `cuencos_favorites_${userId}`;
  };

  // Carregar favoritos do localStorage quando o usuário mudar
  useEffect(() => {
    const loadFavorites = () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        const favoritesKey = getFavoritesKey(user.id || user.email);
        if (!favoritesKey) return;

        const storedFavorites = localStorage.getItem(favoritesKey);
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          console.log('Favoritos carregados para usuário:', user.id || user.email, parsedFavorites);
          setFavorites(parsedFavorites);
        } else {
          console.log('Nenhum favorito encontrado para usuário:', user.id || user.email);
          setFavorites([]);
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user]);

  // Salvar favoritos no localStorage
  const saveFavorites = (newFavorites) => {
    if (!user) return;

    try {
      const favoritesKey = getFavoritesKey(user.id || user.email);
      if (!favoritesKey) return;

      localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
      console.log('Favoritos salvos para usuário:', user.id || user.email, newFavorites);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  // Adicionar ou remover evento dos favoritos
  const toggleFavorite = (eventId) => {
    if (!user) {
      console.warn('Usuário não logado - não é possível alterar favoritos');
      return false;
    }

    try {
      const eventIdNum = parseInt(eventId);
      const isFavorited = favorites.includes(eventIdNum);

      let newFavorites;
      if (isFavorited) {
        // Remover dos favoritos
        newFavorites = favorites.filter(id => id !== eventIdNum);
        console.log('Removendo evento dos favoritos:', eventIdNum);
      } else {
        // Adicionar aos favoritos
        newFavorites = [...favorites, eventIdNum];
        console.log('Adicionando evento aos favoritos:', eventIdNum);
      }

      setFavorites(newFavorites);
      saveFavorites(newFavorites);

      return !isFavorited; // Retorna o novo estado (true se adicionado, false se removido)
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      return false;
    }
  };

  // Verificar se um evento está nos favoritos
  const isFavorite = (eventId) => {
    if (!user || !eventId) return false;
    const eventIdNum = parseInt(eventId);
    return favorites.includes(eventIdNum);
  };

  // Obter eventos favoritos completos
  const getFavoriteEvents = async () => {
    if (!user || favorites.length === 0) {
      console.log('Nenhum favorito para carregar');
      return [];
    }

    setLoading(true);
    try {
      console.log('Carregando eventos favoritos:', favorites);
      
      const favoriteEvents = [];
      
      for (const eventId of favorites) {
        try {
          const event = await getEventById(eventId);
          if (event && !event.deleted) {
            favoriteEvents.push(event);
          } else {
            console.warn(`Evento favorito ${eventId} não encontrado ou foi deletado`);
          }
        } catch (error) {
          console.error(`Erro ao carregar evento favorito ${eventId}:`, error);
        }
      }

      console.log('Eventos favoritos carregados:', favoriteEvents.length);
      return favoriteEvents;
    } catch (error) {
      console.error('Erro ao obter eventos favoritos:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Limpar favoritos (útil para logout)
  const clearFavorites = () => {
    if (!user) return;

    try {
      const favoritesKey = getFavoritesKey(user.id || user.email);
      if (favoritesKey) {
        localStorage.removeItem(favoritesKey);
      }
      setFavorites([]);
      console.log('Favoritos limpos para usuário:', user.id || user.email);
    } catch (error) {
      console.error('Erro ao limpar favoritos:', error);
    }
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteEvents,
    clearFavorites,
    loading
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
};
