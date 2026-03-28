import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useStore } from '../context/store';
import { preferencesManager } from '../utils/userPreferences';

/**
 * ⚙️ Preferences Modal
 * Configure alerts, notifications, and personal preferences
 */
function PreferencesModal({ isOpen, onClose }) {
  const { isDarkMode } = useStore();
  const [currentTab, setCurrentTab] = useState('alerts');
  
  // Safe default preferences structure
  const defaultPreferences = {
    alerts: {
      delayThreshold: 5,
      crowdThreshold: 80,
      frequencyThreshold: 15,
    },
    notifications: {
      sound: false,
      desktop: false,
      email: false,
      sms: false,
    },
    display: {
      darkMode: false,
      compactMode: false,
      showPredictions: true,
      showAnalytics: true,
    },
    favorites: [],
    accessibility: {
      wheelchairAccessible: false,
      audioDescriptions: false,
      largeText: false,
      highContrast: false,
    },
  };

  // Initialize state with safe merging of stored preferences
  const [preferences, setPreferences] = useState(() => {
    const stored = preferencesManager.getPreferences() || {};

    return {
      ...defaultPreferences,
      ...stored,
      alerts: { ...defaultPreferences.alerts, ...(stored.alerts || {}) },
      notifications: { ...defaultPreferences.notifications, ...(stored.notifications || {}) },
      display: { ...defaultPreferences.display, ...(stored.display || {}) },
      accessibility: { ...defaultPreferences.accessibility, ...(stored.accessibility || {}) },
      favorites: stored.favorites || [],
    };
  });
  const [savedAlert, setSavedAlert] = useState(false);

  const tabs = [
    { id: 'alerts', label: 'Alerts', icon: '🚨' },
    { id: 'notifications', label: 'Notifications', icon: '📢' },
    { id: 'display', label: 'Display', icon: '🎨' },
    { id: 'favorites', label: 'Favorites', icon: '⭐' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
  ];

  const handlePreferenceChange = (path, value) => {
    const keys = path.split('.');

    setPreferences(prev => {
      const updated = { ...prev };
      let obj = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = obj[keys[i]] || {};
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }

      obj[keys[keys.length - 1]] = value;

      return updated;
    });
  };

  const handleSave = () => {
    preferencesManager.updatePreference('alerts', preferences.alerts);
    preferencesManager.updatePreference('notifications', preferences.notifications);
    preferencesManager.updatePreference('display', preferences.display);
    preferencesManager.updatePreference('accessibility', preferences.accessibility);

    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleReset = () => {
    preferencesManager.reset();
    const stored = preferencesManager.getPreferences() || {};

    setPreferences({
      ...defaultPreferences,
      ...stored,
      alerts: { ...defaultPreferences.alerts, ...(stored.alerts || {}) },
      notifications: { ...defaultPreferences.notifications, ...(stored.notifications || {}) },
      display: { ...defaultPreferences.display, ...(stored.display || {}) },
      accessibility: { ...defaultPreferences.accessibility, ...(stored.accessibility || {}) },
      favorites: stored.favorites || [],
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('⚠️ Clear all historical analytics data? This cannot be undone.')) {
      localStorage.removeItem('transit_historical_data');
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 2000);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          />

          {/* Modal Container - Centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
                isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'
              }`}
            >
            {/* Header */}
            <div
              className={`sticky top-0 flex items-center justify-between p-4 border-b ${
                isDarkMode ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'
              }`}
              style={{ backdropFilter: 'blur(4px)' }}
            >
              <h2 className="text-lg font-bold">⚙️ Preferences & Settings</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div
              className={`flex gap-2 p-4 border-b overflow-x-auto ${
                isDarkMode ? 'border-gray-800' : 'border-gray-200'
              }`}
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                    currentTab === tab.id
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon} {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 space-y-4"
            >
              {/* Alerts Tab */}
              {currentTab === 'alerts' && (
                <div className="space-y-3">
                  <h3 className="font-bold">🚨 Alert Thresholds</h3>
                  <SettingRow
                    label="Delay Alert (minutes)"
                    value={preferences.alerts.delayThreshold || 5}
                    onChange={(val) =>
                      handlePreferenceChange('alerts.delayThreshold', parseInt(val))
                    }
                    description="Alert when bus is delayed by this many minutes"
                  />
                  <SettingRow
                    label="Crowd Alert (%)"
                    value={preferences.alerts.crowdThreshold || 80}
                    onChange={(val) =>
                      handlePreferenceChange('alerts.crowdThreshold', parseInt(val))
                    }
                    description="Alert when occupancy exceeds this percentage"
                  />
                  <SettingRow
                    label="Frequency Alert (minutes)"
                    value={preferences.alerts.frequencyThreshold || 15}
                    onChange={(val) =>
                      handlePreferenceChange('alerts.frequencyThreshold', parseInt(val))
                    }
                    description="Show low frequency alert if bus comes every X minutes"
                  />
                </div>
              )}

              {/* Notifications Tab */}
              {currentTab === 'notifications' && (
                <div className="space-y-3">
                  <h3 className="font-bold">📢 Notification Channels</h3>
                  <ToggleSetting
                    label="🔊 Sound Alerts"
                    checked={preferences.notifications.sound || false}
                    onChange={(val) =>
                      handlePreferenceChange('notifications.sound', val)
                    }
                  />
                  <ToggleSetting
                    label="🖥️ Desktop Notifications"
                    checked={preferences.notifications.desktop || false}
                    onChange={(val) =>
                      handlePreferenceChange('notifications.desktop', val)
                    }
                  />
                  <ToggleSetting
                    label="📧 Email Alerts"
                    checked={preferences.notifications.email || false}
                    onChange={(val) =>
                      handlePreferenceChange('notifications.email', val)
                    }
                  />
                  <ToggleSetting
                    label="📱 SMS Alerts"
                    checked={preferences.notifications.sms || false}
                    onChange={(val) =>
                      handlePreferenceChange('notifications.sms', val)
                    }
                  />
                </div>
              )}

              {/* Display Tab */}
              {currentTab === 'display' && (
                <div className="space-y-3">
                  <h3 className="font-bold">🎨 Display Options</h3>
                  <ToggleSetting
                    label="🌙 Dark Mode"
                    checked={preferences.display.darkMode || false}
                    onChange={(val) =>
                      handlePreferenceChange('display.darkMode', val)
                    }
                  />
                  <ToggleSetting
                    label="📦 Compact Mode"
                    checked={preferences.display.compactMode || false}
                    onChange={(val) =>
                      handlePreferenceChange('display.compactMode', val)
                    }
                  />
                  <ToggleSetting
                    label="🤖 Show ML Predictions"
                    checked={preferences.display.showPredictions !== false}
                    onChange={(val) =>
                      handlePreferenceChange('display.showPredictions', val)
                    }
                  />
                  <ToggleSetting
                    label="📊 Show Analytics"
                    checked={preferences.display.showAnalytics !== false}
                    onChange={(val) =>
                      handlePreferenceChange('display.showAnalytics', val)
                    }
                  />
                </div>
              )}

              {/* Favorites Tab */}
              {currentTab === 'favorites' && (
                <div className="space-y-3">
                  <h3 className="font-bold">⭐ Favorite Routes</h3>
                  {preferences.favorites?.length > 0 ? (
                    <div className="space-y-2">
                      {preferences.favorites.map((route) => (
                        <motion.div
                          key={route.id}
                          whileHover={{ x: 4 }}
                          className={`p-2 rounded-lg flex justify-between items-center ${
                            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                          }`}
                        >
                          <span>
                            {route.name}{' '}
                            <span className="text-xs opacity-50">
                              Added {new Date(route.addedAt).toLocaleDateString()}
                            </span>
                          </span>
                          <button
                            onClick={() => {
                              preferencesManager.removeFavoriteRoute(route.id);
                              setPreferences(preferencesManager.getPreferences());
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm opacity-50">No favorites yet. Add some from the routes list!</p>
                  )}
                </div>
              )}

              {/* Accessibility Tab */}
              {currentTab === 'accessibility' && (
                <div className="space-y-3">
                  <h3 className="font-bold">♿ Accessibility Features</h3>
                  <ToggleSetting
                    label="♿ Wheelchair Accessible Only"
                    checked={preferences?.accessibility?.wheelchairAccessible || false}
                    onChange={(val) =>
                      handlePreferenceChange('accessibility.wheelchairAccessible', val)
                    }
                  />
                  <ToggleSetting
                    label="🎵 Audio Descriptions"
                    checked={preferences?.accessibility?.audioDescriptions || false}
                    onChange={(val) =>
                      handlePreferenceChange('accessibility.audioDescriptions', val)
                    }
                  />
                  <ToggleSetting
                    label="🔍 Large Text"
                    checked={preferences?.accessibility?.largeText || false}
                    onChange={(val) =>
                      handlePreferenceChange('accessibility.largeText', val)
                    }
                  />
                  <ToggleSetting
                    label="🌈 High Contrast"
                    checked={preferences?.accessibility?.highContrast || false}
                    onChange={(val) =>
                      handlePreferenceChange('accessibility.highContrast', val)
                    }
                  />
                </div>
              )}
            </motion.div>

            {/* Footer Actions */}
            <div
              className={`sticky bottom-0 flex gap-2 p-4 border-t ${
                isDarkMode ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'
              }`}
              style={{ backdropFilter: 'blur(4px)' }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearHistory}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                🗑️ Clear History
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ↻ Reset
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Check size={16} /> Save Changes
              </motion.button>
            </div>

            {/* Save Alert */}
            <AnimatePresence>
              {savedAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Check size={16} /> Saved!
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Helper component for text input settings
 */
function SettingRow({ label, value, onChange, description }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium block">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {description && <p className="text-xs opacity-50">{description}</p>}
    </div>
  );
}

/**
 * Helper component for toggle switches
 */
function ToggleSetting({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
      <label className="text-sm font-medium cursor-pointer">{label}</label>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <motion.div
          layout
          className={`absolute w-5 h-5 rounded-full bg-white top-0.5 ${
            checked ? 'right-0.5' : 'left-0.5'
          }`}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

export default PreferencesModal;
