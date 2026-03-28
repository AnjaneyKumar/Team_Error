import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../context/store';

function NotificationBell() {
  const { isDarkMode, notifications, notificationPanelOpen, toggleNotificationPanel } = useStore();
  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <motion.button
        onClick={toggleNotificationPanel}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`btn-icon relative p-2 transition-colors ${
          notificationPanelOpen 
            ? isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            : ''
        }`}
        title={`Notifications (${unreadCount})`}
      >
        <Bell className="w-5 h-5" />

        {/* Badge Count */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
              unreadCount > 9 ? 'bg-red-600 text-xs px-1' : 'bg-red-500'
            }`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Pulse animation when notifications exist */}
      {unreadCount > 0 && !notificationPanelOpen && (
        <motion.span
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

export default NotificationBell;
