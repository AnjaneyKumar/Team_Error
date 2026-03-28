/**
 * 🌍 Multi-Language Support
 * Simple translation system
 */

export const translations = {
  en: {
    // Header
    title: 'Smart Transit Dashboard',
    search: 'Search routes & stops...',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    language: 'Language',
    
    // Sidebar Tabs
    routes: 'Routes',
    stops: 'Stops',
    buses: 'Buses',
    nearby: 'Nearby',
    analytics: 'Analytics',
    
    // Route Card
    bestRoute: 'Best Route',
    fastest: 'Fastest',
    leastCrowded: 'Least Crowded',
    addFavorite: 'Add to favorites',
    removeFavorite: 'Remove from favorites',
    popularity: 'Popularity',
    frequency: 'Frequency',
    peakHours: 'Peak Hours',
    
    // Bus Info
    arriving: 'Arriving!',
    running: 'Running',
    delayed: 'Delayed',
    stopped: 'Stopped',
    offline: 'Offline',
    occupancy: 'Occupancy',
    capacity: 'Capacity',
    nextStop: 'Next Stop',
    eta: 'ETA',
    speed: 'Speed',
    crowd: 'Crowd',
    
    // Analytics
    analyticsTitle: 'Analytics Dashboard',
    busiestHour: 'Busiest Hour',
    quietestHour: 'Quietest Hour',
    occupancyByHour: 'Occupancy by Hour',
    snapshots: 'Snapshots',
    hoursTracked: 'Hours Tracked',
    routesTracked: 'Routes Tracked',
    
    // Preferences
    preferences: 'Preferences & Settings',
    alerts: 'Alerts',
    notifications: 'Notifications',
    display: 'Display',
    favorites: 'Favorites',
    accessibility: 'Accessibility',
    saveChanges: 'Save Changes',
    resetDefaults: 'Reset to Defaults',
    clearHistory: 'Clear History',
    
    // ML Predictions
    mlEta: 'ML ETA',
    confidence: 'sure',
    distanceFactor: 'Distance',
    timeOfDay: 'Time of Day',
    occupancyMultiplier: 'Occupancy',
    weather: 'Weather',
    congestion: 'Congestion',
    
    // Messages
    noActiveBuses: 'No buses active',
    loadingMap: 'Loading map...',
    dataCollected: 'Data automatically collected every 5 minutes for trend analysis.',
    installApp: 'Install App',
    installMessage: 'Install this app on your device for quick access!',
    
    // Favorites
    noFavorites: 'No favorites yet. Add some from the routes list!',
    favoritesAdded: 'Added to favorites ⭐',
    favoritesRemoved: 'Removed from favorites',
  },
  
  hi: {
    // Header
    title: 'स्मार्ट ट्रांजिट डैशबोर्ड',
    search: 'रूट और स्टॉप खोजें...',
    settings: 'सेटिंग्स',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    
    // Sidebar Tabs
    routes: 'रूट्स',
    stops: 'स्टॉप',
    buses: 'बसें',
    nearby: 'पास में',
    analytics: 'विश्लेषण',
    
    // Route Card
    bestRoute: 'सर्वश्रेष्ठ मार्ग',
    fastest: 'सबसे तेज',
    leastCrowded: 'सबसे कम भीड़',
    addFavorite: 'पसंद में जोड़ें',
    removeFavorite: 'पसंद से हटाएं',
    popularity: 'लोकप्रियता',
    frequency: 'आवृत्ति',
    peakHours: 'पीक आवर्स',
    
    // Bus Info
    arriving: 'आ रहा है!',
    running: 'चल रहा है',
    delayed: 'विलंबित',
    stopped: 'रुका हुआ',
    offline: 'ऑफलाइन',
    occupancy: 'व्यस्तता',
    capacity: 'क्षमता',
    nextStop: 'अगला स्टॉप',
    eta: 'ईटीए',
    speed: 'गति',
    crowd: 'भीड़',
    
    // Analytics
    analyticsTitle: 'विश्लेषण डैशबोर्ड',
    busiestHour: 'सबसे व्यस्त घंटा',
    quietestHour: 'सबसे शांत घंटा',
    occupancyByHour: 'प्रति घंटा व्यस्तता',
    snapshots: 'स्नैपशॉट्स',
    hoursTracked: 'घंटे ट्रैक किए गए',
    routesTracked: 'रूट ट्रैक किए गए',
    
    // Preferences
    preferences: 'प्राथमिकताएं और सेटिंग्स',
    alerts: 'सतर्कताएं',
    notifications: 'सूचनाएं',
    display: 'प्रदर्शन',
    favorites: 'पसंदीदा',
    accessibility: 'पहुंच क्षमता',
    saveChanges: 'परिवर्तन सहेजें',
    resetDefaults: 'डिफ़ॉल्ट रीसेट करें',
    clearHistory: 'इतिहास साफ करें',
    
    // ML Predictions
    mlEta: 'एमएल ईटीए',
    confidence: 'निश्चित',
    distanceFactor: 'दूरी',
    timeOfDay: 'दिन का समय',
    occupancyMultiplier: 'व्यस्तता',
    weather: 'मौसम',
    congestion: 'भीड़',
    
    // Messages
    noActiveBuses: 'कोई सक्रिय बसें नहीं',
    loadingMap: 'मानचित्र लोड हो रहा है...',
    dataCollected: 'डेटा स्वचालित रूप से हर 5 मिनट में एकत्र किया जाता है।',
    installApp: 'ऐप इंस्टॉल करें',
    installMessage: 'तेजी से पहुंच के लिए इस ऐप को अपने डिवाइस पर इंस्टॉल करें!',
    
    // Favorites
    noFavorites: 'अभी कोई पसंदीदा नहीं। रूट्स सूची से कुछ जोड़ें!',
    favoritesAdded: 'पसंद में जोड़ा गया ⭐',
    favoritesRemoved: 'पसंद से हटाया गया',
  },

  es: {
    // Header
    title: 'Panel de Control Inteligente de Tránsito',
    search: 'Buscar rutas y paradas...',
    settings: 'Configuración',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    
    // Sidebar Tabs
    routes: 'Rutas',
    stops: 'Paradas',
    buses: 'Autobuses',
    nearby: 'Cercano',
    analytics: 'Análisis',
    
    // Route Card
    bestRoute: 'Mejor Ruta',
    fastest: 'Más Rápido',
    leastCrowded: 'Menos Concurrido',
    addFavorite: 'Agregar a favoritos',
    removeFavorite: 'Eliminar de favoritos',
    popularity: 'Popularidad',
    frequency: 'Frecuencia',
    peakHours: 'Horas Pico',
    
    // Bus Info
    arriving: '¡Llegando!',
    running: 'En marcha',
    delayed: 'Retrasado',
    stopped: 'Detenido',
    offline: 'Fuera de línea',
    occupancy: 'Ocupación',
    capacity: 'Capacidad',
    nextStop: 'Próxima Parada',
    eta: 'ETA',
    speed: 'Velocidad',
    crowd: 'Multitud',
    
    // Analytics
    analyticsTitle: 'Panel de Análisis',
    busiestHour: 'Hora Más Ocupada',
    quietestHour: 'Hora Más Tranquila',
    occupancyByHour: 'Ocupación por Hora',
    snapshots: 'Instantáneas',
    hoursTracked: 'Horas Rastreadas',
    routesTracked: 'Rutas Rastreadas',
    
    // Preferences
    preferences: 'Preferencias y Configuración',
    alerts: 'Alertas',
    notifications: 'Notificaciones',
    display: 'Pantalla',
    favorites: 'Favoritos',
    accessibility: 'Accesibilidad',
    saveChanges: 'Guardar Cambios',
    resetDefaults: 'Restablecer Valores Predeterminados',
    clearHistory: 'Borrar Historial',
    
    // ML Predictions
    mlEta: 'IA ETA',
    confidence: 'seguro',
    distanceFactor: 'Distancia',
    timeOfDay: 'Hora del Día',
    occupancyMultiplier: 'Ocupación',
    weather: 'Clima',
    congestion: 'Congestión',
    
    // Messages
    noActiveBuses: 'Sin autobuses activos',
    loadingMap: 'Cargando mapa...',
    dataCollected: 'Los datos se recopilan automáticamente cada 5 minutos para análisis de tendencias.',
    installApp: 'Instalar Aplicación',
    installMessage: '¡Instala esta aplicación en tu dispositivo para acceso rápido!',
    
    // Favorites
    noFavorites: 'Sin favoritos aún. ¡Añade algunos de la lista de rutas!',
    favoritesAdded: 'Agregado a favoritos ⭐',
    favoritesRemoved: 'Eliminado de favoritos',
  },
};

/**
 * Get translation for a key
 */
export const t = (key, language = 'en') => {
  return translations[language]?.[key] || translations.en?.[key] || key;
};
