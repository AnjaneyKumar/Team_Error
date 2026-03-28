import { useEffect } from 'react';
import { historicalAnalytics } from '../utils/analytics';

/**
 * 📊 useAnalytics Hook
 * Records historical analytics snapshots every 5 minutes
 */
export function useAnalytics(buses, routes) {
  useEffect(() => {
    if (!buses || !routes) return;

    // Record initial snapshot when data is available
    historicalAnalytics.recordSnapshot(buses, routes);

    // Set interval to record every 5 minutes (300000 ms)
    const interval = setInterval(() => {
      historicalAnalytics.recordSnapshot(buses, routes);
    }, 300000);

    return () => clearInterval(interval);
  }, [buses, routes]);
}

export default useAnalytics;
