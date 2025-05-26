// Mock data for events with localStorage persistence
const EVENTS_STORAGE_KEY = 'cuencos_events';

// Initial mock data for events - EXPANDIDO E CORRIGIDO
const initialEvents = [
  {
    id: 1,
    title: "PUC IN RIO",
    description: "Quem ainda perde uma festa da MAIOR DA CAPITAL?? Pensando em vocês, o Hellboy soltou mais uma edição da PUC IN RIO!!",
    longDescription: "PUC IN RIO é uma experiência única que combina música, diversão e a energia jovem universitária. Este ano, contamos com atrações nacionais, área VIP e muito mais.\n\nNão perca a oportunidade de vivenciar uma noite inesquecível com seus amigos da faculdade!",
    image: "./assets/images/events/puc-in-rio.jpg",
    date: "09 de Maio de 2025",
    time: "21:00 - 04:00",
    location: "Em breve... - Curitiba / Paraná",
    price: 80.00,
    featured: true,
    ageRestriction: "Proibido menores de 18 anos",
    organizers: "Associação Atlética PUC-PR",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 84,
    category: "festa"
  },
  {
    id: 2,
    title: "Calourada 2025.1",
    description: "Calourada da UFRJ do campus de Duque de Caxias.",
    longDescription: "A maior festa de recepção aos calouros de 2025! Uma noite repleta de música, diversão e novas amizades. Venha fazer parte da família UFRJ!",
    image: "./assets/images/events/calourada-2025-1.jpg",
    date: "8 de Maio de 2025",
    time: "20:00 - 03:00",
    location: "UFRJ - Rio de Janeiro / RJ",
    price: 45.00,
    featured: false,
    ageRestriction: "Proibido menores de 18 anos",
    organizers: "DCE UFRJ",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 32,
    category: "festa"
  },
  {
    id: 3,
    title: "BAILE DO MAGNA",
    description: "O tradicional baile da faculdade que promete agitar a noite com muita música e diversão!",
    longDescription: "Uma das festas mais aguardadas do calendário universitário. O Baile do Magna reúne estudantes de várias faculdades em uma noite épica de celebração.",
    image: "./assets/images/events/baile-do-magna.jpg",
    date: "15 de Maio de 2025",
    time: "22:00 - 05:00",
    location: "Clube Magna - São Paulo / SP",
    price: 65.00,
    featured: true,
    ageRestriction: "Proibido menores de 18 anos",
    organizers: "Magna Atlética",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 156,
    category: "festa"
  },
  {
    id: 4,
    title: "ENGENHARIADAS PARANAENSE 2025",
    description: "O maior evento esportivo das engenharias do Paraná está chegando!",
    longDescription: "Três dias de competição, integração e muito networking entre os futuros engenheiros do estado. Modalidades: futebol, vôlei, basquete, natação e muito mais!",
    image: "./assets/images/events/engenhariadas-paranaense-2025.jpg",
    date: "22 de Junho de 2025",
    time: "08:00 - 18:00",
    location: "Centro Esportivo UTFPR - Curitiba / PR",
    price: 120.00,
    featured: false,
    ageRestriction: "Aberto a todas as idades",
    organizers: "UTFPR + Parceiros",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 89,
    category: "esporte"
  },
  {
    id: 5,
    title: "FESTA DA MEDICINA UFMG",
    description: "A festa mais aguardada do curso de medicina está de volta!",
    longDescription: "Uma noite especial para celebrar a medicina e a vida universitária. Com decoração temática hospitalar e muito humor médico!",
    image: "./assets/images/events/festa-da-medicina-ufmg.jpg",
    date: "30 de Maio de 2025",
    time: "21:30 - 04:00",
    location: "Espaço Mineirão - Belo Horizonte / MG",
    price: 75.00,
    featured: false,
    ageRestriction: "Proibido menores de 18 anos",
    organizers: "Atlética Medicina UFMG",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 67,
    category: "festa"
  },
  {
    id: 6,
    title: "INTERCOMP 2025",
    description: "Competição de programação e tecnologia entre universidades!",
    longDescription: "O maior evento de tecnologia universitária do país! Hackathon, palestras, workshops e networking com as maiores empresas de tech.",
    image: "./assets/images/events/intercomp-2025.jpg",
    date: "12 de Julho de 2025",
    time: "09:00 - 22:00",
    location: "Campus USP - São Paulo / SP",
    price: 50.00,
    featured: true,
    ageRestriction: "Aberto a todas as idades",
    organizers: "IME-USP + Tech Companies",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 234,
    category: "academico"
  },
  {
    id: 7,
    title: "FORRÓ UNIVERSITÁRIO DO NORDESTE",
    description: "O melhor do forró universitário em uma noite inesquecível!",
    longDescription: "Uma celebração da cultura nordestina com as melhores bandas de forró da região. Venha dançar e se divertir ao som do melhor forró!",
    image: "./assets/images/events/forro-universitario-do-nordeste.jpg",
    date: "18 de Maio de 2025",
    time: "20:00 - 02:00",
    location: "Centro de Convenções - Fortaleza / CE",
    price: 40.00,
    featured: false,
    ageRestriction: "Proibido menores de 16 anos",
    organizers: "Movimento Forrozeiro Universitário",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 178,
    category: "show"
  },
  {
    id: 8,
    title: "JOGOS JURÍDICOS SULAMERICANOS",
    description: "A maior competição esportiva dos cursos de Direito da América do Sul!",
    longDescription: "Evento histórico reunindo estudantes de Direito de todo o continente. Competições esportivas, debates jurídicos e integração internacional.",
    image: "./assets/images/events/jogos-juridicos-sul-americanos.jpg",
    date: "5 de Agosto de 2025",
    time: "07:00 - 20:00",
    location: "Complexo Esportivo UBA - Buenos Aires / Argentina",
    price: 200.00,
    featured: true,
    ageRestriction: "Aberto a todas as idades",
    organizers: "Federação Sul-Americana de Direito",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 45,
    category: "esporte"
  },
  {
    id: 9,
    title: "HALLOWEEN UNIVERSITÁRIO SP",
    description: "A festa de Halloween mais assombrada de São Paulo!",
    longDescription: "Uma noite de terror e diversão! Concurso de fantasias, decoração assustadora e muito rock! Venha vestido para assustar!",
    image: "./assets/images/events/halloween-universitario-sp.jpg",
    date: "31 de Outubro de 2025",
    time: "22:00 - 06:00",
    location: "Memorial da América Latina - São Paulo / SP",
    price: 85.00,
    featured: false,
    ageRestriction: "Proibido menores de 18 anos",
    organizers: "Coletivo Halloween SP",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 92,
    category: "festa"
  },
  {
    id: 10,
    title: "STARTUP WEEKEND UNIVERSITÁRIO",
    description: "54 horas para criar a próxima grande startup!",
    longDescription: "O maior evento de empreendedorismo universitário! Forme sua equipe, desenvolva sua ideia e compete por prêmios incríveis com mentoria de grandes empresários.",
    image: "./assets/images/events/startup-weekend-universitario.jpg",
    date: "20 de Setembro de 2025",
    time: "18:00 - 21:00",
    location: "Innovation Hub - Rio de Janeiro / RJ",
    price: 80.00,
    featured: true,
    ageRestriction: "Aberto a todas as idades",
    organizers: "Techstars + Google for Startups",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 167,
    category: "academico"
  },
  {
    id: 11,
    title: "BATUKADA UNIVERSITÁRIA",
    description: "O maior encontro de baterias universitárias do Brasil!",
    longDescription: "Uma explosão de ritmo e energia! As melhores baterias universitárias do país se encontram para uma apresentação épica. Venha sentir o poder da percussão!",
    image: "./assets/images/events/batukada-universitaria.jpg",
    date: "14 de Junho de 2025",
    time: "16:00 - 23:00",
    location: "Sambódromo da Marquês de Sapucaí - Rio de Janeiro / RJ",
    price: 60.00,
    featured: false,
    ageRestriction: "Aberto a todas as idades",
    organizers: "Liga das Baterias Universitárias",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 203,
    category: "show"
  },
  {
    id: 12,
    title: "FESTA JUNINA UNIVERSITÁRIA",
    description: "Arraiá universitário com quadrilha, comidas típicas e muito forró!",
    longDescription: "A festa junina mais animada do calendário universitário! Quadrilha maluca, comidas típicas, fogueira e muito forró para celebrar São João em grande estilo!",
    image: "./assets/images/events/festa-junina-universitaria.jpg",
    date: "24 de Junho de 2025",
    time: "19:00 - 02:00",
    location: "Campus Central UFBA - Salvador / BA",
    price: 35.00,
    featured: false,
    ageRestriction: "Aberto a todas as idades",
    organizers: "DCE UFBA",
    createdBy: "organizador@cuencos.com",
    isDraft: false,
    salesCount: 156,
    category: "festa"
  }
];

