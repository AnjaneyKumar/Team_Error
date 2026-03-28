import Route from '../models/Route.js';
import Stop from '../models/Stop.js';

// Get all routes
export const getAllRoutes = async (req, res) => {
  const routes = await Route.find().populate('stops');
  res.json(routes);
};

// Get route by ID
export const getRouteById = async (req, res) => {
  const route = await Route.findById(req.params.id).populate('stops');
  
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  
  res.json(route);
};

// Create new route
export const createRoute = async (req, res) => {
  const { routeNumber, name, description, startPoint, endPoint, polyline, distance, estimatedDuration, operatingHours, frequency, busCount, color } = req.body;

  const route = new Route({
    routeNumber,
    name,
    description,
    startPoint,
    endPoint,
    polyline,
    distance,
    estimatedDuration,
    operatingHours,
    frequency,
    busCount,
    color,
    stops: []
  });

  const savedRoute = await route.save();
  res.status(201).json(savedRoute);
};

// Update route
export const updateRoute = async (req, res) => {
  const route = await Route.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('stops');

  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.json(route);
};

// Delete route
export const deleteRoute = async (req, res) => {
  const route = await Route.findByIdAndDelete(req.params.id);

  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.json({ message: 'Route deleted successfully', route });
};

// Add stop to route
export const addStopToRoute = async (req, res) => {
  const { routeId, stopId } = req.params;

  const route = await Route.findByIdAndUpdate(
    routeId,
    { $addToSet: { stops: stopId } }, // $addToSet prevents duplicates
    { new: true }
  ).populate('stops');

  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.json(route);
};

// Remove stop from route
export const removeStopFromRoute = async (req, res) => {
  const { routeId, stopId } = req.params;

  const route = await Route.findByIdAndUpdate(
    routeId,
    { $pull: { stops: stopId } },
    { new: true }
  ).populate('stops');

  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }

  res.json(route);
};

// Search routes by name or number
export const searchRoutes = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const routes = await Route.find({
    $or: [
      { routeNumber: { $regex: query, $options: 'i' } },
      { name: { $regex: query, $options: 'i' } }
    ]
  }).populate('stops');

  res.json(routes);
};
