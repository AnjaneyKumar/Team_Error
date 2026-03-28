import { motion } from 'framer-motion';
import { useStore } from '../context/store';

// Helper function to calculate walking time
const calculateWalkingTime = (distanceInKm) => {
  const minsPerKm = 12; // Average walking speed ~5 km/h = 12 min/km
  return Math.round(distanceInKm * minsPerKm);
};

// Helper function to format distance
const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`;
  }
  return `${distanceInKm.toFixed(1)}km`;
};

function StopsList({ stops }) {
  const { isDarkMode } = useStore();

  if (!stops || stops.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-500"
      >
        <p>📭 No stops available</p>
      </motion.div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, x: -20 },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stops.map((stop, index) => (
        <motion.div
          key={stop._id}
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          className={`p-4 rounded-2xl cursor-pointer transition transform ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 shadow-md hover:shadow-lg'
              : 'bg-white hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
          }`}
        >
          <div className="flex items-start gap-3 mb-2">
            <motion.div
              className="text-2xl flex-shrink-0"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
              whileHover={{ scale: 1.2 }}
            >
              {index + 1}️⃣
            </motion.div>
            <motion.div className="flex-1 min-w-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <p className="font-bold text-sm leading-tight">{stop.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stop.code}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 truncate">{stop.address}</p>
            </motion.div>
          </div>

          {/* Distance & Walking Time */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-blue-50'}`}
          >
            <div className="flex items-center gap-4 text-xs">
              {stop.distance && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <p className="text-gray-500 dark:text-gray-400">📍 Distance</p>
                  <motion.p
                    className="font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1 }}
                  >
                    {formatDistance(stop.distance)}
                  </motion.p>
                </motion.div>
              )}
              {stop.distance && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-gray-500 dark:text-gray-400">🚶 Walking</p>
                  <p className="font-semibold">{calculateWalkingTime(stop.distance)} min</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Amenities & Accessibility */}
          <motion.div className="mt-3 flex gap-1 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            {stop.accessibility?.wheelchair_accessible && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.35 }}
                className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full font-medium"
              >
                ♿ Accessible
              </motion.span>
            )}
            {stop.accessibility?.visual_aid && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.4 }}
                className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full font-medium"
              >
                👁️ Visual Aid
              </motion.span>
            )}
            {stop.accessibility?.elevator && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.45 }}
                className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full font-medium"
              >
                🛗 Elevator
              </motion.span>
            )}
            {stop.amenities && stop.amenities.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.5 }}
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-medium"
              >
                🏪 {stop.amenities.length} amenities
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default StopsList;
