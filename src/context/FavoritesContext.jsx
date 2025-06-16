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

  // Cache para eventos favoritos
  const [favoritesCache, setFavoritesCache] = useState({});
  
  // Limpar cache quando o usuário mudar
  useEffect(() => {
    // Quando o usuário muda (login/logout), limpar o cache de eventos
    setFavoritesCache({});
  }, [user]);

  // Obter eventos favoritos completos - otimizado com cache e carregamento paralelo
  const getFavoriteEvents = async () => {
    if (!user || favorites.length === 0) {
      console.log('Nenhum favorito para carregar');
      return [];
    }

    setLoading(true);
    try {
      console.log('Carregando eventos favoritos:', favorites);
      
      // Verificar quais IDs já estão em cache e quais precisam ser carregados
      const cachedEvents = [];
      const idsToLoad = [];
      
      favorites.forEach(eventId => {
        if (favoritesCache[eventId] && !favoritesCache[eventId].deleted) {
          cachedEvents.push(favoritesCache[eventId]);
        } else {
          idsToLoad.push(eventId);
        }
      });
      
      console.log(`Usando ${cachedEvents.length} eventos do cache, carregando ${idsToLoad.length} eventos`);
      
      // Se todos os eventos já estão em cache, retornar imediatamente
      if (idsToLoad.length === 0) {
        console.log('Todos os eventos já estão em cache');
        return cachedEvents;
      }
      
      // Carregar eventos em paralelo usando Promise.all
      const eventPromises = idsToLoad.map(async (eventId) => {
        try {
          const event = await getEventById(eventId);
          return event;
        } catch (error) {
          console.error(`Erro ao carregar evento favorito ${eventId}:`, error);
          return null;
        }
      });
      
      // Aguardar todas as promessas serem resolvidas
      const loadedEvents = await Promise.all(eventPromises);
      const validLoadedEvents = loadedEvents.filter(event => event && !event.deleted);
      
      // Atualizar o cache com os novos eventos
      const newCache = { ...favoritesCache };
      validLoadedEvents.forEach(event => {
        newCache[event.id] = event;
      });
      setFavoritesCache(newCache);
      
      // Combinar eventos em cache com novos eventos
      const allEvents = [...cachedEvents, ...validLoadedEvents];
      console.log('Eventos favoritos carregados:', allEvents.length);
      
      return allEvents;
    } catch (error) {
      console.error('Erro ao obter eventos favoritos:', error);
      return cachedEvents || [];
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
      setFavoritesCache({}); // Limpar cache também
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
