import Bus from '../models/Bus.js';
import Route from '../models/Route.js';

// Get all buses
export const getAllBuses = async (req, res) => {
  const buses = await Bus.find().populate('route').populate('nextStop.stop').populate('lastStopServed');
  res.json(buses);
};

// Get bus by ID
export const getBusById = async (req, res) => {
  const bus = await Bus.findById(req.params.id)
    .populate('route')
    .populate('nextStop.stop')
    .populate('lastStopServed');

  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json(bus);
};

// Get buses on a specific route
export const getBusesByRoute = async (req, res) => {
  const { routeId } = req.params;

  const buses = await Bus.find({ route: routeId })
    .populate('route')
    .populate('nextStop.stop')
    .populate('lastStopServed');

  res.json(buses);
};

// Create new bus
export const createBus = async (req, res) => {
  const { busNumber, route, currentLocation, status, capacity, driverId, driverName } = req.body;

  const bus = new Bus({
    busNumber,
    route,
    currentLocation,
    status,
    capacity,
    driverId,
    driverName
  });

  const savedBus = await bus.save();
  const populated = await savedBus.populate(['route', 'nextStop.stop', 'lastStopServed']);

  res.status(201).json(populated);
};

// Update bus location (Real-time tracking)
export const updateBusLocation = async (req, res) => {
  const { latitude, longitude, speed, heading, nextStop, delayMinutes, status, occupancy } = req.body;

  const bus = await Bus.findByIdAndUpdate(
    req.params.id,
    {
      currentLocation: { latitude, longitude, updatedAt: new Date() },
      speed,
      heading,
      nextStop,
      delayMinutes,
      status,
      occupancy
    },
    { new: true }
  ).populate('route').populate('nextStop.stop');

  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json(bus);
};

// Update bus status
export const updateBusStatus = async (req, res) => {
  const { status, lastStopServed } = req.body;

  const bus = await Bus.findByIdAndUpdate(
    req.params.id,
    {
      status,
      lastStopServed,
      lastStopServedAt: new Date()
    },
    { new: true, runValidators: true }
  ).populate(['route', 'lastStopServed']);

  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json(bus);
};

// Delete bus
export const deleteBus = async (req, res) => {
  const bus = await Bus.findByIdAndDelete(req.params.id);

  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json({ message: 'Bus deleted successfully', bus });
};

// Get buses on multiple routes
export const getBusesByRoutes = async (req, res) => {
  const { routeIds } = req.body; // Array of route IDs

  if (!Array.isArray(routeIds)) {
    return res.status(400).json({ error: 'routeIds must be an array' });
  }

  const buses = await Bus.find({ route: { $in: routeIds } })
    .populate('route')
    .populate('nextStop.stop')
    .populate('lastStopServed');

  res.json(buses);
};
