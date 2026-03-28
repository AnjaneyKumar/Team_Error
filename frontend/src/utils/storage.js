/**
 * 💾 Local Storage Utility
 * Manages favorites and user preferences
 */

// Save favorite route
export const saveFavorite = (routeId, routeName = '') => {
  const favs = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favs.find(f => f.id === routeId)) {
    favs.push({
      id: routeId,
      name: routeName,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem('favorites', JSON.stringify(favs));
  }
};

// Remove favorite route
export const removeFavorite = (routeId) => {
  const favs = JSON.parse(localStorage.getItem('favorites')) || [];
  const updated = favs.filter(f => f.id !== routeId);
  localStorage.setItem('favorites', JSON.stringify(updated));
};

// Get all favorites
export const getFavorites = () => {
  return JSON.parse(localStorage.getItem('favorites')) || [];
};

// Check if route is favorite
export const isFavorite = (routeId) => {
  const favs = JSON.parse(localStorage.getItem('favorites')) || [];
  return favs.some(f => f.id === routeId);
};

// Clear all favorites
export const clearFavorites = () => {
  localStorage.removeItem('favorites');
};

/**
 * 🌍 Language Storage
 */

export const setLanguage = (lang) => {
  localStorage.setItem('language', lang);
};

export const getLanguage = () => {
  return localStorage.getItem('language') || 'en';
};

/**
 * 🎨 Theme Storage
 */

export const setTheme = (isDark) => {
  localStorage.setItem('isDarkMode', JSON.stringify(isDark));
};

export const getTheme = () => {
  const stored = localStorage.getItem('isDarkMode');
  return stored ? JSON.parse(stored) : false;
};
