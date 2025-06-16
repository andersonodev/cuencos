import * as eventService from '../services/eventService';

// Chaves do localStorage
const EVENTS_STORAGE_KEY = 'cuencos_events';
const LOCAL_EVENTS_STORAGE_KEY = 'cuencos_local_events';
const API_EVENTS_STORAGE_KEY = 'cuencos_api_events';
const LAST_API_SYNC_KEY = 'cuencos_last_api_sync';

// Cache em memória
let apiEventsCache = null;
let localEventsCache = null;
let mergedEventsCache = null;

// Função para obter ID único sequencial
const getNextEventId = (events) => {
  if (!events || events.length === 0) return 1000; // IDs locais começam em 1000
  const localEvents = events.filter(e => e.id >= 1000); // Apenas eventos locais
  if (localEvents.length === 0) return 1000;
  const maxId = Math.max(...localEvents.map(e => parseInt(e.id) || 999));
  return maxId + 1;
};

// Carregar eventos da API
const loadApiEvents = async () => {
  try {
    // Verificar se já temos cache válido da API (menos de 5 minutos)
    const lastSync = localStorage.getItem(LAST_API_SYNC_KEY);
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    
    if (apiEventsCache && lastSync && parseInt(lastSync) > fiveMinutesAgo) {
      console.log('Usando cache da API (válido por mais tempo)');
      return apiEventsCache;
    }
    
    console.log('Tentando carregar eventos da API...');
    const apiEvents = await eventService.fetchEvents();
    
    if (apiEvents && Array.isArray(apiEvents) && apiEvents.length > 0) {
      apiEventsCache = apiEvents.map(event => ({
        ...event,
        source: 'api',
        id: parseInt(event.id) // Garantir que ID seja número
      }));
      
      // Salvar no localStorage com timestamp
      localStorage.setItem(API_EVENTS_STORAGE_KEY, JSON.stringify(apiEventsCache));
      localStorage.setItem(LAST_API_SYNC_KEY, Date.now().toString());
      
      console.log(`${apiEventsCache.length} eventos carregados da API`);
      return apiEventsCache;
    } else {
      console.warn('API retornou dados vazios ou inválidos');
    }
  } catch (apiError) {
    console.warn('Erro ao conectar com a API:', apiError.message);
  }
  
  // Fallback para eventos salvos da API no localStorage
  try {
    const storedApiEvents = localStorage.getItem(API_EVENTS_STORAGE_KEY);
    if (storedApiEvents) {
      apiEventsCache = JSON.parse(storedApiEvents);
      console.log(`${apiEventsCache.length} eventos da API carregados do cache local`);
      return apiEventsCache;
    }
  } catch (error) {
    console.error('Erro ao carregar cache da API:', error);
    localStorage.removeItem(API_EVENTS_STORAGE_KEY);
  }
  
  // Se nada funcionar, tentar dados mock como fallback para API
  try {
    console.log('Carregando dados mock como fallback da API...');
    // Usar fetch para carregar o arquivo mocado como JSON
    const mockEventsResponse = await fetch('/api/events');
    const mockEvents = await mockEventsResponse.json();
    
    if (mockEvents && mockEvents.length > 0) {
      apiEventsCache = mockEvents.map(event => ({
        ...event,
        source: 'api',
        id: parseInt(event.id)
      }));
      localStorage.setItem(API_EVENTS_STORAGE_KEY, JSON.stringify(apiEventsCache));
      console.log(`${apiEventsCache.length} eventos mock carregados como API`);
      return apiEventsCache;
    }
  } catch (error) {
    console.error('Erro ao carregar dados mock:', error);
  }
  
  return [];
};

