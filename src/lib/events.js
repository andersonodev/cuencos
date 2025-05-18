
// Mock events data
export const events = [
  {
    id: 1,
    title: 'PUC IN RIO',
    description: 'Quem aí não perde uma festa da MAIOR DA CAPITAL?? Pensando em vocês, o Hellboy soltou mais uma edição da PUC IN RIO!!',
    image: '/images/puc-in-rio.jpg',
    date: '09.MAIO',
    month: 'MAY',
    location: 'Em breve... - Curitiba / Paraná',
    time: '21:00 PM - 4:00 AM',
    ageRestriction: 'Proibido menores de 18',
    organizers: 'Associação Atlética e Acadêmica de Eng e Arq da PUCPR - AAAEA-PUCPR',
    price: 110.0,
    longDescription: `
      FALA RAÇA!

      Quem aí não perde uma festa da MAIOR DA CAPITAL??

      Pensando em vocês, o Hellboy soltou mais uma edição da PUC IN RIO!!

      Vocês estão preparados pra?

      Esperamos que sim! Aqui é PUC, ninguém é fraco e sem talento!

      Agora o que todo mundo quer saber...

      Quando?
      09 de maio de 2025
      21h - 04h

      Onde?
      EM BREVE...

      OPEN BAR
      -Cerveja Itaipava
      -Vodka
      -Energético
      -Refrigerante
      -Gummy

      ATRAÇÕES:
      EM BREVE...
    `,
    featured: true
  },
  {
    id: 2,
    title: 'Calourada 2025.1',
    description: 'Calourada da UFRJ, do campus de Duque de Caxias.',
    image: '/images/calourada-brasil.jpg',
    date: '08 DE MAIO',
    month: 'MAY',
    location: 'UFRJ - Duque de Caxias',
    price: 80.0,
  },
  {
    id: 3,
    title: 'Ressaca dos Campeões',
    description: 'O Unigames acabou mas as comemorações só começaram!!',
    image: '/images/ressaca.jpg',
    month: 'MAY',
    location: 'Unigames - Paraná',
    price: 90.0,
  },
  {
    id: 4,
    title: 'Clubhouse (Open Bar)',
    description: 'Imagine uma noite onde cada batida te envolve...',
    image: '/images/clubhouse.jpg',
    month: 'MAY',
    date: 'SEXTA 09.05',
    location: 'Clubhouse - São Paulo',
    price: 100.0,
  },
  {
    id: 5,
    title: 'Baile do Magna - All Night',
    description: 'Venha para a melhor festa universitária de Curitiba!',
    image: '/images/baile-magna.jpg',
    month: 'MAY',
    location: 'Magna - Curitiba',
    price: 85.0,
  },
  {
    id: 6,
    title: 'BLACKOUT - Submundo 707',
    description: 'VENHA PREPARADO, O SUBMUNDO TE ESPERA!',
    image: '/images/blackout.jpg',
    month: 'MAY',
    date: '15.05',
    location: 'Bar do Juiz - Pelotas',
    price: 95.0,
  }
];

export const getEvents = () => {
  return events;
};

export const getEventById = (id) => {
  return events.find(event => event.id === Number(id));
};

export const searchEvents = (query, location, date) => {
  let filtered = [...events];
  
  if (query) {
    filtered = filtered.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  if (location && location !== 'Todos') {
    filtered = filtered.filter(event => 
      event.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // For simplicity, we're not implementing actual date filtering
  
  return filtered;
};
