import { motion } from 'framer-motion';
import { useStore } from '../context/store';
import { predictCrowd, predictDelay, isBusArrivingSoon } from '../utils/predictions';
import MLPredictionBadge from './MLPredictionBadge';

function BusList({ buses }) {
  const { isDarkMode } = useStore();
  const crowdPrediction = predictCrowd();

  const statusIcons = {
    running: '🟢 Running',
    delayed: '🟡 Delayed',
    stopped: '⚫ Stopped',
    offline: '🔴 Offline',
  };

  const statusColors = {
    running: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    delayed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    stopped: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    offline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  if (!buses || buses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-gray-500"
      >
        <p>🚌 No buses active</p>
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
  };

  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {buses.map((bus) => {
        const arrivingSoon = isBusArrivingSoon(bus, 2);
        const delayPrediction = predictDelay(bus.route || {});

        return (
          <motion.div
            key={bus._id}
            variants={itemVariants}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className={`p-4 rounded-2xl border transition transform ${
              arrivingSoon ? 'ring-2 ring-green-500 shadow-lg shadow-green-500/20' : ''
            } ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 hover:shadow-lg'
                : 'bg-white border-gray-200 hover:shadow-lg'
            } shadow-md`}
          >
            {/* Header: Bus Number & Status */}
            <div className="flex justify-between items-start mb-3">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <p className="font-bold text-lg">
                  🚌 Bus {bus.busNumber}
                  {arrivingSoon && (
                    <motion.span
                      className="ml-2 text-sm"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      🔔 Arriving!
                    </motion.span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{bus.route?.name || 'Route'}</p>
              </motion.div>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${statusColors[bus.status] || statusColors.offline}`}
              >
                {statusIcons[bus.status] || '❓ Unknown'}
              </motion.span>
            </div>

            {/* Speed, Occupancy & Crowd Prediction Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-50'}`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">💨 Speed</p>
                <p className="font-semibold text-sm">{(bus.speed || 0).toFixed(1)} km/h</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-50'}`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">👥 Occupancy</p>
                <motion.p
                  className="font-semibold text-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1 }}
                >
                  {((bus.occupancy || 0) / bus.capacity * 100).toFixed(0)}%
                </motion.p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-50'}`}
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">🧍 Crowd</p>
                <p className="font-semibold text-sm">{crowdPrediction.emoji} {crowdPrediction.level}</p>
              </motion.div>
            </div>

            {/* Occupancy Bar */}
            <motion.div className="mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-600 dark:text-gray-300">Capacity</p>
                <p className="text-xs font-medium">{bus.occupancy || 0}/{bus.capacity}</p>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                <motion.div
                  className={`h-full transition-all ${
                    (bus.occupancy / bus.capacity) > 0.8
                      ? 'bg-red-500'
                      : (bus.occupancy / bus.capacity) > 0.5
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(bus.occupancy || 0) / bus.capacity * 100}%` }}
                  transition={{ duration: 1.2, type: 'spring' }}
                />
              </div>
            </motion.div>

            {/* Delay Prediction Alert */}
            {delayPrediction.minutes > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-2 rounded-lg mb-2 text-xs font-semibold ${
                  delayPrediction.severity === 'high'
                    ? isDarkMode
                      ? 'bg-red-900 bg-opacity-50 text-red-200'
                      : 'bg-red-100 text-red-800'
                    : delayPrediction.severity === 'medium'
                    ? isDarkMode
                      ? 'bg-yellow-900 bg-opacity-50 text-yellow-200'
                      : 'bg-yellow-100 text-yellow-800'
                    : isDarkMode
                    ? 'bg-green-900 bg-opacity-50 text-green-200'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {delayPrediction.emoji} Predicted Delay: +{delayPrediction.minutes} min
              </motion.div>
            )}

            {/* ML Prediction Badge */}
            {bus.nextStop?.stop && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-2"
              >
                <MLPredictionBadge bus={bus} route={bus.route} conditions={{ weather: 1, congestion: 1 }} />
              </motion.div>
            )}

            {/* Next Stop Info */}
            {bus.nextStop?.stop && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`p-2 rounded-lg text-xs ${isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50'}`}
              >
                <p className="text-gray-500 dark:text-gray-400">📍 Next Stop</p>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{bus.nextStop.stop.name || 'Next Stop'}</p>
                    {bus.nextStop.distance && (
                      <p className="text-xs opacity-75">{bus.nextStop.distance.toFixed(1)}km away</p>
                    )}
                  </div>
                  {bus.nextStop.eta && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring' }}
                      className={`px-2 py-1 rounded font-semibold whitespace-nowrap text-xs ${
                        bus.nextStop.eta <= 2
                          ? 'bg-green-200 text-green-800'
                          : 'bg-blue-200 text-blue-800'
                      }`}
                    >
                      ⏱️ {bus.nextStop.eta}m
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Live Status Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className={`mt-2 text-xs font-semibold px-2 py-1 rounded inline-block ${
                isDarkMode ? 'bg-green-900 bg-opacity-30 text-green-300' : 'bg-green-100 text-green-700'
              }`}
            >
              ✅ Live: Updated just now
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default BusList;
