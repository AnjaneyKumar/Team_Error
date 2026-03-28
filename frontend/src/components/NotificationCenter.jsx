import { motion } from 'framer-motion';
import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/store';

function NotificationCenter() {
  const { isDarkMode, notifications, removeNotification } = useStore();
  const timersRef = useRef(new Map());

  // Stable removeNotification wrapper
  const handleRemoveNotification = useCallback((id) => {
    // Clear the specific timer for this notification
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
    // Remove from store
    removeNotification(id);
  }, [removeNotification]);

  useEffect(() => {
    // For each notification, set up auto-dismiss if timer doesn't exist
    notifications.forEach((notif) => {
      // Only set timer if this notification doesn't already have one
      if (!timersRef.current.has(notif.id)) {
        const timer = setTimeout(() => {
          timersRef.current.delete(notif.id);
          removeNotification(notif.id);
        }, notif.duration || 5000);

        timersRef.current.set(notif.id, timer);
      }
    });

    // Cleanup: remove timers for notifications that no longer exist
    return () => {
      for (const [id] of timersRef.current) {
        if (!notifications.find(n => n.id === id)) {
          clearTimeout(timersRef.current.get(id));
          timersRef.current.delete(id);
        }
      }
    };
  }, [notifications, removeNotification]);

  const getNotificationStyles = (type) => {
    const styles = {
      success: {
        bg: isDarkMode ? 'bg-green-900 bg-opacity-40' : 'bg-green-50',
        border: 'border-l-4 border-green-500',
        icon: '✅',
        textColor: isDarkMode ? 'text-green-200' : 'text-green-900'
      },
      warning: {
        bg: isDarkMode ? 'bg-yellow-900 bg-opacity-40' : 'bg-yellow-50',
        border: 'border-l-4 border-yellow-500',
        icon: '⚠️',
        textColor: isDarkMode ? 'text-yellow-200' : 'text-yellow-900'
      },
      error: {
        bg: isDarkMode ? 'bg-red-900 bg-opacity-40' : 'bg-red-50',
        border: 'border-l-4 border-red-500',
        icon: '❌',
        textColor: isDarkMode ? 'text-red-200' : 'text-red-900'
      },
      info: {
        bg: isDarkMode ? 'bg-blue-900 bg-opacity-40' : 'bg-blue-50',
        border: 'border-l-4 border-blue-500',
        icon: 'ℹ️',
        textColor: isDarkMode ? 'text-blue-200' : 'text-blue-900'
      }
    };
    return styles[type] || styles.info;
  };

  if (notifications.length === 0) {
    return (
      <div className={`p-6 rounded-lg text-center ${isDarkMode ? 'bg-gray-800/70 backdrop-blur-md border border-white/10' : 'bg-white/10 backdrop-blur-md border border-white/10'}`}>
        <p className="text-lg font-semibold mb-2">🔔</p>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No notifications yet</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Alerts, delays, and bus arrivals will appear here</p>
      </div>
    );
  }

  const visibleNotifications = notifications.slice(0, 5);
  const hasMore = notifications.length > 5;

  return (
    <div className="w-80 space-y-3 max-h-[70vh] overflow-y-auto pr-2">
      <h3 className="font-bold text-sm sticky top-0 py-2 z-10 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700">🔔 Notifications ({notifications.length})</h3>
      {visibleNotifications.map((notif) => {
        const styles = getNotificationStyles(notif.type);
        
        return (
          <div
            key={notif.id}
            className={`p-4 rounded-xl ${styles.bg} ${styles.border} backdrop-blur-sm transition-all hover:shadow-md pointer-events-auto ${
              isDarkMode ? 'hover:bg-opacity-50' : 'hover:shadow-lg'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-xl mt-0.5">{styles.icon}</div>
              <div className="flex-1 min-w-0">
                {notif.title && (
                  <p className={`font-bold text-sm mb-1 ${styles.textColor}`}>
                    {notif.title}
                  </p>
                )}
                <p className={`text-sm ${styles.textColor} opacity-90`}>
                  {notif.message}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveNotification(notif.id);
                }}
                type="button"
                className={`flex-shrink-0 p-1 -mr-1 -mt-1 hover:bg-white hover:bg-opacity-10 rounded transition-all pointer-events-auto cursor-pointer ${styles.textColor}`}
                title="Close notification"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <div className={`mt-2 h-0.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-white bg-opacity-10' : 'bg-black bg-opacity-10'}`}>
              <div
                className={`h-full ${
                  notif.type === 'success' ? 'bg-green-500' :
                  notif.type === 'warning' ? 'bg-yellow-500' :
                  notif.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}
                style={{
                  animation: `shrink ${notif.duration || 5000}ms linear forwards`,
                  width: '100%'
                }}
              ></div>
            </div>
          </div>
        );
      })}
      
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg text-center text-sm opacity-60 italic text-gray-400"
        >
          +{notifications.length - 5} more notification{notifications.length - 5 !== 1 ? 's' : ''}
        </motion.div>
      )}
      
      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

export default NotificationCenter;
