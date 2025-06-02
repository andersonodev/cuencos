import * as apiService from '../services/api';
import { getEventById } from './events';

// Chave para localStorage (fallback)
const FAVORITES_STORAGE_KEY = 'cuencos_user_favorites';

// Cache local para performance
let favoritesCache = new Map();

// ===== FUNÇÕES DE CACHE =====

const getCacheKey = (userId) => `favorites_${userId}`;

const getFavoritesFromCache = (userId) => {
  const cacheKey = getCacheKey(userId);
  return favoritesCache.get(cacheKey) || [];
};

const setFavoritesInCache = (userId, favorites) => {
  const cacheKey = getCacheKey(userId);
  favoritesCache.set(cacheKey, favorites);
};

// ===== FUNÇÕES DE FALLBACK (localStorage) =====

const getFavoritesFromStorage = (userId) => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const allFavorites = JSON.parse(stored);
      return allFavorites[userId] || [];
    }
  } catch (error) {
    console.error('Erro ao ler favoritos do localStorage:', error);
  }
  return [];
};

const saveFavoritesToStorage = (userId, favorites) => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY) || '{}';
    const allFavorites = JSON.parse(stored);
    allFavorites[userId] = favorites;
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(allFavorites));
    console.log(`Favoritos salvos no localStorage para ${userId}:`, favorites);
  } catch (error) {
    console.error('Erro ao salvar favoritos no localStorage:', error);
  }
};

// ===== FUNÇÕES PRINCIPAIS =====

export const getFavorites = async (userId) => {
  if (!userId) return [];
  
  console.log('Obtendo favoritos para usuário:', userId);
  
  // Primeiro verificar cache
  let favorites = getFavoritesFromCache(userId);
  if (favorites.length > 0) {
    console.log('Favoritos encontrados no cache:', favorites);
    return favorites;
  }
  
  // Depois verificar localStorage
  favorites = getFavoritesFromStorage(userId);
  if (favorites.length > 0) {
    console.log('Favoritos encontrados no localStorage:', favorites);
    setFavoritesInCache(userId, favorites);
    return favorites;
  }
  
  console.log('Nenhum favorito encontrado para o usuário');
  return [];
};

export const addFavorite = async (userId, eventId) => {
  if (!userId || !eventId) {
    console.warn('addFavorite: userId ou eventId inválido', { userId, eventId });
    return false;
  }
  
  const eventIdNum = parseInt(eventId);
  const currentFavorites = await getFavorites(userId);
  
  console.log('Adicionando favorito:', { userId, eventIdNum, currentFavorites });
  
  // Se já está nos favoritos, não adicionar novamente
  if (currentFavorites.includes(eventIdNum)) {
    console.log('Evento já está nos favoritos');
    return true;
  }
  
  try {
    // Atualizar favoritos localmente
    const updatedFavorites = [...currentFavorites, eventIdNum];
    setFavoritesInCache(userId, updatedFavorites);
    saveFavoritesToStorage(userId, updatedFavorites);
    
    console.log('Favorito adicionado com sucesso:', eventIdNum);
    return true;
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    return false;
  }
};

export const removeFavorite = async (userId, eventId) => {
  if (!userId || !eventId) {
    console.warn('removeFavorite: userId ou eventId inválido', { userId, eventId });
    return false;
  }
  
  const eventIdNum = parseInt(eventId);
  const currentFavorites = await getFavorites(userId);
  
  console.log('Removendo favorito:', { userId, eventIdNum, currentFavorites });
  
  try {
    // Atualizar favoritos localmente
    const updatedFavorites = currentFavorites.filter(id => id !== eventIdNum);
    setFavoritesInCache(userId, updatedFavorites);
    saveFavoritesToStorage(userId, updatedFavorites);
    
    console.log('Favorito removido com sucesso:', eventIdNum);
    return true;
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    return false;
  }
};

export const isFavorite = async (userId, eventId) => {
  if (!userId || !eventId) return false;
  
  const favorites = await getFavorites(userId);
  const result = favorites.includes(parseInt(eventId));
  console.log('Verificando se é favorito:', { userId, eventId, result, favorites });
  return result;
};

export const toggleFavorite = async (userId, eventId) => {
  if (!userId || !eventId) {
    console.warn('toggleFavorite: userId ou eventId inválido', { userId, eventId });
    return false;
  }
  
  console.log('Alternando favorito:', { userId, eventId });
  
  const isCurrentlyFavorite = await isFavorite(userId, eventId);
  
  if (isCurrentlyFavorite) {
    return await removeFavorite(userId, eventId);
  } else {
    return await addFavorite(userId, eventId);
  }
};

// Obter eventos favoritos completos - CORRIGIDO
export const getFavoriteEvents = async (userId) => {
  if (!userId) {
    console.warn('getFavoriteEvents: userId é obrigatório');
    return [];
  }
  
  try {
    console.log('Obtendo eventos favoritos para usuário:', userId);
    
    const favoriteIds = await getFavorites(userId);
    console.log('IDs dos favoritos obtidos:', favoriteIds);
    
    if (!favoriteIds || favoriteIds.length === 0) {
      console.log('Nenhum favorito encontrado');
      return [];
    }
    
    // Buscar dados completos de cada evento favorito
    const favoriteEvents = [];
    
    for (const eventId of favoriteIds) {
      try {
        console.log('Buscando evento favorito ID:', eventId);
        const event = await getEventById(eventId);
        
        if (event) {
          console.log('Evento favorito encontrado:', event.title);
          favoriteEvents.push(event);
        } else {
          console.warn(`Evento favorito ${eventId} não encontrado`);
        }
      } catch (error) {
        console.error(`Erro ao buscar evento favorito ${eventId}:`, error);
      }
    }
    
    console.log('Eventos favoritos carregados:', favoriteEvents.length);
    return favoriteEvents;
  } catch (error) {
    console.error('Erro ao obter eventos favoritos:', error);
    return [];
  }
};
