import express from 'express';
import {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  addStopToRoute,
  removeStopFromRoute,
  searchRoutes
} from '../controllers/routeController.js';

const router = express.Router();

// Route endpoints
router.get('/', getAllRoutes);
router.get('/search', searchRoutes);
router.get('/:id', getRouteById);
router.post('/', createRoute);
router.put('/:id', updateRoute);
router.delete('/:id', deleteRoute);

// Stop management within routes
router.post('/:routeId/stops/:stopId', addStopToRoute);
router.delete('/:routeId/stops/:stopId', removeStopFromRoute);

export default router;
