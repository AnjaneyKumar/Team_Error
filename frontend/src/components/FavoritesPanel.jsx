import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '../context/store';

/**
 * ⭐ Favorites Panel
 * Quick access to favorite routes
 */
function FavoritesPanel() {
  const { favorites, removeFavorite, setSelectedRoute, routes, isDarkMode } = useStore();

  if (favorites.length === 0) {
    return (
      <div className={`p-3 rounded-lg text-center text-sm opacity-50 ${
        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
      }`}>
        <p>No favorites yet ⭐</p>
        <p className="text-xs mt-1">Click the star on routes to add them</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-xs font-bold uppercase tracking-wide opacity-75 pb-2">⭐ Favorites</h3>
      {favorites.map((fav, idx) => {
        const route = routes.find(r => r._id === fav.id);
        
        return (
          <motion.button
            key={fav.id}
            onClick={() => {
              if (route) setSelectedRoute(route);
            }}
            whileHover={{ scale: 1.02, x: 2 }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`w-full p-2 rounded-lg text-left text-xs transition-all group ${
              isDarkMode
                ? 'bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-700/30'
                : 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold">{fav.name}</p>
                {route && (
                  <p className="text-xs opacity-50">Route {route.routeNumber}</p>
                )}
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </motion.button>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default FavoritesPanel;