// Carregar eventos locais
const loadLocalEvents = () => {
  try {
    if (localEventsCache) {
      return localEventsCache;
    }
    
    const storedLocalEvents = localStorage.getItem(LOCAL_EVENTS_STORAGE_KEY);
    if (storedLocalEvents) {
      localEventsCache = JSON.parse(storedLocalEvents).map(event => ({
        ...event,
        source: 'local',
        id: parseInt(event.id)
      }));
      console.log(`${localEventsCache.length} eventos locais carregados`);
      return localEventsCache;
    }
    
    localEventsCache = [];
    return localEventsCache;
  } catch (error) {
    console.error('Erro ao carregar eventos locais:', error);
    localStorage.removeItem(LOCAL_EVENTS_STORAGE_KEY);
    localEventsCache = [];
    return localEventsCache;
  }
};

// Salvar eventos locais
const saveLocalEvents = (events) => {
  try {
    const localEvents = events.filter(e => e.source === 'local');
    localEventsCache = localEvents;
    localStorage.setItem(LOCAL_EVENTS_STORAGE_KEY, JSON.stringify(localEvents));
    console.log(`${localEvents.length} eventos locais salvos`);
  } catch (error) {
    console.error('Erro ao salvar eventos locais:', error);
  }
};

// Mesclar eventos da API e locais
const mergeEvents = async () => {
  try {
    const apiEvents = await loadApiEvents();
    const localEvents = loadLocalEvents();
    
    // Combinar eventos, removendo duplicatas por ID
    const eventMap = new Map();
    
    // Adicionar eventos da API primeiro
    apiEvents.forEach(event => {
      eventMap.set(event.id, event);
    });
    
    // Adicionar eventos locais (podem sobrescrever se mesmo ID)
    localEvents.forEach(event => {
      eventMap.set(event.id, event);
    });
    
    mergedEventsCache = Array.from(eventMap.values()).sort((a, b) => {
      // Ordenar por data de criação, mais recentes primeiro
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return dateB - dateA;
    });
    
    console.log(`Total de ${mergedEventsCache.length} eventos (${apiEvents.length} da API + ${localEvents.length} locais)`);
    
    // Manter compatibilidade com localStorage antigo
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(mergedEventsCache));
    
    return mergedEventsCache;
  } catch (error) {
    console.error('Erro ao mesclar eventos:', error);
    return [];
  }
};

// Get all events (apenas publicados)
export const getEvents = async () => {
  try {
    const events = await mergeEvents();
    return events.filter(event => !event.isDraft);
  } catch (error) {
    console.error('Erro ao obter eventos:', error);
    return [];
  }
};

// Get all events including drafts (for organizers)
export const getAllEvents = async () => {
  try {
    return await mergeEvents();
  } catch (error) {
    console.error('Erro ao obter todos os eventos:', error);
    return [];
  }
};

// Cache para getEventById com TTL (30 minutos)
const eventByIdCache = new Map();
const EVENT_CACHE_TTL = 30 * 60 * 1000; // 30 minutos em ms

// Get event by ID (com cache)
export const getEventById = async (id) => {
  try {
    const eventId = parseInt(id);
    
    // Verificar cache primeiro
    if (eventByIdCache.has(eventId)) {
      const { event: cachedEvent, timestamp } = eventByIdCache.get(eventId);
      // Verificar se o cache ainda é válido (não expirou)
      if (Date.now() - timestamp < EVENT_CACHE_TTL) {
        console.log('Evento encontrado no cache:', cachedEvent.title);
        return cachedEvent;
      } else {
        console.log('Cache expirado para evento:', eventId);
        eventByIdCache.delete(eventId);
      }
    }
    
    console.log('Buscando evento por ID:', eventId);
    const events = await mergeEvents();
    const event = events.find(event => event.id === eventId || event.id === id);
    
    if (event) {
      console.log('Evento encontrado:', event.title, `(fonte: ${event.source})`);
      // Armazenar no cache com timestamp
      eventByIdCache.set(eventId, { event, timestamp: Date.now() });
      return event;
    }
    
    console.warn(`Evento ${id} não encontrado`);
    return null;
  } catch (error) {
    console.error('Erro ao obter evento por ID:', error);
    return null;
  }
};

// Get events by user (organizer)
export const getEventsByUser = async (userId) => {
  try {
    const events = await mergeEvents();
    return events.filter(event => event.createdBy === userId);
  } catch (error) {
    console.error('Erro ao obter eventos do usuário:', error);
    return [];
  }
};

