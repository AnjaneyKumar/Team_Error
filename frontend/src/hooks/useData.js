import { useEffect, useState } from 'react';
import { routesAPI, stopsAPI, busesAPI } from '../utils/api';
import { useStore } from '../context/store';

// Custom hook to fetch all routes
export const useRoutes = () => {
  const [loadingRoutes, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { routes, setRoutes } = useStore();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await routesAPI.getAll();
        setRoutes(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching routes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  return { routes, loadingRoutes, error };
};

// Custom hook to fetch all stops
export const useStops = () => {
  const [loadingStops, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { stops, setStops } = useStore();

  useEffect(() => {
    const fetchStops = async () => {
      try {
        setLoading(true);
        const response = await stopsAPI.getAll();
        setStops(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, []);

  return { stops, loadingStops, error };
};

// Custom hook to fetch all buses
export const useBuses = () => {
  const [loadingBuses, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { buses, setBuses } = useStore();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const response = await busesAPI.getAll();
        setBuses(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching buses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  return { buses, loadingBuses, error };
};

// Custom hook to get nearby stops
export const useNearbyStops = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { nearbyStops, setNearbyStops } = useStore();

  const fetchNearbyStops = async (lat, lng, radius = 1) => {
    // Guard against null coordinates
    if (lat === null || lng === null || lat === undefined || lng === undefined) {
      console.warn('🚨 fetchNearbyStops called with invalid coordinates:', { lat, lng });
      setError('Invalid coordinates provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('📍 Fetching nearby stops for:', { lat, lng, radius });
      const response = await stopsAPI.getNearby(lat, lng, radius);
      console.log('✅ Found nearby stops:', response.data?.length || 0);
      setNearbyStops(response.data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching nearby stops:', err);
    } finally {
      setLoading(false);
    }
  };

  return { nearbyStops, loading, error, fetchNearbyStops };
};

// Custom hook to search routes
export const useSearchRoutes = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        const response = await routesAPI.search(query);
        setResults(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading, error };
};
