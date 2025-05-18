// Mock data para eventos
const events = [
  {
    id: 1,
    title: "PUC IN RIO",
    description: "O maior evento universitário de Curitiba está de volta!",
    longDescription: "PUC IN RIO é uma experiência única que combina música, diversão e a energia jovem universitária. Este ano, contamos com atrações nacionais, área VIP e muito mais.\n\nNão perca a oportunidade de vivenciar uma noite inesquecível com seus amigos da faculdade!",
    image: "/lovable-uploads/32356300-a01b-4b6e-ba0b-7a23804f784b.png",
    date: "09 de Maio de 2025",
    time: "21:00 - 04:00",
    location: "Em breve... - Curitiba / Paraná",
    price: 80.00,
    featured: true,
    ageRestriction: "Proibido menores de 18 anos",
    organizers: "Associação Atlética PUC-PR"
  },
  {
    id: 2,
    title: "CALOURADA UNINORTE",
    description: "Venha conhecer os novos calouros da UNINORTE!",
    image: "/lovable-uploads/32356300-a01b-4b6e-ba0b-7a23804f784b.png",
    date: "15 de Maio de 2025",
    location: "UNINORTE - Manaus / Amazonas",
    price: 45.00
  },
  {
    id: 3,
    title: "JOGOS UNIVERSITÁRIOS",
    description: "Competições esportivas entre as principais universidades da região",
    image: "/lovable-uploads/32356300-a01b-4b6e-ba0b-7a23804f784b.png",
    date: "22-25 de Maio de 2025",
    location: "Centro Esportivo - São Paulo / SP",
    price: 30.00
  },
  {
    id: 4,
    title: "INTERATLÉTICAS",
    description: "O maior evento das atléticas do sul do Brasil",
    image: "/lovable-uploads/32356300-a01b-4b6e-ba0b-7a23804f784b.png",
    date: "05 de Junho de 2025",
    location: "Estádio Municipal - Florianópolis / SC",
    price: 65.00
  }
];

export const getEvents = () => events;

export const getEventById = (id) => events.find(event => event.id === id);

export const searchEvents = (term, location, date) => {
  // Implementação simplificada de busca
  return events.filter(event => 
    (!term || event.title.toLowerCase().includes(term.toLowerCase())) &&
    (!location || event.location.toLowerCase().includes(location.toLowerCase())) &&
    (!date || event.date.includes(date))
  );
};