// Add new event - SEMPRE CRIADO LOCALMENTE
export const addEvent = async (eventData) => {
  try {
    console.log('Criando novo evento local:', eventData.title);
    
    // Carregar eventos existentes para obter próximo ID
    const allEvents = await mergeEvents();
    
    // Tratar a imagem corretamente
    let eventImage = eventData.image;
    let eventImageData = null;
    
    // Se a imagem é base64 (começa com data:), usar como imageData
    if (eventData.image && eventData.image.startsWith('data:')) {
      eventImageData = eventData.image;
      eventImage = `/assets/events/event-${Date.now()}.jpg`; // Placeholder path
    } else if (eventData.image && !eventData.image.startsWith('/assets/')) {
      // Se não é base64 e não começa com /assets/, corrigir o caminho
      eventImage = `/assets/events/${eventData.image.split('/').pop()}`;
    } else if (!eventData.image) {
      eventImage = '/assets/images/placeholder-event.jpg';
    }
    
    // Criar novo evento com ID único LOCAL
    const newEvent = {
      id: getNextEventId(allEvents),
      title: eventData.title || 'Novo Evento',
      description: eventData.description || '',
      longDescription: eventData.longDescription || eventData.description || '',
      image: eventImage,
      imageData: eventImageData, // Salvar a imagem em base64 se disponível
      date: eventData.date || '09 de Maio de 2025',
      endDate: eventData.endDate || eventData.date || '09 de Maio de 2025',
      time: eventData.time || `${eventData.startTime || '21:00'} - ${eventData.endTime || '04:00'}`,
      location: eventData.location || 'Local a definir',
      price: parseFloat(eventData.ticketPrice) || 0,
      featured: eventData.featured || false,
      category: eventData.category || 'festa',
      ageRestriction: eventData.ageRestriction || 'Proibido menores de 18 anos',
      organizers: eventData.organizers || 'Organizador',
      createdBy: eventData.createdBy || 'organizador@cuencos.com',
      isDraft: eventData.isDraft || false,
      salesCount: 0,
      ticketName: eventData.ticketName || 'Ingresso Padrão',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'local',
      // Campos adicionais do form
      startTime: eventData.startTime || '21:00',
      endTime: eventData.endTime || '04:00',
      ticketType: eventData.ticketType || 'paid',
      ticketPrice: parseFloat(eventData.ticketPrice) || 0
    };
    
    // Adicionar aos eventos locais
    const localEvents = loadLocalEvents();
    localEvents.push(newEvent);
    saveLocalEvents(localEvents);
    
    // Limpar cache mesclado para forçar re-merge
    mergedEventsCache = null;
    
    console.log('Evento local criado com sucesso:', newEvent);
    
    // Tentar sincronizar com API silenciosamente (não bloquear se falhar)
    try {
      const apiEvent = await eventService.createEvent(newEvent);
      if (apiEvent) {
        console.log('Evento sincronizado com API');
        // Invalidar cache da API para próxima sincronização
        apiEventsCache = null;
        localStorage.removeItem(LAST_API_SYNC_KEY);
      }
    } catch (apiError) {
      console.warn('Erro ao sincronizar com API (evento salvo localmente):', apiError.message);
    }
    
    return newEvent;
  } catch (error) {
    console.error('Erro ao adicionar evento:', error);
    throw error;
  }
};

