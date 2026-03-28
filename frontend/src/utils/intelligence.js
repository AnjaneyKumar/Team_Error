/**
 * 🧠 INTELLIGENCE LAYER - Smart Data Insights
 * Transforms raw data into user-facing intelligence
 */

/**
 * 🔥 Route Popularity
 * Shows how crowded/popular a route is based on occupancy
 * Helps users make better commuting decisions
 */
export const getRoutePopularity = (route, buses) => {
  const routeBuses = buses.filter(b => b.route?._id === route._id);
  
  if (!routeBuses.length) return { level: 'Low', emoji: '💙', color: 'text-green-600', bg: 'bg-green-100' };

  const avgOccupancy =
    routeBuses.reduce((sum, b) => sum + (b.occupancy || 0), 0) / routeBuses.length / (routeBuses[0]?.capacity || 1) * 100;

  if (avgOccupancy > 70) {
    return { level: 'High', emoji: '🔥', color: 'text-red-600', bg: 'bg-red-100' };
  }
  if (avgOccupancy > 40) {
    return { level: 'Medium', emoji: '🟡', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  }
  return { level: 'Low', emoji: '💙', color: 'text-green-600', bg: 'bg-green-100' };
};

/**
 * ⏱️ Bus Frequency
 * Shows how often buses arrive on this route
 * Helps users decide if they should wait or walk
 */
export const getBusFrequency = (route, buses) => {
  const routeBuses = buses.filter(b => b.route?._id === route._id);
  const count = routeBuses.length;

  if (count >= 5) {
    return { time: 'Every 5 min', count, emoji: '⚡', level: 'High' };
  }
  if (count >= 3) {
    return { time: 'Every 10 min', count, emoji: '⏱', level: 'Medium' };
  }
  if (count >= 1) {
    return { time: 'Every 15 min', count, emoji: '⌛', level: 'Low' };
  }
  return { time: 'Rare', count: 0, emoji: '❌', level: 'None' };
};

/**
 * ⚡ Peak Hour Status
 * Detects if current time is during rush hour
 * Used for better predictions and recommendations
 * 
 * NYC typical rush hours:
 * Morning: 7-10 AM
 * Evening: 5-8 PM (17-20 military)
 */
export const getPeakStatus = () => {
  const hour = new Date().getHours();

  // Morning rush: 7-10 AM
  if (hour >= 7 && hour <= 10) {
    return {
      isPeak: true,
      period: 'Morning Rush',
      emoji: '🌅',
      color: 'text-orange-600',
      bg: 'bg-orange-100',
      multiplier: 1.5
    };
  }

  // Evening rush: 5-8 PM
  if (hour >= 17 && hour <= 20) {
    return {
      isPeak: true,
      period: 'Evening Rush',
      emoji: '🌆',
      color: 'text-red-600',
      bg: 'bg-red-100',
      multiplier: 1.5
    };
  }

  // Off-peak
  return {
    isPeak: false,
    period: 'Off-Peak',
    emoji: '🌙',
    color: 'text-green-600',
    bg: 'bg-green-100',
    multiplier: 1.0
  };
};

/**
 * 🧠 Smart Route Insights
 * Combines all intelligence into one comprehensive view
 */
export const getRouteInsights = (route, buses) => {
  const popularity = getRoutePopularity(route, buses);
  const frequency = getBusFrequency(route, buses);
  const peak = getPeakStatus();

  return {
    popularity,
    frequency,
    peak,
    /**
     * Generate a smart insight message
     * Example: "High demand route, every 5 mins, Peak hours coming"
     */
    summary: `${popularity.emoji} ${popularity.level} demand, ${frequency.emoji} ${frequency.time}${peak.isPeak ? `, ${peak.emoji} ${peak.period}` : ''}`,
    /**
     * Urgency score (0-100) - how important this info is
     */
    urgency: popularity.level === 'High' ? 80 : popularity.level === 'Medium' ? 50 : 20,
    /**
     * Recommendation flag
     */
    shouldRecommend: popularity.level === 'High' && frequency.level !== 'None'
  };
};

/**
 * 📊 Time-based Intelligence
 * Get insights based on time patterns
 */
export const getTimeInsight = () => {
  const hour = new Date().getHours();
  const isPeak = getPeakStatus().isPeak;

  let insight = '';
  let emoji = '';

  if (hour >= 6 && hour < 9) {
    insight = 'Morning commuters are active';
    emoji = '🌅';
  } else if (hour >= 12 && hour < 14) {
    insight = 'Lunch break rush';
    emoji = '🍽️';
  } else if (hour >= 17 && hour < 20) {
    insight = 'Evening rush hour';
    emoji = '🌆';
  } else if (hour >= 20 && hour < 23) {
    insight = 'Late evening, fewer buses';
    emoji = '🌙';
  } else {
    insight = 'Quiet hours, low traffic';
    emoji = '😴';
  }

  return { emoji, insight, isPeak };
};

/**
 * 🎯 Get Route Recommendation Reason
 * Explains WHY a route was recommended
 */
export const getRecommendationReason = (route, buses, recommendationType) => {
  const insights = getRouteInsights(route, buses);
  
  const reasons = {
    best: `✨ Best overall - ${insights.summary}`,
    fastest: `⚡ Fastest route - Only ${route.estimatedDuration}m travel time`,
    leastCrowded: `😌 Least crowded - ${insights.popularity.emoji} ${insights.popularity.level} demand`,
    good: `👍 Good option - Reliable and frequent`
  };

  return reasons[recommendationType] || reasons.good;
};
