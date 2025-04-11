import winston from 'winston';
import {
  fetchHotels,
  fetchRestaurants,
  fetchActivities,
  fetchMalls,
} from '../services/geoapifyService.js';

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const handleRequest = (fetcher) => async (req, res) => {
  try {
    // Validate input parameters
    if (!req.query.location && (!req.query.lat || !req.query.lng)) {
      return res.status(400).json({
        error: 'Missing required parameters: either location or lat/lng coordinates'
      });
    }

    const data = await fetcher({
      location: req.query.location,
      lat: req.query.lat,
      lng: req.query.lng
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: 'No results found'
      });
    }

    res.status(200).json(data);
  } catch (error) {    // Log error with Winston and send clean error to client
    logger.error(`Error in ${fetcher.name}:`, { error: error.message, stack: error.stack });
    res.status(500).json({
      error: 'An internal server error occurred'
    });
  }
};

export const getHotels = handleRequest(fetchHotels);
export const getRestaurants = handleRequest(fetchRestaurants);
export const getActivities = handleRequest(fetchActivities);
export const getMalls = handleRequest(fetchMalls);