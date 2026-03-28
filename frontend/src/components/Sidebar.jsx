import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/store';
import { useRoutes, useStops, useBuses } from '../hooks/useData';
import RouteList from './RouteList';
import BusList from './BusList';
import StopsList from './StopsList';
import NearbyStops from './NearbyStops';
import SmartInsights from './SmartInsights';
import AnalyticsDashboard from './AnalyticsDashboard';
import FavoritesPanel from './FavoritesPanel';
import { SkeletonRouteList, SkeletonBusList } from './SkeletonLoader';
import { X } from 'lucide-react';

function Sidebar({ isOpen, onToggle }) {
  const { isDarkMode } = useStore();
  const [activeTab, setActiveTab] = useState('routes');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { routes, loadingRoutes } = useRoutes();
  const { stops, loadingStops } = useStops();
  const { buses, loadingBuses } = useBuses();

  const tabs = [
    { id: 'routes', label: 'Routes', icon: '🛣️' },
    { id: 'stops', label: 'Stops', icon: '📍' },
    { id: 'buses', label: 'Buses', icon: '🚗' },
    { id: 'nearby', label: 'Nearby', icon: '🗺️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  // Handle mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when tab changes
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile && isOpen) {
      onToggle();
    }
  };

  // Animations
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* MOBILE BACKDROP - Only show on mobile when drawer is open */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onToggle}
            className="fixed inset-0 bg-black/50 z-30"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            key="mobile-sidebar"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`fixed left-0 top-0 h-screen w-72 sm:w-80 z-40 flex flex-col shadow-2xl ${
              isDarkMode
                ? 'bg-gray-900 border-r border-gray-800'
                : 'bg-white border-r border-gray-200'
            }`}
          >
            {/* Mobile Header with Close Button */}
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDarkMode
                  ? 'border-gray-700 bg-gray-800'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Menu
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggle}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Close menu"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Mobile Tabs - Horizontal scroll */}
            <div
              className={`flex flex-row gap-1 overflow-x-auto p-2 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              } scrollbar-thin`}
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? isDarkMode
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-500 text-white shadow-md'
                      : isDarkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={tab.label}
                >
                  {tab.icon} {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Mobile Content - Scrollable */}
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin ${
                isDarkMode
                  ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800'
                  : 'scrollbar-thumb-gray-400 scrollbar-track-gray-100'
              }`}
            >
              {/* Routes Tab */}
              {activeTab === 'routes' && (
                <>
                  {!loadingRoutes && <FavoritesPanel />}
                  {loadingRoutes ? <SkeletonRouteList /> : <RouteList routes={routes} />}
                </>
              )}

              {/* Stops Tab */}
              {activeTab === 'stops' && (
                loadingStops ? <SkeletonRouteList /> : <StopsList stops={stops} />
              )}

              {/* Buses Tab */}
              {activeTab === 'buses' && (
                loadingBuses ? <SkeletonBusList /> : <BusList buses={buses} />
              )}

              {/* Nearby Stops Tab */}
              {activeTab === 'nearby' && <NearbyStops />}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && <AnalyticsDashboard />}
            </motion.div>

            {/* Mobile Smart Insights Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`p-3 border-t ${
                isDarkMode
                  ? 'border-gray-800 bg-gray-800'
                  : 'border-gray-200 bg-gray-50'
              } flex-shrink-0`}
            >
              <SmartInsights />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR - Always visible on desktop (hidden md:flex) */}
      {!isMobile && (
        <div
          className={`hidden md:flex relative w-64 lg:w-72 xl:w-80 flex-col shadow-lg ${
            isDarkMode
              ? 'bg-gray-900 border-r border-gray-800'
              : 'bg-white border-r border-gray-200'
          }`}
        >
          {/* Desktop Tabs - Vertical layout */}
          <div
            className={`flex flex-col gap-0.5 p-2 border-b ${
              isDarkMode ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all text-left flex items-center gap-3 ${
                  activeTab === tab.id
                    ? isDarkMode
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-blue-500 text-white shadow-md'
                    : isDarkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={tab.label}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Desktop Content - Scrollable */}
          <motion.div
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin ${
              isDarkMode
                ? 'scrollbar-thumb-gray-600 scrollbar-track-gray-800'
                : 'scrollbar-thumb-gray-400 scrollbar-track-gray-100'
            }`}
          >
            {/* Routes Tab */}
            {activeTab === 'routes' && (
              <>
                {!loadingRoutes && <FavoritesPanel />}
                {loadingRoutes ? <SkeletonRouteList /> : <RouteList routes={routes} />}
              </>
            )}

            {/* Stops Tab */}
            {activeTab === 'stops' && (
              loadingStops ? <SkeletonRouteList /> : <StopsList stops={stops} />
            )}

            {/* Buses Tab */}
            {activeTab === 'buses' && (
              loadingBuses ? <SkeletonBusList /> : <BusList buses={buses} />
            )}

            {/* Nearby Stops Tab */}
            {activeTab === 'nearby' && <NearbyStops />}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
          </motion.div>

          {/* Smart Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-3 border-t ${
              isDarkMode
                ? 'border-gray-800 bg-gray-800'
                : 'border-gray-200 bg-gray-50'
            } flex-shrink-0`}
          >
            <SmartInsights />
          </motion.div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
