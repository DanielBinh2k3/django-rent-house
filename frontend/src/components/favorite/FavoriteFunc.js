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
export const isFavorite = (listingId) => {
    // Check if favorites exist in local storage
    let storedFavorites = JSON.parse(localStorage.getItem("favoriteProperties"));

    // If favorites don't exist, create an empty array
    if (!storedFavorites) {
      storedFavorites = [];
      localStorage.setItem("favoriteProperties", JSON.stringify(storedFavorites));
    }

    // Check if the listingId exists in the favorites list
    return storedFavorites.includes(listingId);
  };