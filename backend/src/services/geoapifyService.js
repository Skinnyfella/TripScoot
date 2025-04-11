import axios from 'axios';
import dotenv from 'dotenv';
import winston from 'winston';
import NodeCache from 'node-cache';
dotenv.config();

const GEOAPIFY_API_URL = 'https://api.geoapify.com/v2/places';
const GEOAPIFY_GEOCODE_URL = 'https://api.geoapify.com/v1/geocode/search';
const API_KEY = process.env.GEOAPIFY_API_KEY;

// Initialize cache with 15 minutes TTL
const cache = new NodeCache({ 
  stdTTL: 900, // 15 minutes
  checkperiod: 120, // Check for expired entries every 2 minutes
  useClones: false
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// If we're not in production, log to console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const geocodeCity = async (city) => {
  const response = await axios.get(GEOAPIFY_GEOCODE_URL, {
    params: { text: city, apiKey: API_KEY, limit: 1 }
  });

  const { lat, lon } = response.data.features[0]?.properties || {};
  if (!lat || !lon) throw new Error(`No coordinates found for city: ${city}`);
  
  logger.info(`Geocoded ${city} to: lat=${lat}, lon=${lon}`);
  return { lat, lon };
};

const validateCoordinates = (lat, lng) => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  
  if (isNaN(latNum) || isNaN(lngNum)) {
    throw new Error('Invalid coordinates format');
  }
  
  if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
    throw new Error('Coordinates out of range');
  }
  
  return { lat: latNum, lng: lngNum };
};

const getCacheKey = ({ lat, lng, categories }) => {
  return `places_${lat}_${lng}_${categories}`;
};

const fetchPlaces = async ({ lat, lng, location, categories }) => {
  try {
    if (lat && lng) {
      ({ lat, lng } = validateCoordinates(lat, lng));
    } else if (!location) {
      throw new Error('Location or coordinates required');
    } else {
      const coords = await geocodeCity(location);
      lat = coords.lat;
      lng = coords.lon;
    }

    const cacheKey = getCacheKey({ lat, lng, categories });
    
    // Try to get from cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      logger.info(`Returning cached places for ${cacheKey}`);
      return cachedResult;
    }

    logger.info(`Fetching places for lat=${lat}, lng=${lng}, categories=${categories}`);

    const response = await axios.get(GEOAPIFY_API_URL, {
      params: {
        apiKey: API_KEY,
        limit: 50,
        filter: `circle:${lng},${lat},10000`, // 10km radius
        categories
      },
      timeout: 5000 // 5 second timeout
    });

    logger.info(`Raw Geoapify response for categories=${categories}`);

    // Keep track of IDs to ensure uniqueness
    const idSet = new Set();
    const results = response.data.features.map((item, index) => {
      let id = item.properties.place_id || `geoapify-${Date.now()}-${index}`;
      if (idSet.has(id)) {
        id = `${id}-${index}`;
      }
      idSet.add(id);

      return {
        id,
        name: item.properties.name || 'Unnamed Location',
        location: item.properties.formatted || item.properties.address_line1 || 'Address not available',
        type: item.properties.categories?.[0]?.split('.')?.pop() || 'general'
      };
    });

    // Cache the results
    cache.set(cacheKey, results);
    return results;

  } catch (error) {
    logger.error('Error in fetchPlaces:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }
};

export const fetchHotels = (params) => fetchPlaces({ ...params, categories: 'accommodation.hotel' });
export const fetchRestaurants = (params) => fetchPlaces({ ...params, categories: 'catering.restaurant' });
export const fetchActivities = (params) => fetchPlaces({ ...params, categories: 'leisure' });
export const fetchMalls = (params) => fetchPlaces({ ...params, categories: 'commercial.shopping_mall' });