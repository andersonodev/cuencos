
// Mock data for events with localStorage persistence
const EVENTS_STORAGE_KEY = 'cuencos_events';

// Initial mock data for events
const initialEvents = [
  {
    id: 1,
    title: "PUC IN RIO",
    description: "Quem ainda perde uma festa da MAIOR DA CAPITAL?? Pensando em vocês, o Hellboy soltou mais uma edição da PUC IN RIO!!",
    longDescription: "PUC IN RIO é uma experiência única que combina música, diversão e a energia jovem universitária. Este ano, contamos com atrações nacionais, área VIP e muito mais.\n\nNão perca a oportunidade de vivenciar uma noite inesquecível com seus amigos da faculdade!",
    image: "/lovable-uploads/4d09bc83-a8f8-4a0c-aebc-e51cd1526dee.png",
    date: "09 de Maio de 2025",
    time: "21:00 - 04:00",
    location: "Em breve... - Curitiba / Paraná",
    price: 80.00,
    featured: true,
    ageRestriction: "Proibido menores de 18 anos",
    organizers: "Associação Atlética PUC-PR",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 84
  },
  {
    id: 2,
    title: "Calourada 2025.1",
    description: "Calourada da UFRJ do campus de Duque de Caxias.",
    image: "/lovable-uploads/68619dad-8ba1-48be-8d77-8858c3151a75.png",
    date: "8 de Maio de 2025",
    location: "UFRJ - Rio de Janeiro / RJ",
    price: 45.00,
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 32
  },
  {
    id: 3,
    title: "Ressaca dos Campeões",
    description: "O Uni-games acabou, mas as comemorações só começaram!",
    image: "/lovable-uploads/aba21f9b-e021-4750-b392-540b5d308c84.png",
    date: "10 de Maio de 2025",
    location: "Centro Esportivo - São Paulo / SP",
    price: 35.00,
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 28
  },
  {
    id: 4,
    title: "Clubhouse (Open Bar)",
    description: "Imagine uma noite onde cada batida te envolve...",
    image: "/lovable-uploads/524806a7-7b46-44f1-9d25-5e8d1d8e1bcc.png",
    date: "09 de Maio de 2025",
    location: "Clubhouse - Florianópolis / SC",
    price: 65.00,
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 15
  },
  {
    id: 5,
    title: "PUC IN RIO",
    description: "Quem aí não perde uma festa da MAIOR DA CAPITAL??",
    image: "/lovable-uploads/4d09bc83-a8f8-4a0c-aebc-e51cd1526dee.png",
    date: "09 de Maio de 2025",
    location: "OP Events - Rio de Janeiro / RJ",
    price: 80.00,
    createdBy: "organizador@cuencos.com",
    isDraft: true
  },
  {
    id: 6,
    title: "Baile do Magna - All Night",
    description: "Venha para a melhor festa universitária de Curitiba!",
    image: "/lovable-uploads/3e8b36aa-1f23-4483-97b1-67d9521b5e6a.png",
    date: "12 de Maio de 2025",
    location: "Magna - Curitiba / PR",
    price: 55.00,
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 12
  },
  {
    id: 7,
    title: "BLACKOUT - Submundo 707",
    description: "VENHA PREPARADO, O SUBMUNDO TE ESPERA!",
    image: "/lovable-uploads/f8b0e0a5-83e7-431e-b9af-31d9e85e3b19.png",
    date: "15 de Maio de 2025",
    location: "Bar do Juiz - São Paulo / SP",
    price: 45.00,
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 44
  }
];

// Initialize events in localStorage if not present
const initializeEvents = () => {
  try {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!storedEvents) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
      return initialEvents;
    }
    return JSON.parse(storedEvents);
  } catch (error) {
    console.error("Erro ao inicializar eventos:", error);
    return initialEvents;
  }
};

// Get all events from localStorage
export const getEvents = () => {
  try {
    const events = localStorage.getItem(EVENTS_STORAGE_KEY);
    return events ? JSON.parse(events) : initializeEvents();
  } catch (error) {
    console.error("Erro ao obter eventos:", error);
    return initializeEvents();
  }
};

// Get a specific event by ID
export const getEventById = (id) => {
  const events = getEvents();
  return events.find(event => event.id === id);
};

// Add a new event
export const addEvent = (eventData) => {
  try {
    const events = getEvents();
    const newEvent = {
      id: Date.now(),
      ...eventData,
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  } catch (error) {
    console.error("Erro ao adicionar evento:", error);
    return null;
  }
};

// Update an existing event
export const updateEvent = (id, eventData) => {
  try {
    const events = getEvents();
    const index = events.findIndex(event => event.id === id);
    
    if (index === -1) return null;
    
    events[index] = {
      ...events[index],
      ...eventData,
      id: id, // Ensure the ID doesn't get overwritten
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    return events[index];
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return null;
  }
};

// Delete an event
export const deleteEvent = (id) => {
  try {
    const events = getEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    
    if (filteredEvents.length === events.length) return false;
    
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filteredEvents));
    return true;
  } catch (error) {
    console.error("Erro ao remover evento:", error);
    return false;
  }
};

// Get events created by a specific user
export const getEventsByUser = (userId) => {
  const events = getEvents();
  return events.filter(event => event.createdBy === userId);
};

// Get most popular events (by sales)
export const getPopularEvents = (limit = 5) => {
  const events = getEvents().filter(event => !event.isDraft);
  events.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
  return events.slice(0, limit);
};

// Search events with filters
export const searchEvents = (term, location, date) => {
  const events = getEvents();
  // Implementação simplificada de busca
  return events.filter(event => 
    (!term || event.title.toLowerCase().includes(term.toLowerCase())) &&
    (!location || event.location.toLowerCase().includes(location.toLowerCase())) &&
    (!date || event.date.includes(date))
  );
};

// Convert a file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Save an event image
export const saveEventImage = async (file, eventId) => {
  try {
    if (!file) return null;
    
    // For a real app, this would upload to a server
    // For our mock, we'll convert to base64 and store it
    const base64 = await fileToBase64(file);
    
    // In a real app, we might store this in a separate images collection
    // For now, we'll add an entry to localStorage
    const imageKey = `event_image_${eventId}`;
    localStorage.setItem(imageKey, base64);
    
    return base64; // Return the base64 data URL
  } catch (error) {
    console.error("Erro ao salvar imagem:", error);
    return null;
  }
};

// Get an event image
export const getEventImage = (eventId) => {
  try {
    const imageKey = `event_image_${eventId}`;
    return localStorage.getItem(imageKey);
  } catch (error) {
    console.error("Erro ao obter imagem:", error);
    return null;
  }
};

// Check if an image meets minimum dimensions
export const validateImageDimensions = (imageSrc, minWidth = 1170, minHeight = 504) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isValid = img.width >= minWidth && img.height >= minHeight;
      resolve(isValid);
    };
    img.onerror = () => {
      resolve(false);
    };
    img.src = imageSrc;
  });
};

// Make sure events are initialized when this module is imported
initializeEvents();
