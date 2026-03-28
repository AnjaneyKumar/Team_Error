import { useEffect } from 'react';
import { connectSocket, getSocket, subscribeToRoute, unsubscribeFromRoute } from '../utils/socket';

// Custom hook for real-time bus updates
export const useRealTimeBuses = (routeId, onUpdate) => {
  useEffect(() => {
    const socket = connectSocket();

    if (routeId) {
      subscribeToRoute(routeId);

      // Listen for real-time bus location updates
      socket.on('bus_location_updated', (bus) => {
        if (onUpdate) {
          onUpdate(bus);
        }
      });

      return () => {
        unsubscribeFromRoute(routeId);
        socket.off('bus_location_updated');
      };
    }
  }, [routeId, onUpdate]);

  return getSocket();
};

// Custom hook for socket connection
export const useSocket = () => {
  useEffect(() => {
    connectSocket();

    return () => {
      // Don't disconnect on unmount - keep connection alive
    };
  }, []);

  return getSocket();
};
