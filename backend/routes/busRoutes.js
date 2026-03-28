import express from 'express';
import {
  getAllBuses,
  getBusById,
  getBusesByRoute,
  createBus,
  updateBusLocation,
  updateBusStatus,
  deleteBus,
  getBusesByRoutes
} from '../controllers/busController.js';

// Bus routes handler - receives io instance for real-time updates
export default function busRoutes(io) {
  const router = express.Router();

  // Bus endpoints
  router.get('/', getAllBuses);
  router.get('/:id', getBusById);
  router.get('/route/:routeId', getBusesByRoute);
  router.post('/', createBus);
  
  // Real-time location update
  router.put('/:id/location', async (req, res, next) => {
    try {
      // Call controller function
      const result = await updateBusLocation(req, res);
      
      // Emit real-time update to all connected clients
      if (res.statusCode === 200) {
        const bus = await require('../models/Bus.js').default.findById(req.params.id)
          .populate('route')
          .populate('nextStop.stop');
        
        io.to(`route_${bus.route._id}`).emit('bus_location_updated', bus);
        io.emit('bus_location_updated', bus); // Broadcast to all
      }
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id/status', updateBusStatus);
  router.delete('/:id', deleteBus);
  router.post('/routes/batch', getBusesByRoutes);

  return router;
}
