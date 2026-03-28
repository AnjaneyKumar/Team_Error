import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../context/store';
import { useNearbyStops } from '../hooks/useData';

// Helper to calculate walking time
const getWalkingTime = (distanceInKm) => {
  const minutesPerKm = 12; // ~5 km/h
  return Math.round(distanceInKm * minutesPerKm);
};

// Helper to format distance nicely
const formatDistance = (distanceInKm) => {
  if (distanceInKm < 0.1) return `${Math.round(distanceInKm * 1000)}m`;
  return `${distanceInKm.toFixed(2)}km`;
};

function NearbyStops() {
  const { isDarkMode } = useStore();
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const { nearbyStops, loading, error, fetchNearbyStops } = useNearbyStops();

  useEffect(() => {
    setHasAttempted(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('📍 User location acquired:', { latitude, longitude });
          setUserLocation({ latitude, longitude });
          // Pass coordinates to fetchNearbyStops
          fetchNearbyStops(latitude, longitude);
        },
        (error) => {
          setLocationError(error.message);
          console.error('❌ Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, [fetchNearbyStops]);

  if (locationError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-2xl shadow-md ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}
      >
        <p className="text-sm font-semibold mb-1">📍 Location Access Denied</p>
        <p className="text-xs">{locationError}</p>
        <p className="text-xs mt-2 opacity-75">Allow location access in browser settings to see nearby stops.</p>
      </motion.div>
    );
  }

  if (loading && hasAttempted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <motion.div
          className="h-6 w-6 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">🔍 Finding nearby stops...</p>
      </motion.div>
    );
  }

  if (!nearbyStops || nearbyStops.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        <p className="text-lg mb-1">📍</p>
        <p className="font-semibold">No stops found nearby</p>
        <p className="text-xs mt-2">Try moving to a different location</p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-3 rounded-xl text-xs font-semibold ${isDarkMode ? 'bg-blue-900 bg-opacity-30 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
      >
        📍 Found {nearbyStops.length} stop{nearbyStops.length !== 1 ? 's' : ''} nearby
      </motion.div>

      {nearbyStops.map((stop, index) => (
        <motion.div
          key={stop._id}
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          className={`p-4 rounded-2xl transition transform shadow-md ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-lg'
          }`}
        >
          <div className="flex items-start gap-3 mb-2">
            <motion.div
              className="text-2xl flex-shrink-0"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: index * 0.1 + 0.2 }}
              whileHover={{ scale: 1.3, rotate: 10 }}
            >
              {index === 0 ? '⭐' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📍'}
            </motion.div>
            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.15 }}
            >
              <p className="font-bold text-sm leading-tight">{stop.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stop.code}</p>
            </motion.div>
          </div>

          {/* Distance & Walking Time */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className={`mb-2 p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-blue-50'}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.25 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">📍 Distance</p>
              <motion.p
                className="font-bold text-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1 }}
              >
                {formatDistance(stop.distance || 0)}
              </motion.p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">🚶 Walk Time</p>
              <p className="font-bold text-lg">{getWalkingTime(stop.distance || 0)}m</p>
            </motion.div>
          </motion.div>

          {/* Routes using this stop */}
          {stop.routes && stop.routes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.35 }}
              className="mb-2"
            >
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 font-semibold">🚌 Routes:</p>
              <div className="flex gap-1 flex-wrap">
                {stop.routes.slice(0, 3).map((route, routeIdx) => (
                  <motion.span
                    key={route._id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.35 + routeIdx * 0.05, type: 'spring' }}
                    className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{
                      backgroundColor: route.color || '#3B82F6',
                      color: 'white',
                      opacity: 0.9
                    }}
                  >
                    {route.routeNumber}
                  </motion.span>
                ))}
                {stop.routes.length > 3 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: 'spring' }}
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-800'}`}
                  >
                    +{stop.routes.length - 3} more
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}

          {/* Amenities & Accessibility */}
          {(stop.amenities?.length > 0 || Object.values(stop.accessibility || {}).some(v => v)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="flex gap-1 flex-wrap"
            >
              {stop.accessibility?.wheelchair_accessible && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: index * 0.1 + 0.4 }}
                  className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full"
                >
                  ♿
                </motion.span>
              )}
              {stop.amenities?.includes('shelter') && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: index * 0.1 + 0.45 }}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
                >
                  🏠 Shelter
                </motion.span>
              )}
              {stop.amenities?.includes('bench') && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: index * 0.1 + 0.5 }}
                  className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full"
                >
                  🪑 Bench
                </motion.span>
              )}
              {stop.amenities?.includes('lighting') && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: index * 0.1 + 0.55 }}
                  className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full"
                >
                  💡
                </motion.span>
              )}
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default NearbyStops;
