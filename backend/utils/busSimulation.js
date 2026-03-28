import Bus from '../models/Bus.js';
import Route from '../models/Route.js';

// Simulates real-time bus movement
// Updates bus locations every 5 seconds with slight variations

let simulationInterval = null;

export const startBusSimulation = (io) => {
  // Start simulation every 5 seconds
  simulationInterval = setInterval(async () => {
    try {
      const buses = await Bus.find().populate('route').populate('nextStop.stop');

      buses.forEach(async (bus) => {
        if (bus.status === 'running' && bus.route) {
          // Calculate random movement
          const speedVariation = Math.random() * 2 - 1; // -1 to +1 km/h variation
          const newSpeed = Math.max(0, Math.min(60, (bus.speed || 30) + speedVariation));

          // Random heading (0-360 degrees)
          const heading = Math.random() * 360;

          // Calculate new location based on speed and heading
          const deltaLat = (Math.random() * 0.01) - 0.005;
          const deltaLng = (Math.random() * 0.01) - 0.005;

          const newLocation = {
            latitude: bus.currentLocation?.latitude || 0 + deltaLat,
            longitude: bus.currentLocation?.longitude || 0 + deltaLng,
            updatedAt: new Date()
          };

          // Random delay simulation (80% on time, 20% delayed)
          const isDelayed = Math.random() > 0.8;
          const delayMinutes = isDelayed ? Math.floor(Math.random() * 10) + 1 : 0;

          // Random occupancy (20-95%)
          const occupancy = Math.floor(Math.random() * 75) + 20;

          // Update bus in database
          const updatedBus = await Bus.findByIdAndUpdate(
            bus._id,
            {
              currentLocation: newLocation,
              speed: newSpeed,
              heading,
              delayMinutes,
              occupancy,
              status: isDelayed ? 'delayed' : 'running'
            },
            { new: true }
          ).populate('route').populate('nextStop.stop');

          // Emit real-time update via Socket.io
          io.to(`route_${bus.route._id}`).emit('bus_location_updated', updatedBus);
          io.emit('bus_location_updated', updatedBus); // Broadcast to all

          console.log(`Updated bus ${bus.busNumber}: speed=${newSpeed.toFixed(2)}km/h, delay=${delayMinutes}min`);
        }
      });
    } catch (error) {
      console.error('Bus simulation error:', error);
    }
  }, 5000); // Update every 5 seconds

  console.log('✓ Bus simulation started');
};

export const stopBusSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    console.log('✓ Bus simulation stopped');
  }
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate ETA based on distance and average speed
export const calculateETA = (distance, speed = 30) => {
  const timeInHours = distance / speed;
  const timeInMinutes = Math.round(timeInHours * 60);
  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + timeInMinutes);
  return { timeInMinutes, eta };
};
