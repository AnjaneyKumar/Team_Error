import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useStore } from '../context/store';
import { useEffect, useState } from 'react';

function NotificationPanel() {
  const { isDarkMode, notifications, notificationPanelOpen, removeNotification, clearAllNotifications, setNotificationPanelOpen } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close panel with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && notificationPanelOpen) {
        setNotificationPanelOpen(false);
      }
    };

    if (notificationPanelOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [notificationPanelOpen, setNotificationPanelOpen]);

  const getNotificationStyles = (type) => {
    const styles = {
      success: {
        bg: isDarkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-50',
        border: 'border-l-4 border-green-500',
        icon: '✅',
        textColor: isDarkMode ? 'text-green-200' : 'text-green-700',
      },
      warning: {
        bg: isDarkMode ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50',
        border: 'border-l-4 border-yellow-500',
        icon: '⚠️',
        textColor: isDarkMode ? 'text-yellow-200' : 'text-yellow-700',
      },
      error: {
        bg: isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50',
        border: 'border-l-4 border-red-500',
        icon: '❌',
        textColor: isDarkMode ? 'text-red-200' : 'text-red-700',
      },
      info: {
        bg: isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50',
        border: 'border-l-4 border-blue-500',
        icon: 'ℹ️',
        textColor: isDarkMode ? 'text-blue-200' : 'text-blue-700',
      },
    };
    return styles[type] || styles.info;
  };

  // Animate panel position based on mobile/desktop
  const panelVariants = {
    hidden: isMobile 
      ? { opacity: 0, y: 20 }
      : { opacity: 0, y: -10, scale: 0.95 },
    visible: isMobile
      ? { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
      : { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: isMobile
      ? { opacity: 0, y: 20 }
      : { opacity: 0, y: -10, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {notificationPanelOpen && (
        <>
          {/* Backdrop - Click to close */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setNotificationPanelOpen(false)}
            className="fixed inset-0 z-40"
          />

          {/* Panel - Responsive positioning */}
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${
              isMobile
                ? 'fixed bottom-4 left-4 right-4 max-w-sm'
                : 'absolute -right-2 top-14 w-96 sm:w-80 md:w-96'
            } z-50 rounded-2xl shadow-2xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            {/* Header */}
            <div
              className={`px-3 sm:px-4 py-3 border-b flex items-center justify-between flex-shrink-0 ${
                isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex-shrink-0 text-lg">🔔</span>
                <h3 className="font-bold text-xs sm:text-sm truncate">
                  Notifications
                  {notifications.length > 0 && (
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold inline-block ${
                        isDarkMode
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {notifications.length > 99 ? '99+' : notifications.length}
                    </span>
                  )}
                </h3>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {notifications.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAllNotifications}
                    className={`p-1.5 rounded transition-colors ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400'
                        : 'hover:bg-gray-200 text-gray-600 hover:text-red-600'
                    }`}
                    title="Clear all notifications"
                    aria-label="Clear all notifications"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotificationPanelOpen(false)}
                  className={`p-1.5 rounded transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-400'
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Close panel"
                  aria-label="Close notification panel"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div
              className={`${
                isMobile ? 'max-h-64 sm:max-h-72' : 'max-h-96'
              } overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {notifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 text-center text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  <p className="text-2xl mb-2">📭</p>
                  <p className="font-medium">No notifications yet</p>
                  <p className="text-xs mt-1 opacity-70">New alerts will appear here</p>
                </motion.div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.05 },
                    },
                  }}
                >
                  {notifications.map((notif) => {
                    const styles = getNotificationStyles(notif.type);
                    return (
                      <motion.div
                        key={notif.id}
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        className={`p-3 border-b transition-all hover:shadow-sm flex gap-3 cursor-default ${
                          styles.bg + ' ' + styles.border
                        } ${
                          isDarkMode
                            ? 'hover:bg-gray-700/50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 text-lg mt-0.5">{styles.icon}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {notif.title && (
                            <p className={`font-semibold text-sm ${styles.textColor}`}>
                              {notif.title}
                            </p>
                          )}
                          <p className={`text-xs sm:text-sm ${styles.textColor} opacity-80 mt-0.5 line-clamp-2`}>
                            {notif.message}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeNotification(notif.id)}
                          className={`flex-shrink-0 p-1 rounded transition-colors ${
                            isDarkMode
                              ? 'hover:bg-gray-600 text-gray-400 hover:text-red-400'
                              : 'hover:bg-gray-200 text-gray-400 hover:text-red-600'
                          }`}
                          title="Remove notification"
                          aria-label="Remove notification"
                        >
                          <X size={14} />
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationPanel;
