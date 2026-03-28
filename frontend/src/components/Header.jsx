import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Moon, Sun, Settings } from 'lucide-react';
import { useStore } from '../context/store';
import { getPeakStatus } from '../utils/intelligence';
import SearchBar from './SearchBar';
import PreferencesModal from './PreferencesModal';
import LanguageSelector from './LanguageSelector';
import NotificationBell from './NotificationBell';
import NotificationPanel from './NotificationPanel';

function Header({ onMenuClick }) {
  const { isDarkMode, setDarkMode } = useStore();
  const peak = getPeakStatus();
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <>
      <header
        className={`${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b shadow-sm transition-colors duration-200 sticky top-0 z-30`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
            {/* Mobile Menu Button - Hidden on desktop */}
            <motion.button
              onClick={onMenuClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`md:hidden flex-shrink-0 p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Toggle sidebar"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>

            {/* Logo - Responsive Size */}
            <h1 className="hidden sm:block text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent truncate">
              🚌 Transit
            </h1>

            {/* Peak Status - Hidden on small screens */}
            <motion.div
              className={`hidden md:flex items-center gap-2 ml-2 md:ml-4 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0 ${peak.bg} ${peak.color}`}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              title={`Current status: ${peak.period}`}
            >
              {peak.emoji} <span className="hidden sm:inline">{peak.period}</span>
            </motion.div>
          </div>

          {/* Center: Search - Hidden on smallest screens */}
          <div className="hidden sm:block flex-1 min-w-0 max-w-xs md:max-w-md">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <LanguageSelector />

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode(!isDarkMode)}
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-yellow-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Toggle dark mode"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </motion.button>

            {/* Notification Bell */}
            <NotificationBell />

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: -10 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Settings"
              aria-label="Settings"
              onClick={() => setShowPreferences(true)}
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </div>

          {/* Notification Panel Dropdown */}
          <NotificationPanel />
        </div>

        {/* Mobile Search - Show on small screens */}
        <div className="block sm:hidden px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
      </header>

      {/* Preferences Modal */}
      <PreferencesModal isOpen={showPreferences} onClose={() => setShowPreferences(false)} />
    </>
  );
}

export default Header;
