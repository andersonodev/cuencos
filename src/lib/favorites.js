
// Mock favorites
let favorites = [];

export const toggleFavorite = (userId, eventId) => {
  const storedFavorites = JSON.parse(localStorage.getItem(`cuencosFavorites_${userId}`) || '[]');
  
  const isFavorite = storedFavorites.includes(eventId);
  
  if (isFavorite) {
    const updatedFavorites = storedFavorites.filter(id => id !== eventId);
    localStorage.setItem(`cuencosFavorites_${userId}`, JSON.stringify(updatedFavorites));
    return false; // Not a favorite anymore
  } else {
    storedFavorites.push(eventId);
    localStorage.setItem(`cuencosFavorites_${userId}`, JSON.stringify(storedFavorites));
    return true; // Now a favorite
  }
};

export const isFavorite = (userId, eventId) => {
  const storedFavorites = JSON.parse(localStorage.getItem(`cuencosFavorites_${userId}`) || '[]');
  return storedFavorites.includes(eventId);
};

export const getFavorites = (userId) => {
  return JSON.parse(localStorage.getItem(`cuencosFavorites_${userId}`) || '[]');
};
