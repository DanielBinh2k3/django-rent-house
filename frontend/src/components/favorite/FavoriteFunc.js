export const toggleFavorites = (itemId) => {
  // Load existing favorites from local storage
  const storedFavorites = localStorage.getItem('favoriteProperties');
  const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

  // Check if the item is already in favorites
  const isFavorite = favorites.some((favoriteId) => favoriteId === itemId);

  if (!isFavorite) {
    // Add the item to favorites
    favorites.push(itemId);
    localStorage.setItem('favoriteProperties', JSON.stringify(favorites));
  } else {
    // Remove the item from favorites
    const updatedFavorites = favorites.filter((favoriteId) => favoriteId !== itemId);
    localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
  }
  window.location.reload();
};