// Load events from localStorage or use initial data
const loadEvents = () => {
  try {
    const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Save initial data if nothing exists
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEvents));
    return initialEvents;
  } catch (error) {
    console.error('Error loading events:', error);
    return initialEvents;
  }
};

// Save events to localStorage
const saveEvents = (events) => {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events:', error);
  }
};

// Get all events
export const getEvents = () => {
  return loadEvents().filter(event => !event.isDraft);
};

// Get all events including drafts (for organizers)
export const getAllEvents = () => {
  return loadEvents();
};

// Get event by ID
export const getEventById = (id) => {
  const events = loadEvents();
  return events.find(event => event.id === id);
};

// Get events by user (organizer)
export const getEventsByUser = (userId) => {
  const events = loadEvents();
  return events.filter(event => event.createdBy === userId);
};

// Add new event
export const addEvent = (eventData) => {
  const events = loadEvents();
  const newEvent = {
    ...eventData,
    id: Math.max(...events.map(e => e.id), 0) + 1,
    salesCount: 0,
  };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
};

// Update event
export const updateEvent = (id, eventData) => {
  const events = loadEvents();
  const index = events.findIndex(event => event.id === id);
  if (index !== -1) {
    events[index] = { ...events[index], ...eventData };
    saveEvents(events);
    return events[index];
  }
  return null;
};

// Delete event
export const deleteEvent = (id) => {
  const events = loadEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  saveEvents(filteredEvents);
  return true;
};

// Get featured events
export const getFeaturedEvents = () => {
  const events = getEvents();
  return events.filter(event => event.featured);
};

// Search events
export const searchEvents = (query) => {
  const events = getEvents();
  return events.filter(event => 
    event.title.toLowerCase().includes(query.toLowerCase()) ||
    event.description.toLowerCase().includes(query.toLowerCase()) ||
    event.location.toLowerCase().includes(query.toLowerCase())
  );
};

// Filter events
export const filterEvents = (filters) => {
  let events = getEvents();
  
  if (filters.search) {
    events = events.filter(event => 
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  
  if (filters.location) {
    events = events.filter(event => 
      event.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.category) {
    events = events.filter(event => event.category === filters.category);
  }
  
  if (filters.date) {
    // Simple date filtering - can be enhanced
    events = events.filter(event => event.date.includes(filters.date));
  }
  
  return events;
};
