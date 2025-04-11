import express from 'express';
import { getHotels, getRestaurants, getActivities, getMalls } from '../controllers/placesController.js';

const router = express.Router();

router.get('/hotels', getHotels);
router.get('/restaurants', getRestaurants);
router.get('/activities', getActivities);
router.get('/malls', getMalls);

export default router;
