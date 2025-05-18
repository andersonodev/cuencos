
// Mock events data
export const events = [
  {
    id: 1,
    title: 'PUC IN RIO',
    description: 'Quem aí não perde uma festa da MAIOR DA CAPITAL?? Pensando em vocês, o Hellboy soltou mais uma edição da PUC IN RIO!!',
    image: '/lovable-uploads/edcb0aba-bd3b-48d1-b82e-46a62fd82676.png',
    date: '09.MAIO',
    month: 'MAY',
    location: 'Em breve... - Curitiba / Paraná',
    time: '21H ÀS 04H',
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
      21H ÀS 04H

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
    title: 'Calourada UFRJ BRASIL 2025.1',
    description: 'Calourada da UFRJ, do campus de Duque de Caxias. OPEN BAR!!',
    image: '/lovable-uploads/e47fbcb4-c782-47dd-a0a3-d0fd3462e9d0.png',
    date: '08 DE MAIO',
    month: 'MAY',
    location: 'UFRJ - Duque de Caxias',
    price: 80.0,
  },
  {
    id: 3,
    title: 'Ressaca dos Campeões',
    description: 'O Unigames acabou mas as comemorações só começaram!!',
    image: '/lovable-uploads/aae3785a-62cc-471e-9722-0e9241b07ee7.png',
    month: 'MAY',
    location: 'Unigames - Paraná',
    price: 90.0,
  },
  {
    id: 4,
    title: 'Clubhouse (Open Bar)',
    description: 'Imagine uma noite onde cada batida te envolve...',
    image: '/lovable-uploads/037f3722-d4b0-43c9-98c8-d9dc5f9971ff.png',
    month: 'MAY',
    date: 'SEXTA 09.05',
    location: 'Clubhouse - São Paulo',
    price: 100.0,
  },
  {
    id: 5,
    title: 'Baile do Magna - All Night',
    description: 'Venha para a melhor festa universitária de Curitiba!',
    image: '/lovable-uploads/e20a20aa-8546-4e06-9641-3338f53c0daa.png',
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
