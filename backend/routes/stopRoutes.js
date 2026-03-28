import express from 'express';
import {
  getAllStops,
  getStopById,
  createStop,
  updateStop,
  deleteStop,
  getNearbyStops,
  searchStops
} from '../controllers/stopController.js';

const router = express.Router();

// Stop endpoints
router.get('/', getAllStops);
router.get('/search', searchStops);
router.get('/nearby', getNearbyStops);
router.post('/', createStop);
router.get('/:id', getStopById);
router.put('/:id', updateStop);
router.delete('/:id', deleteStop);

export default router;
