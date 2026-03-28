import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useStore } from '../context/store';
import { useRealTimeBuses } from '../hooks/useSocket';

// Custom SVG Icons
const createBusIcon = (isSelected = false) => {
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="20" height="16" rx="2" fill="${isSelected ? '#3B82F6' : '#EF4444'}" stroke="white" stroke-width="1.5"/>
      <circle cx="10" cy="24" r="2" fill="#333"/>
      <circle cx="22" cy="24" r="2" fill="#333"/>
      <rect x="8" y="9" width="5" height="4" fill="#87CEEB"/>
      <rect x="15" y="9" width="5" height="4" fill="#87CEEB"/>
    </svg>
  `;
  
  return L.divIcon({
    html: `<div class="bus-marker ${isSelected ? 'selected' : ''}">${svg}</div>`,
    className: 'custom-bus-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 24],
    popupAnchor: [0, -24]
  });
};

const createStopIcon = () => {
  const svg = `
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="10" fill="#10B981" stroke="white" stroke-width="2"/>
      <text x="14" y="18" font-size="12" fill="white" text-anchor="middle" font-weight="bold">S</text>
    </svg>
  `;
  
  return L.divIcon({
    html: `<div class="stop-marker">${svg}</div>`,
    className: 'custom-stop-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

// Smooth position interpolation
const interpolatePosition = (current, target, factor = 0.1) => {
  if (!current || !target) return target;
  return [
    current[0] + (target[0] - current[0]) * factor,
    current[1] + (target[1] - current[1]) * factor
  ];
};

function Map({ routes, buses }) {
  const { isDarkMode, selectedRoute, centerMap, setCenterMap, mapZoom, setMapZoom } = useStore();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const busMarkers = useRef({});
  const busPulses = useRef({});
  const stopMarkers = useRef({});
  const routePolylines = useRef({});
  const busPositions = useRef({}); // Track current positions for interpolation
  const [selectedBusId, setSelectedBusId] = useState(null);

  // Smooth bus movement
  useRealTimeBuses(selectedRoute?._id, (updatedBus) => {
    if (busMarkers.current[updatedBus._id]) {
      const currentPos = busPositions.current[updatedBus._id] || [
        updatedBus.currentLocation.latitude,
        updatedBus.currentLocation.longitude
      ];
      
      const targetPos = [
        updatedBus.currentLocation.latitude,
        updatedBus.currentLocation.longitude
      ];

      // Animate to new position
      let steps = 0;
      const animate = () => {
        steps++;
        if (steps < 10) {
          const interpolated = interpolatePosition(currentPos, targetPos, 0.1);
          busMarkers.current[updatedBus._id]?.setLatLng(interpolated);
          requestAnimationFrame(animate);
        } else {
          busMarkers.current[updatedBus._id]?.setLatLng(targetPos);
        }
      };
      animate();

      busPositions.current[updatedBus._id] = targetPos;

      // Update popup with rich content
      const occupancyPercent = (updatedBus.occupancy / updatedBus.capacity * 100).toFixed(0);
      const occupancyColor = occupancyPercent > 80 ? '#EF4444' : occupancyPercent > 50 ? '#F59E0B' : '#10B981';
      
      const popupContent = `
        <div class="bus-popup" style="min-width: 200px; font-family: Inter, sans-serif;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="font-size: 20px;">🚌</span>
            <div>
              <p style="font-weight: bold; margin: 0; font-size: 14px;">Bus ${updatedBus.busNumber}</p>
              <p style="margin: 0; font-size: 11px; color: #666;">${updatedBus.route?.name || 'Route'}</p>
            </div>
          </div>
          <div style="background: #f3f4f6; padding: 8px; border-radius: 6px; margin-bottom: 8px; font-size: 12px; line-height: 1.5;">
            <p style="margin: 2px 0;">⚡ Speed: <strong>${updatedBus.speed?.toFixed(1) || 0} km/h</strong></p>
            <p style="margin: 2px 0;">👥 Occupancy: <strong>${occupancyPercent}%</strong></p>
            <p style="margin: 2px 0; display: flex; align-items: center; gap: 4px;">
              <span>📊</span>
              <div style="flex: 1; background: #ddd; height: 6px; border-radius: 3px; overflow: hidden;">
                <div style="background: ${occupancyColor}; height: 100%; width: ${occupancyPercent}%;"></div>
              </div>
            </p>
            <p style="margin: 2px 0;">📍 Status: <strong style="color: ${updatedBus.status === 'running' ? '#10B981' : updatedBus.status === 'delayed' ? '#F59E0B' : '#EF4444'};">${updatedBus.status.toUpperCase()}</strong></p>
            ${updatedBus.nextStop ? `<p style="margin: 2px 0; margin-top: 6px;">➡️ Next: <strong>${updatedBus.nextStop.name}</strong></p>` : ''}
            ${updatedBus.delayMinutes > 0 ? `<p style="margin: 2px 0; color: #EF4444; font-weight: bold;">⚠️ Delayed: ${updatedBus.delayMinutes} min</p>` : ''}
          </div>
        </div>
      `;
      busMarkers.current[updatedBus._id]?.setPopupContent(popupContent);
    }
  });

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize Map with animation
    map.current = L.map(mapContainer.current, { animate: true, duration: 0.5 }).setView([40.7128, -74.0060], 13);

    // Tile layer with dark mode support
    const tileLayer = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayer, {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
      fadeAnimation: true,
      zoomAnimation: true
    }).addTo(map.current);

    // Add map move events to store
    map.current.on('moveend', () => {
      const center = map.current.getCenter();
      setCenterMap({ lat: center.lat, lng: center.lng });
    });

    map.current.on('zoomend', () => {
      setMapZoom(map.current.getZoom());
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isDarkMode]);

  // Update routes polylines with better styling
  useEffect(() => {
    if (!map.current) return;

    // Clear existing polylines
    Object.values(routePolylines.current).forEach(polyline => polyline.remove());
    routePolylines.current = {};

    if (selectedRoute && selectedRoute.polyline) {
      const latLngs = selectedRoute.polyline.map(p => [p.latitude, p.longitude]);
      const polyline = L.polyline(latLngs, {
        color: selectedRoute.color || '#3B82F6',
        weight: 4,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: 'none',
        className: 'route-polyline-selected drop-shadow-lg'
      }).addTo(map.current);

      // Auto-focus on selected route
      const bounds = polyline.getBounds();
      if (bounds.isValid()) {
        map.current.fitBounds(bounds, { padding: [50, 50], duration: 0.8 });
      }

      routePolylines.current[selectedRoute._id] = polyline;
    }
  }, [selectedRoute]);

  // Update stops markers with animations
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(stopMarkers.current).forEach(marker => marker.remove());
    stopMarkers.current = {};

    const stops = selectedRoute?.stops || [];
    stops.forEach((stop, index) => {
      if (stop.location) {
        const marker = L.marker([stop.location.latitude, stop.location.longitude], {
          icon: createStopIcon(),
          title: stop.name
        })
          .bindPopup(`
            <div style="font-family: Inter, sans-serif; min-width: 160px;">
              <p style="font-weight: bold; margin: 0 0 4px 0; font-size: 13px;">🛑 ${stop.name}</p>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #666;">${stop.code}</p>
              <p style="margin: 0; font-size: 11px;">
                <strong>${stop.routes?.length || 0}</strong> route${stop.routes?.length !== 1 ? 's' : ''} serve this stop
              </p>
            </div>
          `, { maxWidth: 200 })
          .on('mouseover', function() { this.openPopup(); })
          .on('mouseout', function() { this.closePopup(); })
          .addTo(map.current);

        // Add fade-in animation
        marker._icon.style.animation = `fadeIn 0.5s ease-in-out`;
        marker._icon.style.animationDelay = `${index * 50}ms`;

        stopMarkers.current[stop._id] = marker;
      }
    });
  }, [selectedRoute]);

  // Update bus markers with smooth animations
  useEffect(() => {
    if (!map.current) return;

    // Clear existing bus markers and pulses
    Object.values(busMarkers.current).forEach(marker => marker.remove());
    Object.values(busPulses.current).forEach(layer => layer.remove());
    busMarkers.current = {};
    busPulses.current = {};

    const activeBuses = selectedRoute
      ? buses.filter(b => b.route?._id === selectedRoute._id)
      : buses;

    activeBuses.forEach((bus, index) => {
      if (bus.currentLocation) {
        const isSelected = selectedBusId === bus._id;
        const marker = L.marker([bus.currentLocation.latitude, bus.currentLocation.longitude], {
          icon: createBusIcon(isSelected),
          title: `Bus ${bus.busNumber}`
        })
          .bindPopup(`
            <div style="font-family: Inter, sans-serif; min-width: 220px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                <span style="font-size: 20px;">🚌</span>
                <div>
                  <p style="font-weight: bold; margin: 0; font-size: 14px;">Bus ${bus.busNumber}</p>
                  <p style="margin: 0; font-size: 11px; color: #666;">${bus.route?.name || 'Route'}</p>
                </div>
              </div>
              <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; font-size: 12px; line-height: 1.6;">
                <p style="margin: 3px 0;">⚡ Speed: <strong>${bus.speed?.toFixed(1) || 0} km/h</strong></p>
                <p style="margin: 3px 0;">👥 Occupancy: <strong>${(bus.occupancy / bus.capacity * 100).toFixed(0)}%</strong></p>
                <p style="margin: 3px 0; display: flex; align-items: center; gap: 4px;">
                  <span>📊</span>
                  <div style="flex: 1; background: #ddd; height: 6px; border-radius: 3px; overflow: hidden;">
                    <div style="background: ${(bus.occupancy / bus.capacity * 100) > 80 ? '#EF4444' : (bus.occupancy / bus.capacity * 100) > 50 ? '#F59E0B' : '#10B981'}; height: 100%; width: ${(bus.occupancy / bus.capacity * 100).toFixed(0)}%;"></div>
                  </div>
                </p>
                <p style="margin: 3px 0;">📍 Status: <strong style="color: ${bus.status === 'running' ? '#10B981' : bus.status === 'delayed' ? '#F59E0B' : '#EF4444'};">${bus.status.toUpperCase()}</strong></p>
                ${bus.nextStop ? `<p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px solid #ddd; font-size: 11px;">➡️ Next Stop: <strong>${bus.nextStop.name}</strong></p>` : ''}
                ${bus.delayMinutes > 0 ? `<p style="margin: 3px 0; color: #EF4444; font-weight: bold;">⚠️ Delayed: ${bus.delayMinutes} min</p>` : ''}
              </div>
            </div>
          `, { maxWidth: 250 })
          .on('click', () => {
            setSelectedBusId(bus._id);
            marker.setIcon(createBusIcon(true));
          })
          .addTo(map.current);

        // Add pulse circle for animated effect
        const pulseCircle = L.circleMarker([bus.currentLocation.latitude, bus.currentLocation.longitude], {
          radius: 12,
          fillColor: bus.status === 'delayed' ? '#F59E0B' : '#3B82F6',
          color: 'white',
          weight: 2,
          opacity: 0.3,
          fillOpacity: 0.1,
          className: 'bus-pulse'
        }).addTo(map.current);

        // Add fade-in animation
        marker._icon.style.animation = `fadeIn 0.6s ease-in-out`;
        marker._icon.style.animationDelay = `${index * 30}ms`;

        busMarkers.current[bus._id] = marker;
        busPulses.current[bus._id] = pulseCircle;

        busPositions.current[bus._id] = [
          bus.currentLocation.latitude,
          bus.currentLocation.longitude
        ];
      }
    });

    // Reset selected bus styling
    if (selectedBusId && !activeBuses.find(b => b._id === selectedBusId)) {
      setSelectedBusId(null);
    }
  }, [buses, selectedRoute, selectedBusId]);

  return (
    <>
      <motion.div
        ref={mapContainer}
        className="w-full h-full"
        style={{ zIndex: 1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0% {
            r: 8px;
            opacity: 0.6;
          }
          50% {
            r: 15px;
            opacity: 0.3;
          }
          100% {
            r: 20px;
            opacity: 0;
          }
        }

        .bus-marker {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          transition: all 0.3s ease;
        }

        .bus-marker.selected {
          filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.5));
          transform: scale(1.15);
        }

        .bus-marker:hover {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
          transform: scale(1.1);
        }

        .stop-marker {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
          animation: fadeIn 0.5s ease-in-out;
        }

        .stop-marker:hover {
          filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.4));
          transform: scale(1.1);
        }

        .route-polyline-selected {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .bus-pulse {
          animation: pulse 2s infinite;
        }

        .bus-popup {
          border-radius: 8px;
          font-size: 13px;
        }

        .leaflet-popup-content {
          margin: 0;
          border-radius: 8px;
        }

        .leaflet-popup {
          border-radius: 8px !important;
        }
      `}</style>
    </>
  );
}

export default Map;
