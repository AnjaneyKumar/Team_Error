import { useEffect, useState, useRef, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import { useStore } from './context/store';
import { useSocket } from './hooks/useSocket';
import { useRoutes, useBuses } from './hooks/useData';
import { useAnalytics } from './hooks/useAnalytics';
import { isBusArrivingSoon, predictDelay, getRouteRecommendations } from './utils/predictions';
import './styles/index.css';

function App() {
  const { isDarkMode, addNotification, routes, setSelectedRoute } = useStore();
  const { routes: fetchedRoutes, loadingRoutes } = useRoutes();
  const { buses, loadingBuses } = useBuses();
  
  // Mobile state management
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const alertedBuses = useRef(new Set());

  // Initialize Socket.IO connection
  useSocket();

  // Record analytics snapshots every 5 minutes
  useAnalytics(buses, fetchedRoutes);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when window shrinks
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
      // Auto-open sidebar on desktop when window expands
      if (!mobile && window.innerWidth >= 1024 && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Auto-select best route on first load
  useEffect(() => {
    if (fetchedRoutes.length > 0 && !routes.length) {
      const recommendations = getRouteRecommendations(fetchedRoutes, buses);
      if (recommendations.best) {
        setSelectedRoute(recommendations.best);
      }
    }
  }, [fetchedRoutes, routes.length, buses, setSelectedRoute]);

  // Smart Alert System - Monitor buses arriving soon
  useEffect(() => {
    if (!buses || buses.length === 0) return;

    buses.forEach((bus) => {
      const isArriving = isBusArrivingSoon(bus, 2);
      
      if (isArriving && !alertedBuses.current.has(bus._id)) {
        alertedBuses.current.add(bus._id);
        
        addNotification({
          type: 'success',
          title: `🚌 Bus ${bus.busNumber} Arriving!`,
          message: `${bus.nextStop?.stop?.name || 'Your stop'} in ${bus.nextStop?.eta || '2'} minutes`,
          duration: 5000
        });
      }
      
      if (!isArriving && alertedBuses.current.has(bus._id)) {
        if ((bus.nextStop?.eta || 0) < 0) {
          alertedBuses.current.delete(bus._id);
        }
      }
    });
  }, [buses, addNotification]);

  // Alert for high delay predictions
  useEffect(() => {
    if (!buses || buses.length === 0) return;

    buses.forEach((bus) => {
      if (bus.status === 'delayed' && bus.delayMinutes > 5) {
        const key = `delay-${bus._id}`;
        if (!alertedBuses.current.has(key)) {
          alertedBuses.current.add(key);
          addNotification({
            type: 'warning',
            title: `⚠️ Bus ${bus.busNumber} Delayed`,
            message: `Expected delay: +${bus.delayMinutes} minutes on ${bus.route?.name || 'this route'}`,
            duration: 4000
          });

          setTimeout(() => alertedBuses.current.delete(key), 60000);
        }
      }
    });
  }, [buses, addNotification]);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Memoized toggle function to avoid unnecessary re-renders
  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar - Responsive */}
      <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />

      {/* Main Content - Responsive */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={handleToggleSidebar} />

        {/* Map Area - Responsive */}
        <div className="flex-1 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          {loadingRoutes || loadingBuses ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
              {/* Loading State */}
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-base sm:text-lg font-semibold text-center">Loading map data...</p>
            </div>
          ) : (
            <Map routes={fetchedRoutes} buses={buses} />
          )}
        </div>
      </div>

      {/* Toast Notifications - Responsive positioning */}
      <ToastContainer
        position={isMobile ? 'bottom-center' : 'bottom-right'}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        theme={isDarkMode ? 'dark' : 'light'}
        className="sm:bottom-4 sm:right-4"
      />
    </div>
  );
}

export default App;
