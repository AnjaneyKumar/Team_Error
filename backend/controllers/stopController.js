import Stop from '../models/Stop.js';

// Get all stops
export const getAllStops = async (req, res) => {
  const stops = await Stop.find().populate('routes');
  res.json(stops);
};

// Get stop by ID
export const getStopById = async (req, res) => {
  const stop = await Stop.findById(req.params.id).populate('routes');

  if (!stop) {
    return res.status(404).json({ error: 'Stop not found' });
  }

  res.json(stop);
};

// Create new stop
export const createStop = async (req, res) => {
  const { name, code, location, address, amenities, zone, accessibility } = req.body;

  const stop = new Stop({
    name,
    code,
    location,
    address,
    amenities,
    zone,
    accessibility
  });

  const savedStop = await stop.save();
  res.status(201).json(savedStop);
};

// Update stop
export const updateStop = async (req, res) => {
  const stop = await Stop.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('routes');

  if (!stop) {
    return res.status(404).json({ error: 'Stop not found' });
  }

  res.json(stop);
};

// Delete stop
export const deleteStop = async (req, res) => {
  const stop = await Stop.findByIdAndDelete(req.params.id);

  if (!stop) {
    return res.status(404).json({ error: 'Stop not found' });
  }

  res.json({ message: 'Stop deleted successfully', stop });
};

// Find nearby stops using simple distance calculation
// In production, you'd use MongoDB geospatial queries
export const getNearbyStops = async (req, res) => {
  const { latitude, longitude, radius = 1 } = req.query; // radius in km

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const radiusInKm = parseFloat(radius);

  // Simple distance calculation (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

  const stops = await Stop.find().populate('routes');
  
  const nearbyStops = stops
    .map(stop => ({
      ...stop.toObject(),
      distance: calculateDistance(lat, lng, stop.location.latitude, stop.location.longitude)
    }))
    .filter(stop => stop.distance <= radiusInKm)
    .sort((a, b) => a.distance - b.distance);

  res.json(nearbyStops);
};

// Search stops by name or code
export const searchStops = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const stops = await Stop.find({
    $or: [
      { code: { $regex: query, $options: 'i' } },
      { name: { $regex: query, $options: 'i' } }
    ]
  }).populate('routes');

  res.json(stops);
};
