import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Bus, MapPin } from 'lucide-react';
import { useStore } from '../context/store';
import { useSearchRoutes } from '../hooks/useData';
import { SkeletonSearchResult } from './SkeletonLoader';

function SearchBar() {
  const { isDarkMode, searchQuery, setSearchQuery, setSelectedRoute, setSelectedStop } = useStore();
  const { results, loading } = useSearchRoutes(searchQuery);
  const [showResults, setShowResults] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Handle debounced search
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (debounceTimer) clearTimeout(debounceTimer);

    if (value.length > 0) {
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 300);
      setDebounceTimer(timer);
    } else {
      setShowResults(false);
    }
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setSearchQuery('');
    setShowResults(false);
  };

  const handleSelectStop = (stop) => {
    setSelectedStop(stop);
    setSearchQuery('');
    setShowResults(false);
  };

  // Separate routes and stops from results
  const routes = results?.filter(r => r.stops !== undefined) || [];
  const stops = results?.filter(r => r.stops === undefined && r.amenities !== undefined) || [];

  return (
    <div className="flex-1 max-w-md mx-4 relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
          isDarkMode
            ? 'bg-gray-800/50 border-gray-700 focus-within:border-blue-500 focus-within:bg-gray-800'
            : 'bg-white/90 border-gray-300 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg'
        }`}
      >
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search routes & stops..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => {
            if (searchQuery.length > 0) setShowResults(true);
          }}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className={`flex-1 bg-transparent outline-none text-sm font-medium ${
            isDarkMode ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
          }`}
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                setSearchQuery('');
                setShowResults(false);
              }}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded transition"
            >
              <X className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && searchQuery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto border ${
              isDarkMode
                ? 'bg-gray-800/95 border-gray-700'
                : 'bg-white/95 border-gray-200'
            } backdrop-blur-sm`}
          >
            {loading ? (
              <SkeletonSearchResult />
            ) : (routes.length === 0 && stops.length === 0) ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">😕 No results for "{searchQuery}"</p>
              </div>
            ) : (
              <>
                {/* Routes Section */}
                {routes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className={`px-4 py-2 text-xs font-bold sticky top-0 ${
                      isDarkMode
                        ? 'bg-gray-900 text-blue-300'
                        : 'bg-gray-100 text-blue-700'
                    }`}>
                      <Bus className="w-4 h-4 inline mr-2" />
                      ROUTES ({routes.length})
                    </div>
                    <div className="space-y-1 p-2">
                      {routes.map((route, idx) => (
                        <motion.button
                          key={route._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleSelectRoute(route)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-3 hover:shadow-md ${
                            isDarkMode
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-blue-50'
                          }`}
                        >
                          <span
                            className="text-white font-bold px-2 py-1 rounded text-sm flex-shrink-0"
                            style={{ backgroundColor: route.color || '#3B82F6' }}
                          >
                            {route.routeNumber}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm line-clamp-1">{route.name}</p>
                            <p className="text-xs opacity-75">{route.stops?.length || 0} stops</p>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Stops Section */}
                {stops.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className={`px-4 py-2 text-xs font-bold sticky top-0 ${
                      isDarkMode
                        ? 'bg-gray-900 text-green-300'
                        : 'bg-gray-100 text-green-700'
                    }`}>
                      <MapPin className="w-4 h-4 inline mr-2" />
                      STOPS ({stops.length})
                    </div>
                    <div className="space-y-1 p-2">
                      {stops.map((stop, idx) => (
                        <motion.button
                          key={stop._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleSelectStop(stop)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-3 hover:shadow-md ${
                            isDarkMode
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-green-50'
                          }`}
                        >
                          <span className="text-lg">📍</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm line-clamp-1">{stop.name}</p>
                            <p className="text-xs opacity-75">{stop.code}</p>
                          </div>
                          {stop.routes && stop.routes.length > 0 && (
                            <div className="flex gap-1 flex-shrink-0">
                              {stop.routes.slice(0, 2).map((route) => (
                                <span
                                  key={route._id}
                                  className="text-xs font-bold text-white px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: route.color || '#999' }}
                                >
                                  {route.routeNumber}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBar;
