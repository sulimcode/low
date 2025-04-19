// Импорт полифила import.meta.dirname
import './dirname-import.js';

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  getPrayerTimes, 
  getMonthlyPrayerTimes, 
  getLocationFromIP, 
  getLocationFromCoordinates,
  searchLocationsByName
} from "./services/prayerTimes";
import NodeCache from "node-cache";
import axios from 'axios';

// Create a cache with 3 hour TTL
const cache = new NodeCache({ stdTTL: 10800 });

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for getting prayer times for the current day
  app.get('/api/prayer-times', async (req, res) => {
    try {
      const { latitude, longitude, method = 2 } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
      }
      
      const cacheKey = `prayer-times-${latitude}-${longitude}-${method}-${new Date().toISOString().split('T')[0]}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json(cachedData);
      }
      
      const prayerTimes = await getPrayerTimes(
        String(latitude), 
        String(longitude),
        Number(method)
      );
      
      cache.set(cacheKey, prayerTimes);
      res.json(prayerTimes);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      res.status(500).json({ message: 'Failed to fetch prayer times' });
    }
  });
  
  // API route for getting monthly prayer times
  app.get('/api/prayer-times/monthly', async (req, res) => {
    try {
      const { latitude, longitude, month, year, method = 2 } = req.query;
      
      if (!latitude || !longitude || !month || !year) {
        return res.status(400).json({ 
          message: 'Latitude, longitude, month, and year are required' 
        });
      }
      
      const cacheKey = `monthly-${latitude}-${longitude}-${month}-${year}-${method}`;
      const cachedData = cache.get(cacheKey);
      
      if (cachedData) {
        return res.json(cachedData);
      }
      
      const monthlyPrayerTimes = await getMonthlyPrayerTimes(
        String(latitude),
        String(longitude),
        Number(month),
        Number(year),
        Number(method)
      );
      
      cache.set(cacheKey, monthlyPrayerTimes);
      res.json(monthlyPrayerTimes);
    } catch (error) {
      console.error('Error fetching monthly prayer times:', error);
      res.status(500).json({ message: 'Failed to fetch monthly prayer times' });
    }
  });
  
  // API route for getting location from IP
  app.get('/api/geo/ip-location', async (req, res) => {
    try {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const language = String(req.query.language || 'ru');
      
      // Fall back to Mecca as a default location instead of making IP calls
      // that frequently fail in the Replit environment
      const defaultLocations = {
        'ru': { 
          name: 'Мекка', 
          country: 'Саудовская Аравия', 
          latitude: 21.4225, 
          longitude: 39.8262,
          value: 'mecca-saudi-arabia'
        },
        'en': { 
          name: 'Mecca', 
          country: 'Saudi Arabia', 
          latitude: 21.4225, 
          longitude: 39.8262,
          value: 'mecca-saudi-arabia'
        },
        'ar': { 
          name: 'مكة', 
          country: 'المملكة العربية السعودية', 
          latitude: 21.4225, 
          longitude: 39.8262,
          value: 'mecca-saudi-arabia'
        },
        // Add more languages as needed
      };
      
      // Use the appropriate language or fall back to English
      const lang = language as keyof typeof defaultLocations;
      const defaultLocation = lang in defaultLocations ? defaultLocations[lang] : defaultLocations['en'];
      
      res.json(defaultLocation);
    } catch (error) {
      console.error('Error getting location from IP:', error);
      res.status(500).json({ message: 'Failed to get location from IP' });
    }
  });
  
  // API route for getting location from coordinates (reverse geocoding)
  app.get('/api/geo/reverse-geocode', async (req, res) => {
    try {
      const { latitude, longitude, language = 'ru' } = req.query;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
      }
      
      const location = await getLocationFromCoordinates(
        Number(latitude),
        Number(longitude),
        String(language)
      );
      
      res.json(location);
    } catch (error) {
      console.error('Error getting location from coordinates:', error);
      res.status(500).json({ message: 'Failed to get location from coordinates' });
    }
  });
  
  // API route for searching locations by name
  app.get('/api/locations/search', async (req, res) => {
    try {
      const { query, language = 'ru' } = req.query;
      
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      console.log('Received search request for:', query, 'in language:', language);
      
      const locations = await searchLocationsByName(String(query), String(language));
      console.log('Final locations to return:', locations);
      
      // Return the results without caching for now
      res.json(locations);
    } catch (error) {
      console.error('Error searching for locations:', error);
      res.status(500).json({ message: 'Failed to search for locations' });
    }
  });
  
  // API route for getting popular locations
  app.get('/api/locations/popular', (req, res) => {
    try {
      const language = req.query.language || 'ru';
      
      // Define popular locations with language support
      const popularLocationsMap = {
        'ru': [
          { name: 'Мекка', country: 'Саудовская Аравия', latitude: 21.4225, longitude: 39.8262, value: 'mecca-saudi-arabia' },
          { name: 'Медина', country: 'Саудовская Аравия', latitude: 24.5247, longitude: 39.5692, value: 'medina-saudi-arabia' },
          { name: 'Стамбул', country: 'Турция', latitude: 41.0082, longitude: 28.9784, value: 'istanbul-turkey' },
          { name: 'Каир', country: 'Египет', latitude: 30.0444, longitude: 31.2357, value: 'cairo-egypt' },
          { name: 'Дубай', country: 'ОАЭ', latitude: 25.2048, longitude: 55.2708, value: 'dubai-uae' },
          { name: 'Москва', country: 'Россия', latitude: 55.7558, longitude: 37.6173, value: 'moscow-russia' },
          { name: 'Санкт-Петербург', country: 'Россия', latitude: 59.9343, longitude: 30.3351, value: 'st-petersburg-russia' },
          { name: 'Казань', country: 'Россия', latitude: 55.7887, longitude: 49.1221, value: 'kazan-russia' },
          { name: 'Уфа', country: 'Россия', latitude: 54.7348, longitude: 55.9578, value: 'ufa-russia' },
          { name: 'Грозный', country: 'Россия', latitude: 43.3168, longitude: 45.6927, value: 'grozny-russia' }
        ],
        'en': [
          { name: 'Mecca', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, value: 'mecca-saudi-arabia' },
          { name: 'Medina', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692, value: 'medina-saudi-arabia' },
          { name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, value: 'istanbul-turkey' },
          { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, value: 'cairo-egypt' },
          { name: 'Dubai', country: 'UAE', latitude: 25.2048, longitude: 55.2708, value: 'dubai-uae' },
          { name: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173, value: 'moscow-russia' },
          { name: 'Saint Petersburg', country: 'Russia', latitude: 59.9343, longitude: 30.3351, value: 'st-petersburg-russia' },
          { name: 'Kazan', country: 'Russia', latitude: 55.7887, longitude: 49.1221, value: 'kazan-russia' },
          { name: 'Ufa', country: 'Russia', latitude: 54.7348, longitude: 55.9578, value: 'ufa-russia' },
          { name: 'Grozny', country: 'Russia', latitude: 43.3168, longitude: 45.6927, value: 'grozny-russia' }
        ],
        'ar': [
          { name: 'مكة', country: 'المملكة العربية السعودية', latitude: 21.4225, longitude: 39.8262, value: 'mecca-saudi-arabia' },
          { name: 'المدينة المنورة', country: 'المملكة العربية السعودية', latitude: 24.5247, longitude: 39.5692, value: 'medina-saudi-arabia' },
          { name: 'إسطنبول', country: 'تركيا', latitude: 41.0082, longitude: 28.9784, value: 'istanbul-turkey' },
          { name: 'القاهرة', country: 'مصر', latitude: 30.0444, longitude: 31.2357, value: 'cairo-egypt' },
          { name: 'دبي', country: 'الإمارات العربية المتحدة', latitude: 25.2048, longitude: 55.2708, value: 'dubai-uae' },
          { name: 'موسكو', country: 'روسيا', latitude: 55.7558, longitude: 37.6173, value: 'moscow-russia' },
          { name: 'سانت بطرسبرغ', country: 'روسيا', latitude: 59.9343, longitude: 30.3351, value: 'st-petersburg-russia' },
          { name: 'قازان', country: 'روسيا', latitude: 55.7887, longitude: 49.1221, value: 'kazan-russia' },
          { name: 'أوفا', country: 'روسيا', latitude: 54.7348, longitude: 55.9578, value: 'ufa-russia' },
          { name: 'غروزني', country: 'روسيا', latitude: 43.3168, longitude: 45.6927, value: 'grozny-russia' }
        ],
        // Add more languages as needed
      };
      
      // Default to English if the requested language is not available
      const lang = String(language) as keyof typeof popularLocationsMap;
      const popularLocations = lang in popularLocationsMap ? popularLocationsMap[lang] : popularLocationsMap['en'];
      
      res.json(popularLocations);
    } catch (error) {
      console.error('Error getting popular locations:', error);
      res.status(500).json({ message: 'Failed to get popular locations' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
