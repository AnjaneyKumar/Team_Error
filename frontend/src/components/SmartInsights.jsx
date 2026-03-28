import { motion } from 'framer-motion';
import { useStore } from '../context/store';
import { getRouteInsights, getTimeInsight, getRecommendationReason } from '../utils/intelligence';

/**
 * 🧠 SmartInsights Panel
 * Shows comprehensive intelligence about the selected route
 */
function SmartInsights() {
  const { isDarkMode, selectedRoute } = useStore();
  const { buses } = useStore();

  if (!selectedRoute) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-2xl text-center text-sm ${
          isDarkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-blue-50 text-blue-600'
        }`}
      >
        <p>👈 Select a route to see smart insights</p>
      </motion.div>
    );
  }

  const insights = getRouteInsights(selectedRoute, buses);
  const timeInsight = getTimeInsight();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`p-4 rounded-2xl space-y-3 ${
        isDarkMode 
          ? 'bg-gray-800/70 backdrop-blur-md border border-white/10 shadow-lg' 
          : 'bg-white/10 backdrop-blur-md border border-white/10 shadow-lg'
      }`}
    >
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide opacity-75 mb-1">📊 Smart Intelligence</p>
        <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          {insights.summary}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Demand */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-2 rounded-lg text-center ${
            isDarkMode
              ? 'bg-gray-700/50 text-gray-100'
              : insights.popularity.level === 'High'
              ? 'bg-red-100 text-red-700'
              : insights.popularity.level === 'Medium'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          <p className="text-2xl">{insights.popularity.emoji}</p>
          <p className="text-xs font-bold">{insights.popularity.level}</p>
          <p className="text-xs opacity-75">Demand</p>
        </motion.div>

        {/* Frequency */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-2 rounded-lg text-center ${
            isDarkMode ? 'bg-gray-700/50 text-gray-100' : 'bg-blue-100 text-blue-700'
          }`}
        >
          <p className="text-2xl">{insights.frequency.emoji}</p>
          <p className="text-xs font-bold">{insights.frequency.level}</p>
          <p className="text-xs opacity-75">{insights.frequency.time}</p>
        </motion.div>

        {/* Time */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-2 rounded-lg text-center ${
            isDarkMode
              ? 'bg-gray-700/50 text-gray-100'
              : insights.peak.isPeak
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          <p className="text-2xl">{insights.peak.emoji}</p>
          <p className="text-xs font-bold">{insights.peak.period}</p>
          <p className="text-xs opacity-75">Time</p>
        </motion.div>
      </div>

      {/* Time Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-2 rounded-lg text-xs ${
          isDarkMode ? 'bg-gray-700/50 text-gray-200' : 'bg-white/60 text-gray-700'
        }`}
      >
        <p>
          <span className="text-lg">{timeInsight.emoji}</span> {timeInsight.insight}
        </p>
      </motion.div>

      {/* Urgency Indicator */}
      {insights.urgency > 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold flex items-center gap-2"
        >
          <span className="text-lg animate-pulse">⚠️</span>
          <span>High demand - Consider this route!</span>
        </motion.div>
      )}
    </motion.div>
  );
}

export default SmartInsights;
