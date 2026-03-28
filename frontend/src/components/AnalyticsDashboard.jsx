import { motion } from 'framer-motion';
import { useStore } from '../context/store';
import { historicalAnalytics } from '../utils/analytics';

/**
 * 📊 analytics Dashboard
 * Comprehensive view of historical trends and metrics
 */
function AnalyticsDashboard() {
  const { isDarkMode } = useStore();
  const { buses, routes } = useStore();

  // Get analytics data
  const peakHours = historicalAnalytics.analyzePeakHours();
  const insights = historicalAnalytics.getInsights();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
          📊 Analytics Dashboard
        </h2>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Historical trends and patterns
        </p>
      </motion.div>

      {/* Key Insights Cards */}
      <motion.div className="grid grid-cols-2 gap-2" variants={itemVariants}>
        {/* Busiest Hour */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-3 rounded-lg ${
            isDarkMode
              ? 'bg-red-900/30 border border-red-700/30'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className="text-xs opacity-75">🔥 Busiest Hour</p>
          <p className={`text-sm font-bold ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
            {insights.busiestHour}
          </p>
        </motion.div>

        {/* Quietest Hour */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-3 rounded-lg ${
            isDarkMode
              ? 'bg-green-900/30 border border-green-700/30'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          <p className="text-xs opacity-75">🌙 Quietest Hour</p>
          <p className={`text-sm font-bold ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
            {insights.quietestHour}
          </p>
        </motion.div>
      </motion.div>

      {/* Hourly Occupancy Chart (Simple Bar Chart) */}
      {peakHours.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-xs font-bold uppercase tracking-wide opacity-75 mb-2">
            📈 Occupancy by Hour
          </h3>
          <div className="space-y-1">
            {peakHours.map((hour, idx) => (
              <motion.div
                key={hour.hour}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-2"
              >
                <span className="text-xs font-semibold w-8">{hour.hour}:00</span>
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${hour.avgOccupancy}%` }}
                    transition={{ delay: idx * 0.05 + 0.5, duration: 1 }}
                  />
                </div>
                <span className="text-xs font-semibold w-12 text-right">
                  {hour.avgOccupancy}%
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-3 gap-2" variants={itemVariants}>
        {/* Total Data Points */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-3 rounded-lg text-center ${
            isDarkMode
              ? 'bg-blue-900/30 border border-blue-700/30'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <p className="text-lg font-bold">
            {peakHours.reduce((sum, h) => sum + h.dataPoints, 0)}
          </p>
          <p className="text-xs opacity-75">Snapshots</p>
        </motion.div>

        {/* Hours Tracked */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-3 rounded-lg text-center ${
            isDarkMode
              ? 'bg-purple-900/30 border border-purple-700/30'
              : 'bg-purple-50 border border-purple-200'
          }`}
        >
          <p className="text-lg font-bold">{peakHours.length}</p>
          <p className="text-xs opacity-75">Hours</p>
        </motion.div>

        {/* Routes Tracked */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`p-3 rounded-lg text-center ${
            isDarkMode
              ? 'bg-green-900/30 border border-green-700/30'
              : 'bg-green-50 border border-green-200'
          }`}
        >
          <p className="text-lg font-bold">{routes?.length || 0}</p>
          <p className="text-xs opacity-75">Routes</p>
        </motion.div>
      </motion.div>

      {/* Data Collection Info */}
      <motion.div
        variants={itemVariants}
        className={`p-3 rounded-lg text-xs ${
          isDarkMode
            ? 'bg-gray-800/50 text-gray-400'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <p>
          📊 Data is automatically collected every 5 minutes for trend analysis. Use this info to
          plan your trips!
        </p>
      </motion.div>
    </motion.div>
  );
}

export default AnalyticsDashboard;
