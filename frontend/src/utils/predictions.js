/**
 * Smart Prediction Engine
 * Predicts crowd levels, delays, and calculates route scores
 */

// Predict crowd level based on current hour
export const predictCrowd = () => {
  const hour = new Date().getHours();
  
  // Morning rush: 7-10 AM
  if (hour >= 7 && hour <= 10) return { level: 'High', emoji: '🔴', confidence: 'Very High' };
  
  // Evening rush: 5-8 PM
  if (hour >= 17 && hour <= 20) return { level: 'High', emoji: '🔴', confidence: 'Very High' };
  
  // Mid-day or early morning
  if (hour >= 11 && hour <= 16) return { level: 'Low', emoji: '🟢', confidence: 'High' };
  
  // Night time
  if (hour >= 21 || hour <= 6) return { level: 'Very Low', emoji: '🟢', confidence: 'High' };
  
  return { level: 'Medium', emoji: '🟡', confidence: 'Medium' };
};

// Predict delay based on traffic level and time
export const predictDelay = (route) => {
  const hour = new Date().getHours();
  const baseDelay = route.delayMinutes || 0;
  
  // Rush hour multiplier
  let rushMultiplier = 1;
  if ((hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20)) {
    rushMultiplier = 1.5;
  }
  
  const predictedDelay = Math.round(baseDelay * rushMultiplier);
  return {
    minutes: predictedDelay,
    severity: predictedDelay > 10 ? 'high' : predictedDelay > 5 ? 'medium' : 'low',
    emoji: predictedDelay > 10 ? '⚠️' : predictedDelay > 5 ? '⏱️' : '✅'
  };
};

// Calculate route score for smart recommendations
// Factors: travel time, occupancy (crowd), distance
export const calculateRouteScore = (route, buses = []) => {
  // Get average occupancy for this route
  const routeBuses = buses?.filter(b => b.route?._id === route._id) || [];
  const avgOccupancy = routeBuses.length > 0
    ? routeBuses.reduce((sum, bus) => sum + (bus.occupancy / bus.capacity), 0) / routeBuses.length
    : 0.5;

  // Create composite score (lower is better)
  // 50% = time, 30% = occupancy, 20% = distance
  const timeScore = (route.estimatedTime || 30) / 60; // Normalize to 0-1
  const crowdScore = avgOccupancy; // Already 0-1
  const distanceScore = Math.min((route.distance || 5) / 10, 1); // Normalize to 0-1

  const score =
    timeScore * 0.5 +
    crowdScore * 0.3 +
    distanceScore * 0.2;

  return score;
};

// Get route recommendations
export const getRouteRecommendations = (routes = [], buses = []) => {
  if (!routes || routes.length === 0) return {};

  // Calculate scores for all routes
  const routesWithScores = routes.map(route => ({
    ...route,
    score: calculateRouteScore(route, buses),
    avgOccupancy: getAverageOccupancy(route, buses),
    estimatedTime: route.estimatedTime || 30
  }));

  // Sort by score
  const sorted = [...routesWithScores].sort((a, b) => a.score - b.score);

  return {
    best: sorted[0],
    fastest: [...routesWithScores].sort((a, b) => a.estimatedTime - b.estimatedTime)[0],
    leastCrowded: [...routesWithScores].sort((a, b) => a.avgOccupancy - b.avgOccupancy)[0]
  };
};

// Helper: Get average occupancy for a route
export const getAverageOccupancy = (route, buses = []) => {
  const routeBuses = buses?.filter(b => b.route?._id === route._id) || [];
  if (routeBuses.length === 0) return 0.5; // Default 50%
  
  const total = routeBuses.reduce((sum, bus) => sum + (bus.occupancy / bus.capacity), 0);
  return total / routeBuses.length;
};

// Get occupancy badge color
export const getOccupancyColor = (occupancy, capacity) => {
  const percent = (occupancy / capacity) * 100;
  if (percent > 80) return { bg: 'bg-red-100', text: 'text-red-700', emoji: '🔴 Crowded' };
  if (percent > 50) return { bg: 'bg-yellow-100', text: 'text-yellow-700', emoji: '🟡 Moderate' };
  return { bg: 'bg-green-100', text: 'text-green-700', emoji: '🟢 Comfortable' };
};

// Check if bus is arriving soon
export const isBusArrivingSoon = (bus, threshold = 2) => {
  if (!bus.nextStop || !bus.nextStop.eta) return false;
  
  const eta = parseInt(bus.nextStop.eta);
  return eta <= threshold && eta > 0;
};

// Get time-based greeting
export const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return '🌅 Good Morning';
  if (hour < 18) return '🌤️ Good Afternoon';
  return '🌙 Good Evening';
};
