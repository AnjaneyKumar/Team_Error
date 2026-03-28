// Zustand Store for state management

import { create } from 'zustand';

export const useStore = create((set) => ({
  // Dark mode
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  setDarkMode: (isDark) => {
    localStorage.setItem('darkMode', isDark);
    set({ isDarkMode: isDark });
  },

  // Routes
  routes: [],
  setRoutes: (routes) => set({ routes }),
  selectedRoute: null,
  setSelectedRoute: (route) => set({ selectedRoute: route }),

  // Stops
  stops: [],
  setStops: (stops) => set({ stops }),
  selectedStop: null,
  setSelectedStop: (stop) => set({ selectedStop: stop }),
  nearbyStops: [],
  setNearbyStops: (stops) => set({ nearbyStops: stops }),

  // Buses
  buses: [],
  setBuses: (buses) => set({ buses }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Notifications
  notifications: [],
  notificationPanelOpen: false,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: Date.now(), ...notification }
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAllNotifications: () =>
    set({ notifications: [] }),
  toggleNotificationPanel: () =>
    set((state) => ({ notificationPanelOpen: !state.notificationPanelOpen })),
  setNotificationPanelOpen: (open) =>
    set({ notificationPanelOpen: open }),

  // Map
  centerMap: { lat: 40.7128, lng: -74.0060 },
  setCenterMap: (center) => set({ centerMap: center }),
  mapZoom: 13,
  setMapZoom: (zoom) => set({ mapZoom: zoom }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Language
  language: localStorage.getItem('language') || 'en',
  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },

  // Favorites
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  addFavorite: (routeId, routeName) => {
    set((state) => {
      const updated = state.favorites.find(f => f.id === routeId)
        ? state.favorites
        : [...state.favorites, { id: routeId, name: routeName, savedAt: new Date().toISOString() }];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return { favorites: updated };
    });
  },
  removeFavorite: (routeId) => {
    set((state) => {
      const updated = state.favorites.filter(f => f.id !== routeId);
      localStorage.setItem('favorites', JSON.stringify(updated));
      return { favorites: updated };
    });
  },
}));
