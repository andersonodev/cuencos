
// Mock data para eventos
const events = [
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
    organizers: "Associação Atlética PUC-PR"
  },
  {
    id: 2,
    title: "Calourada 2025.1",
    description: "Calourada da UFRJ do campus de Duque de Caxias.",
    image: "/lovable-uploads/68619dad-8ba1-48be-8d77-8858c3151a75.png",
    date: "8 de Maio de 2025",
    location: "UFRJ - Rio de Janeiro / RJ",
    price: 45.00
  },
  {
    id: 3,
    title: "Ressaca dos Campeões",
    description: "O Uni-games acabou, mas as comemorações só começaram!",
    image: "/lovable-uploads/aba21f9b-e021-4750-b392-540b5d308c84.png",
    date: "10 de Maio de 2025",
    location: "Centro Esportivo - São Paulo / SP",
    price: 35.00
  },
  {
    id: 4,
    title: "Clubhouse (Open Bar)",
    description: "Imagine uma noite onde cada batida te envolve...",
    image: "/lovable-uploads/524806a7-7b46-44f1-9d25-5e8d1d8e1bcc.png",
    date: "09 de Maio de 2025",
    location: "Clubhouse - Florianópolis / SC",
    price: 65.00
  },
  {
    id: 5,
    title: "PUC IN RIO",
    description: "Quem aí não perde uma festa da MAIOR DA CAPITAL??",
    image: "/lovable-uploads/4d09bc83-a8f8-4a0c-aebc-e51cd1526dee.png",
    date: "09 de Maio de 2025",
    location: "OP Events - Rio de Janeiro / RJ",
    price: 80.00
  },
  {
    id: 6,
    title: "Baile do Magna - All Night",
    description: "Venha para a melhor festa universitária de Curitiba!",
    image: "/lovable-uploads/3e8b36aa-1f23-4483-97b1-67d9521b5e6a.png",
    date: "12 de Maio de 2025",
    location: "Magna - Curitiba / PR",
    price: 55.00
  },
  {
    id: 7,
    title: "BLACKOUT - Submundo 707",
    description: "VENHA PREPARADO, O SUBMUNDO TE ESPERA!",
    image: "/lovable-uploads/f8b0e0a5-83e7-431e-b9af-31d9e85e3b19.png",
    date: "15 de Maio de 2025",
    location: "Bar do Juiz - São Paulo / SP",
    price: 45.00
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
