import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useStore } from '../context/store';
import { getRouteRecommendations, getAverageOccupancy } from '../utils/predictions';
import { getRoutePopularity, getBusFrequency, getPeakStatus } from '../utils/intelligence';

function RouteList({ routes, onSelect }) {
  const { isDarkMode, selectedRoute, setSelectedRoute, buses, favorites, addFavorite, removeFavorite } = useStore();
  const recommendations = getRouteRecommendations(routes, buses);

  const handleSelect = (route) => {
    setSelectedRoute(route);
    if (onSelect) onSelect();
  };

  const getRecommendationBadges = (route) => {
    const badges = [];
    if (recommendations.best?._id === route._id) {
      badges.push({ text: 'Best Route', bg: 'badge-success', emoji: '⭐' });
    }
    if (recommendations.fastest?._id === route._id) {
      badges.push({ text: 'Fastest', bg: 'badge-primary', emoji: '⚡' });
    }
    if (recommendations.leastCrowded?._id === route._id) {
      badges.push({ text: 'Least Crowded', bg: 'badge-warning', emoji: '🧍' });
    }
    return badges;
  };

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

  if (!routes || routes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">📭 No routes available</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {routes.map((route) => {
        const badges = getRecommendationBadges(route);
        const avgOccupancy = getAverageOccupancy(route, buses);
        const occupancyPercent = Math.round(avgOccupancy * 100);
        const isSelected = selectedRoute?._id === route._id;
        const isFav = favorites.some(f => f.id === route._id);
        
        // 🧠 Intelligence insights
        const popularity = getRoutePopularity(route, buses);
        const frequency = getBusFrequency(route, buses);
        const peak = getPeakStatus();

        return (
          <motion.button
            key={route._id}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(route)}
            className={`w-full p-4 rounded-2xl text-left transition-all duration-300 transform ${
              isFav
                ? isDarkMode
                  ? 'bg-yellow-900/20 border-2 border-yellow-500/50'
                  : 'bg-yellow-50 border-2 border-yellow-300'
                : ''
            } ${
              isSelected
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-2xl'
                : isDarkMode
                ? 'bg-gray-800/70 backdrop-blur-md hover:bg-gray-700/80 text-gray-100 shadow-md border border-white/10'
                : 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-gray-900 shadow-md hover:shadow-xl border border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-2 gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <motion.div
                  className="w-6 h-6 rounded-full shadow-lg flex-shrink-0"
                  style={{ backgroundColor: route.color }}
                  title={route.name}
                  whileHover={{ scale: 1.2 }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-lg leading-tight">{route.routeNumber}</p>
                  <p className="text-xs opacity-75 truncate">{route.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* ⭐ Favorite Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isFav) {
                      removeFavorite(route._id);
                    } else {
                      addFavorite(route._id, route.name);
                    }
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 transition-colors"
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    size={20}
                    className={isFav ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}
                  />
                </motion.button>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    isSelected
                      ? 'bg-white bg-opacity-30'
                      : isDarkMode
                      ? 'bg-blue-500 bg-opacity-30 text-blue-200'
                      : 'badge-primary'
                  }`}
                >
                  {route.stops?.length || 0} stops
                </motion.span>
              </div>
            </div>

            {/* Smart Recommendation Badges */}
            {badges.length > 0 && (
              <motion.div
                className="flex gap-2 mb-3 flex-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {badges.map((badge, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold ${badge.bg}`}
                  >
                    {badge.emoji} {badge.text}
                  </motion.span>
                ))}
              </motion.div>
            )}

            <div className="grid grid-cols-3 gap-2 text-xs mt-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col"
              >
                <p className="opacity-60 text-xs mb-0.5">📏 Distance</p>
                <p className="font-semibold">{route.distance}km</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex flex-col"
              >
                <p className="opacity-60 text-xs mb-0.5">⏱️ Duration</p>
                <p className="font-semibold">{route.estimatedDuration}m</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col"
              >
                <p className="opacity-60 text-xs mb-0.5">🧍 Crowd</p>
                <p className="font-semibold">{occupancyPercent}%</p>
              </motion.div>
            </div>

            <motion.div
              className={`pt-3 border-t ${isSelected ? 'border-white border-opacity-30' : 'border-gray-200 dark:border-gray-700'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <p className="text-xs opacity-75 mb-2">
                🕐 {route.operatingHours?.startTime} - {route.operatingHours?.endTime}
              </p>
            </motion.div>

            {/* 🧠 Intelligence Insights - Popularity, Frequency, Peak Hours */}
            <motion.div
              className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-opacity-20 border-gray-300 dark:border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* 🔥 Popularity Badge */}
              <motion.span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${popularity.bg} ${popularity.color}`}
                whileHover={{ scale: 1.05 }}
                title="Route popularity based on occupancy"
              >
                {popularity.emoji} {popularity.level}
              </motion.span>

              {/* ⏱️ Frequency Badge */}
              <motion.span
                className="text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                whileHover={{ scale: 1.05 }}
                title="How often buses arrive"
              >
                {frequency.emoji} {frequency.time}
              </motion.span>

              {/* ⚡ Peak Hours Badge */}
              <motion.span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1 ${peak.bg} ${peak.color}`}
                whileHover={{ scale: 1.05 }}
                title="Current time period"
              >
                {peak.emoji} {peak.period}
              </motion.span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default RouteList;
