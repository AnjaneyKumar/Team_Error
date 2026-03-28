/**
 * 🔔 User Alerts & Preferences System
 * Custom alert rules, notification preferences, user settings
 */

/**
 * Default user preferences
 */
export const defaultPreferences = {
  // Alert settings
  alerts: {
    delayThreshold: 5, // Alert if delayed > 5 minutes
    crowdThreshold: 80, // Alert if occupancy > 80%
    frequencyThreshold: 15, // Alert if buses come > 15 min apart
    peakHourAlerts: true, // Alert during peak hours
    offPeakAlerts: false // Don't alert during quiet times
  },

  // Notification settings
  notifications: {
    enabled: true,
    sound: true,
    desktop: true, // Browser notifications
    email: false, // Not for demo
    sms: false // Not for demo
  },

  // Favorite routes
  favoriteRoutes: [],

  // Blacklist routes
  blacklistedRoutes: [],

  // Display preferences
  display: {
    darkMode: false,
    compactMode: false,
    showPredictions: true,
    showAnalytics: true
  },

  // Transportation preferences
  transport: {
    maxWalkTime: 15, // Minutes willing to walk
    preferredRoutes: [], // Preferred route IDs
    avoidRoutes: [], // Routes to avoid
    accessibility: {
      wheelchairAccess: false,
      visualAid: false,
      elevator: false
    }
  }
};

/**
 * 💾 LocalStorage Preferences Manager
 */
class PreferencesManager {
  constructor() {
    this.storageKey = 'transit_user_preferences';
    this.alertsKey = 'transit_alert_history';
  }

  /**
   * Get all user preferences
   */
  getPreferences() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : defaultPreferences;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return defaultPreferences;
    }
  }

  /**
   * Update specific preference
   */
  updatePreference(path, value) {
    try {
      const prefs = this.getPreferences();
      this._setNested(prefs, path, value); // path: "alerts.delayThreshold"
      localStorage.setItem(this.storageKey, JSON.stringify(prefs));
      return prefs;
    } catch (error) {
      console.error('Error updating preference:', error);
      return null;
    }
  }

  /**
   * Add favorite route
   */
  addFavoriteRoute(routeId, routeName) {
    const prefs = this.getPreferences();
    if (!prefs.favoriteRoutes.find(r => r.id === routeId)) {
      prefs.favoriteRoutes.push({ id: routeId, name: routeName, addedAt: new Date() });
      localStorage.setItem(this.storageKey, JSON.stringify(prefs));
    }
    return prefs.favoriteRoutes;
  }

  /**
   * Remove favorite route
   */
  removeFavoriteRoute(routeId) {
    const prefs = this.getPreferences();
    prefs.favoriteRoutes = prefs.favoriteRoutes.filter(r => r.id !== routeId);
    localStorage.setItem(this.storageKey, JSON.stringify(prefs));
    return prefs.favoriteRoutes;
  }

  /**
   * Check if route is favorite
   */
  isFavorite(routeId) {
    const prefs = this.getPreferences();
    return prefs.favoriteRoutes.some(r => r.id === routeId);
  }

  /**
   * Helper: Set nested object property
   */
  _setNested(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
  }

  /**
   * 🔔 Check if route should trigger alert
   */
  shouldAlert(route, buses, alertType) {
    const prefs = this.getPreferences();

    // Check if route is blacklisted
    if (prefs.blacklistedRoutes.includes(route._id)) return false;

    // Check alert settings
    switch (alertType) {
      case 'delay': {
        const routeBuses = buses.filter(b => b.route?._id === route._id);
        const avgDelay = routeBuses.reduce((sum, b) => sum + (b.delayMinutes || 0), 0) / routeBuses.length;
        return avgDelay > prefs.alerts.delayThreshold;
      }

      case 'crowd': {
        const routeBuses = buses.filter(b => b.route?._id === route._id);
        const avgOccupancy = routeBuses.reduce((sum, b) => sum + b.occupancy, 0) / routeBuses.length / (routeBuses[0]?.capacity || 1);
        return avgOccupancy > prefs.alerts.crowdThreshold / 100;
      }

      case 'frequency': {
        const busCount = buses.filter(b => b.route?._id === route._id).length;
        const frequency = busCount >= 5 ? 5 : busCount >= 3 ? 10 : 15;
        return frequency > prefs.alerts.frequencyThreshold;
      }

      default:
        return false;
    }
  }

  /**
   * Get custom alerts for user
   */
  getCustomAlerts(routes, buses) {
    const prefs = this.getPreferences();
    const alerts = [];

    routes.forEach(route => {
      if (this.shouldAlert(route, buses, 'delay')) {
        alerts.push({
          type: 'delay',
          route: route.name,
          message: '⏱️ This route is experiencing delays',
          severity: 'high'
        });
      }

      if (this.shouldAlert(route, buses, 'crowd')) {
        alerts.push({
          type: 'crowd',
          route: route.name,
          message: '👥 This route is very crowded',
          severity: 'medium'
        });
      }

      if (this.shouldAlert(route, buses, 'frequency')) {
        alerts.push({
          type: 'frequency',
          route: route.name,
          message: '⏳ Low bus frequency on this route',
          severity: 'low'
        });
      }
    });

    return alerts;
  }

  /**
   * Reset to defaults
   */
  reset() {
    localStorage.removeItem(this.storageKey);
    return defaultPreferences;
  }
}

// Singleton instance
export const preferencesManager = new PreferencesManager();

/**
 * Hook-compatible getter
 */
export const useUserPreferences = () => {
  return preferencesManager.getPreferences();
};
