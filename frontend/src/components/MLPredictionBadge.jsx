import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useStore } from '../context/store';
import { etaPredictor } from '../utils/mlPredictor';

/**
 * 🤖 ML Prediction Badge
 * Displays ML-predicted ETA with confidence scoring
 */
function MLPredictionBadge({ bus, route, conditions = {} }) {
  const { isDarkMode } = useStore();

  // Get ML prediction
  const prediction = etaPredictor.predictETA(bus, null, conditions);

  if (!prediction) return null;

  const { eta, confidence, factors } = prediction;

  // Color based on confidence
  const getConfidenceColor = (conf) => {
    if (conf >= 90) return 'from-green-500 to-emerald-600';
    if (conf >= 75) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getConfidenceBg = (conf) => {
    if (conf >= 90) return isDarkMode ? 'bg-green-900/30' : 'bg-green-50';
    if (conf >= 75) return isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50';
    return isDarkMode ? 'bg-red-900/30' : 'bg-red-50';
  };

  const getConfidenceText = (conf) => {
    if (conf >= 90) return isDarkMode ? 'text-green-300' : 'text-green-700';
    if (conf >= 75) return isDarkMode ? 'text-amber-300' : 'text-amber-700';
    return isDarkMode ? 'text-red-300' : 'text-red-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-2 rounded-lg ${getConfidenceBg(confidence)}`}
    >
      {/* Header with ETA and Confidence */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1">
          <Zap size={14} className="text-blue-500" />
          <span className="text-xs font-semibold">ML ETA</span>
        </div>
        <motion.div
          className={`px-2 py-0.5 rounded-full text-xs font-bold ${getConfidenceText(confidence)}`}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {confidence}% sure
        </motion.div>
      </div>

      {/* ETA Value */}
      <div className={`text-sm font-bold mb-1 ${getConfidenceText(confidence)}`}>{eta} minutes</div>

      {/* Factors Breakdown (Collapsible) */}
      <FactorsBreakdown factors={factors} isDarkMode={isDarkMode} />
    </motion.div>
  );
}

/**
 * Factor breakdown with expandable details
 */
function FactorsBreakdown({ factors, isDarkMode }) {
  const factorsList = [
    { name: 'Distance', icon: '📍', key: 'distanceFactor' },
    { name: 'Time of Day', icon: '🕐', key: 'timeMultiplier' },
    { name: 'Occupancy', icon: '👥', key: 'occupancyMultiplier' },
    { name: 'Weather', icon: '🌦️', key: 'weatherMultiplier' },
    { name: 'Congestion', icon: '🚦', key: 'congestionMultiplier' },
  ];

  return (
    <div className="text-xs space-y-0.5">
      {factorsList.map((factor) => {
        const value = factors[factor.key];
        if (!value) return null;

        return (
          <motion.div
            key={factor.key}
            className="flex justify-between items-center opacity-75"
            whileHover={{ opacity: 1 }}
          >
            <span>
              {factor.icon} {factor.name}
            </span>
            <span className="font-semibold">
              {typeof value === 'number' ? value.toFixed(2) : value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export default MLPredictionBadge;
export { FactorsBreakdown };