// Update event
export const updateEvent = async (id, eventData) => {
  try {
    console.log('Atualizando evento:', id);
    
    const allEvents = await mergeEvents();
    const eventToUpdate = allEvents.find(e => e.id == id);
    
    if (!eventToUpdate) {
      throw new Error('Evento não encontrado');
    }
    
    // Tratar a imagem na atualização
    let updatedImage = eventData.image || eventToUpdate.image;
    let updatedImageData = eventToUpdate.imageData; // Manter existente
    
    // Se nova imagem foi fornecida
    if (eventData.image && eventData.image !== eventToUpdate.image) {
      if (eventData.image.startsWith('data:')) {
        // Nova imagem em base64
        updatedImageData = eventData.image;
        updatedImage = `/assets/events/event-${Date.now()}.jpg`;
      } else {
        updatedImage = eventData.image;
        updatedImageData = null; // Limpar base64 se nova imagem não é base64
      }
    }
    
    // Dados atualizados
    const updatedEvent = {
      ...eventToUpdate,
      ...eventData,
      id: parseInt(id),
      image: updatedImage,
      imageData: updatedImageData,
      updatedAt: new Date().toISOString()
    };
    
    if (eventToUpdate.source === 'local') {
      // Atualizar evento local
      const localEvents = loadLocalEvents();
      const index = localEvents.findIndex(e => e.id == id);
      if (index !== -1) {
        localEvents[index] = updatedEvent;
        saveLocalEvents(localEvents);
      }
    } else {
      // Evento da API - criar versão local atualizada
      updatedEvent.source = 'local';
      const localEvents = loadLocalEvents();
      localEvents.push(updatedEvent);
      saveLocalEvents(localEvents);
    }
    
    // Limpar cache mesclado
    mergedEventsCache = null;
    
    console.log('Evento atualizado com sucesso');
    
    // Tentar sincronizar com API silenciosamente
    try {
      await eventService.updateEvent(id, updatedEvent);
      console.log('Atualização sincronizada com API');
    } catch (apiError) {
      console.warn('Erro ao sincronizar com API (mudanças salvas localmente):', apiError.message);
    }
    
    return updatedEvent;
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (id) => {
  try {
    console.log('Deletando evento:', id);
    
    const allEvents = await mergeEvents();
    const eventToDelete = allEvents.find(e => e.id == id);
    
    if (!eventToDelete) {
      throw new Error('Evento não encontrado');
    }
    
    if (eventToDelete.source === 'local') {
      // Deletar evento local
      const localEvents = loadLocalEvents();
      const filteredEvents = localEvents.filter(e => e.id != id);
      saveLocalEvents(filteredEvents);
    } else {
      // Evento da API - marcar como deletado localmente
      const localEvents = loadLocalEvents();
      localEvents.push({
        id: parseInt(id),
        deleted: true,
        deletedAt: new Date().toISOString(),
        source: 'local'
      });
      saveLocalEvents(localEvents);
    }
    
    // Limpar cache mesclado
    mergedEventsCache = null;
    
    console.log('Evento deletado com sucesso');
    
    // Tentar sincronizar com API silenciosamente
    try {
      await eventService.deleteEvent(id);
      console.log('Deleção sincronizada com API');
    } catch (apiError) {
      console.warn('Erro ao sincronizar com API (deleção salva localmente):', apiError.message);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    throw error;
  }
};

// Get featured events
export const getFeaturedEvents = async () => {
  try {
    const events = await mergeEvents();
    const featured = events.filter(event => event.featured && !event.isDraft && !event.deleted);
    console.log(`Encontrados ${featured.length} eventos em destaque (${featured.filter(e => e.source === 'api').length} da API + ${featured.filter(e => e.source === 'local').length} locais)`);
    return featured;
  } catch (error) {
    console.error('Erro ao obter eventos em destaque:', error);
    return [];
  }
};

// Search events
export const searchEvents = async (query) => {
  try {
    const events = await getEvents();
    return events.filter(event => 
      !event.deleted &&
      (event.title.toLowerCase().includes(query.toLowerCase()) ||
       event.description.toLowerCase().includes(query.toLowerCase()) ||
       event.location.toLowerCase().includes(query.toLowerCase()))
    );
  } catch (error) {
    console.error('Erro na busca de eventos:', error);
    return [];
  }
};

// Filter events - MELHORADO
export const filterEvents = async (filters) => {
  try {
    console.log('filterEvents: Aplicando filtros:', filters);
    
    let events = await getEvents();
    console.log('filterEvents: Total de eventos antes do filtro:', events.length);
    
    // Filtrar eventos deletados
    events = events.filter(event => !event.deleted);
    
    if (filters.search || filters.q) {
      const searchTerm = (filters.search || filters.q).toLowerCase().trim();
      if (searchTerm) {
        events = events.filter(event => 
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.location.toLowerCase().includes(searchTerm)
        );
        console.log('filterEvents: Após filtro de busca:', events.length);
      }
    }
    
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase().trim();
      events = events.filter(event => 
        event.location.toLowerCase().includes(locationTerm)
      );
      console.log('filterEvents: Após filtro de localização:', events.length);
    }
    
    if (filters.category) {
      events = events.filter(event => event.category === filters.category);
      console.log('filterEvents: Após filtro de categoria:', events.length);
    }
    
    if (filters.date) {
      const dateFilter = filters.date;
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          // Filtrar eventos de hoje
          const todayStr = today.toLocaleDateString('pt-BR');
          events = events.filter(event => event.date.includes(todayStr));
          break;
        case 'tomorrow':
          // Filtrar eventos de amanhã
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toLocaleDateString('pt-BR');
          events = events.filter(event => event.date.includes(tomorrowStr));
          break;
        case 'this-week':
          // Filtrar eventos desta semana (próximos 7 dias)
          events = events.filter(event => {
            // Implementação básica - pode ser melhorada
            return true; // Por enquanto retornar todos
          });
          break;
        case 'weekend':
          // Filtrar eventos do fim de semana
          events = events.filter(event => {
            // Implementação básica - pode ser melhorada
            return true; // Por enquanto retornar todos
          });
          break;
        case 'this-month':
          // Filtrar eventos deste mês
          const currentMonth = today.getMonth();
          events = events.filter(event => {
            // Implementação básica - procurar pelo nome do mês na data
            const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                              'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
            const currentMonthName = monthNames[currentMonth];
            return event.date.toLowerCase().includes(currentMonthName);
          });
          break;
        default:
          // Se for uma data específica, procurar na string da data
          if (dateFilter) {
            events = events.filter(event => event.date.includes(dateFilter));
          }
      }
      console.log('filterEvents: Após filtro de data:', events.length);
    }
    
    console.log('filterEvents: Eventos finais filtrados:', events.length);
    return events;
  } catch (error) {
    console.error('filterEvents: Erro ao filtrar eventos:', error);
    return [];
  }
};
// Funções de utilidade
export const refreshFromAPI = async () => {
  try {
    console.log('Forçando sincronização com API...');
    apiEventsCache = null;
    localStorage.removeItem(LAST_API_SYNC_KEY);
    mergedEventsCache = null;
    
    const events = await mergeEvents();
    console.log('Dados sincronizados com API');
    return events;
  } catch (error) {
    console.error('Erro ao sincronizar com API:', error);
    return await mergeEvents();
  }
};

export const clearCache = () => {
  localStorage.removeItem(EVENTS_STORAGE_KEY);
  localStorage.removeItem(API_EVENTS_STORAGE_KEY);
  localStorage.removeItem(LAST_API_SYNC_KEY);
  apiEventsCache = null;
  mergedEventsCache = null;
  eventByIdCache.clear(); // Limpar cache de eventos por ID
  console.log('Cache de eventos limpo');
};

export const clearLocalEvents = () => {
  localStorage.removeItem(LOCAL_EVENTS_STORAGE_KEY);
  localEventsCache = null;
  mergedEventsCache = null;
  console.log('Eventos locais limpos');
};

export const getEventStats = async () => {
  const apiEvents = await loadApiEvents();
  const localEvents = loadLocalEvents();
  
  return {
    total: apiEvents.length + localEvents.length,
    fromAPI: apiEvents.length,
    local: localEvents.length,
    lastAPISync: localStorage.getItem(LAST_API_SYNC_KEY)
  };
};

// Inicializar dados
export const initializeFromAPI = async () => {
  try {
    const events = await mergeEvents();
    console.log(`Sistema inicializado com ${events.length} eventos`);
    return events.length > 0;
  } catch (error) {
    console.error('Erro ao inicializar:', error);
    return false;
  }
};

