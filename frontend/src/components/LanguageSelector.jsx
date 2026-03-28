import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useStore } from '../context/store';

/**
 * 🌍 Language Selector
 * Toggle between multiple languages
 */
function LanguageSelector() {
  const { language, setLanguage, isDarkMode } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: '🇬🇧 English', flag: '🇬🇧' },
    { code: 'hi', name: '🇮🇳 हिंदी', flag: '🇮🇳' },
    { code: 'es', name: '🇪🇸 Español', flag: '🇪🇸' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${
          isDarkMode
            ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
            : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
        }`}
        title="Change language"
      >
        <Globe size={18} />
        <span className="text-xs font-semibold">{currentLang?.flag}</span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-30"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute top-full right-0 mt-2 rounded-lg shadow-lg z-40 overflow-hidden ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              {languages.map((lang, idx) => (
                <motion.button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                    language === lang.code
                      ? isDarkMode
                        ? 'bg-blue-600/30 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto">✓</span>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;
