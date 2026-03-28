/**
 * 📊 Analytics & Historical Trend Analysis
 * Tracks metrics over time, generates insights, displays trends
 */

/**
 * Historical Data Manager
 * Stores and analyzes historical bus/route data
 */
class HistoricalAnalytics {
  constructor() {
    this.storageKey = 'transit_historical_data';
    this.maxDataPoints = 5000; // Keep recent data only
  }

  /**
   * Record a snapshot of route/bus state
   */
  recordSnapshot(buses, routes) {
    try {
      const snapshot = {
        timestamp: new Date().toISOString(),
        hour: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        buses: buses.map(b => ({
          id: b._id,
          routeId: b.route?._id,
          occupancy: b.occupancy,
          capacity: b.capacity,
          speed: b.speed,
          delay: b.delayMinutes
        })),
        routes: routes.map(r => ({
          id: r._id,
          name: r.name,
          distance: r.distance,
          estimatedDuration: r.estimatedDuration
        }))
      };

      let data = this._getHistoricalData();
      data.push(snapshot);

      // Keep only recent data
      if (data.length > this.maxDataPoints) {
        data = data.slice(-this.maxDataPoints);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error recording snapshot:', error);
      return false;
    }
  }

  /**
   * Get all historical data
   */
  _getHistoricalData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading historical data:', error);
      return [];
    }
  }

  /**
   * 📈 Analyze route popularity over time
   */
  analyzeRoutePopularity(routeId, hours = 24) {
    const data = this._getHistoricalData();
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const filtered = data.filter(s => s.timestamp > cutoffTime && s.buses.some(b => b.routeId === routeId));

    const timeline = filtered.map(s => {
      const routeBuses = s.buses.filter(b => b.routeId === routeId);
      const avgOccupancy = routeBuses.length > 0
        ? routeBuses.reduce((sum, b) => sum + (b.occupancy / b.capacity), 0) / routeBuses.length
        : 0;

      return {
        time: new Date(s.timestamp),
        occupancy: Math.round(avgOccupancy * 100),
        busCount: routeBuses.length,
        avgSpeed: routeBuses.length > 0
          ? Math.round(routeBuses.reduce((sum, b) => sum + b.speed, 0) / routeBuses.length)
          : 0
      };
    });

    const stats = {
      peakOccupancy: Math.max(...timeline.map(t => t.occupancy), 0),
      peakTime: timeline.find(t => t.occupancy === Math.max(...timeline.map(t => t.occupancy))),
      averageOccupancy: Math.round(timeline.reduce((sum, t) => sum + t.occupancy, 0) / timeline.length || 0),
      trend: timeline.length > 1 ? timeline[timeline.length - 1].occupancy - timeline[0].occupancy : 0
    };

    return { timeline, stats };
  }

  /**
   * 📊 Peak hour analysis
   */
  analyzePeakHours() {
    const data = this._getHistoricalData();
    const hourlyStats = {};

    // Group by hour
    data.forEach(snapshot => {
      const hour = snapshot.hour;
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = {
          occupancies: [],
          speeds: [],
          count: 0
        };
      }

      snapshot.buses.forEach(bus => {
        hourlyStats[hour].occupancies.push((bus.occupancy / bus.capacity) * 100);
        hourlyStats[hour].speeds.push(bus.speed);
      });
      hourlyStats[hour].count++;
    });

    // Calculate averages
    const hourAnalysis = Object.entries(hourlyStats).map(([hour, stats]) => ({
      hour: parseInt(hour),
      avgOccupancy: Math.round(stats.occupancies.reduce((a, b) => a + b, 0) / stats.occupancies.length),
      avgSpeed: Math.round(stats.speeds.reduce((a, b) => a + b, 0) / stats.speeds.length),
      dataPoints: stats.count
    })).sort((a, b) => a.hour - b.hour);

    return hourAnalysis;
  }

  /**
   * 🔍 Get route comparison data
   */
  compareRoutes(routeIds, hours = 24) {
    const data = this._getHistoricalData();
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

    const filtered = data.filter(s => s.timestamp > cutoffTime);

    const comparison = routeIds.map(routeId => {
      const routeData = filtered
        .map(s => {
          const routeBuses = s.buses.filter(b => b.routeId === routeId);
          return routeBuses.length > 0
            ? routeBuses.reduce((sum, b) => sum + (b.occupancy / b.capacity), 0) / routeBuses.length
            : 0;
        })
        .filter(v => v > 0);

      return {
        routeId,
        avgOccupancy: Math.round(routeData.reduce((a, b) => a + b, 0) / routeData.length * 100),
        maxOccupancy: Math.round(Math.max(...routeData) * 100),
        minOccupancy: Math.round(Math.min(...routeData) * 100),
        dataPoints: routeData.length
      };
    });

    return comparison;
  }

  /**
   * 📉 Trend direction (up/down/stable)
   */
  getTrendDirection(values) {
    if (values.length < 2) return 'stable';

    const recent = values.slice(-Math.ceil(values.length / 3));
    const older = values.slice(0, Math.ceil(values.length / 3));

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    const change = recentAvg - olderAvg;
    if (Math.abs(change) < 5) return 'stable'; // Less than 5% change
    return change > 0 ? 'increasing' : 'decreasing';
  }

  /**
   * Get insights from historical data
   */
  getInsights() {
    const peakHours = this.analyzePeakHours();
    const busyHour = peakHours.sort((a, b) => b.avgOccupancy - a.avgOccupancy)[0];
    const quietHour = peakHours.sort((a, b) => a.avgOccupancy - b.avgOccupancy)[0];

    return {
      busiestHour: `${busyHour.hour}:00 (${busyHour.avgOccupancy}% occupied)`,
      quietestHour: `${quietHour.hour}:00 (${quietHour.avgOccupancy}% occupied)`,
      timeRange: peakHours.length > 0 ? `${peakHours[0].hour}:00 - ${peakHours[peakHours.length - 1].hour}:00` : 'No data'
    };
  }

  /**
   * Clear all historical data
   */
  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Error clearing history:', error);
      return false;
    }
  }
}

// Singleton instance
export const historicalAnalytics = new HistoricalAnalytics();

/**
 * Export for periodic recording
 */
export const recordAnalyticsSnapshot = (buses, routes) => {
  // Record every 5 minutes
  const lastRecord = localStorage.getItem('transit_last_record_time');
  const now = Date.now();
  if (!lastRecord || now - parseInt(lastRecord) > 5 * 60 * 1000) {
    historicalAnalytics.recordSnapshot(buses, routes);
    localStorage.setItem('transit_last_record_time', now.toString());
  }
};
