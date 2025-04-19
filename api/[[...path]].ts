// @ts-ignore - Игнорируем несоответствие версий типов
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createServer } from 'http';
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Патч для совместимости с Node.js 18 на Vercel
if (typeof import.meta.dirname === 'undefined') {
  // Для Node.js 18.x добавляем полифил для import.meta.dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // @ts-ignore
  import.meta.dirname = __dirname;
  console.log('Applied dirname polyfill in API route, dirname=', __dirname);
}

// Импортируем с путями относительно корня проекта
import { getPrayerTimes, getMonthlyPrayerTimes, getLocationFromIP, getLocationFromCoordinates, searchLocationsByName } from '../server/services/prayerTimes';
import { storage } from '../server/storage';
import { initializeDatabase } from '../server/db';

// Инициализируем базу данных при первом запуске
let dbInitialized = false;
const initDb = async () => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully in serverless function');
    } catch (error) {
      console.error('Error initializing database in serverless function:', error);
      // Не выбрасываем ошибку, чтобы функция могла продолжить выполнение
      // даже если инициализация базы данных не удалась
    }
  }
};

// Создание экземпляра Express
const app = express();

// Обработка CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware для парсинга тела запроса
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршруты API
// Location endpoints
app.get('/api/geo/ip-location', async (req: Request, res: Response) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '8.8.8.8';
    const ipString = Array.isArray(ip) ? ip[0] : ip as string;
    const cleanIp = ipString.split(',')[0].trim();
    
    // Получаем язык для локализации ответа
    const language = req.query.language as string || 'en';
    
    // Try to get location from IP if API key is available
    let location;
    
    try {
      if (process.env.IP_INFO_API_KEY) {
        location = await getLocationFromIP(cleanIp);
        
        // Локализация названий для разных языков
        if (language === 'ar') {
          if (location.name === 'Mecca' || location.name === 'Мекка') {
            location.name = 'مكة';
            location.country = 'المملكة العربية السعودية';
          }
        } else if (language === 'en') {
          if (location.name === 'Мекка') {
            location.name = 'Mecca';
            location.country = 'Saudi Arabia';
          }
        } else if (language === 'ru') {
          if (location.name === 'Mecca') {
            location.name = 'Мекка';
            location.country = 'Саудовская Аравия';
          }
        } else if (language === 'fr') {
          if (location.name === 'Mecca' || location.name === 'Мекка') {
            location.name = 'La Mecque';
            location.country = 'Arabie Saoudite';
          }
        }
      } else {
        // Default locations per language
        if (language === 'ar') {
          location = {
            name: 'مكة',
            country: 'المملكة العربية السعودية',
            latitude: 21.4225,
            longitude: 39.8262,
            value: 'mecca-saudi-arabia'
          };
        } else if (language === 'fr') {
          location = {
            name: 'La Mecque',
            country: 'Arabie Saoudite',
            latitude: 21.4225,
            longitude: 39.8262,
            value: 'mecca-saudi-arabia'
          };
        } else if (language === 'ru') {
          location = {
            name: 'Мекка',
            country: 'Саудовская Аравия',
            latitude: 21.4225,
            longitude: 39.8262,
            value: 'mecca-saudi-arabia'
          };
        } else {
          // English and others
          location = {
            name: 'Mecca',
            country: 'Saudi Arabia',
            latitude: 21.4225,
            longitude: 39.8262,
            value: 'mecca-saudi-arabia'
          };
        }
      }
    } catch (ipError) {
      console.error('IP location lookup failed:', ipError);
      
      // Fallback locations per language
      if (language === 'ar') {
        location = {
          name: 'مكة',
          country: 'المملكة العربية السعودية',
          latitude: 21.4225,
          longitude: 39.8262,
          value: 'mecca-saudi-arabia'
        };
      } else if (language === 'fr') {
        location = {
          name: 'La Mecque',
          country: 'Arabie Saoudite',
          latitude: 21.4225,
          longitude: 39.8262,
          value: 'mecca-saudi-arabia'
        };
      } else if (language === 'ru') {
        location = {
          name: 'Мекка',
          country: 'Саудовская Аравия',
          latitude: 21.4225,
          longitude: 39.8262,
          value: 'mecca-saudi-arabia'
        };
      } else {
        // English and others
        location = {
          name: 'Mecca',
          country: 'Saudi Arabia',
          latitude: 21.4225,
          longitude: 39.8262,
          value: 'mecca-saudi-arabia'
        };
      }
    }
    
    res.json(location);
  } catch (error) {
    console.error('Error getting location from IP:', error);
    res.status(500).json({ error: 'Failed to get location' });
  }
});

app.get('/api/geo/coordinates/:lat/:lng', async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.params;
    const language = req.query.lang as string || 'en';
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    const location = await getLocationFromCoordinates(latitude, longitude, language);
    res.json(location);
  } catch (error) {
    console.error('Error getting location from coordinates:', error);
    res.status(500).json({ error: 'Failed to get location from coordinates' });
  }
});

app.get('/api/locations/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const language = req.query.lang as string || 'en';
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error: 'Query too short' });
    }
    
    const locations = await searchLocationsByName(query, language);
    res.json(locations);
  } catch (error) {
    console.error('Error searching locations:', error);
    res.status(500).json({ error: 'Failed to search locations' });
  }
});

app.get('/api/locations/popular', async (req: Request, res: Response) => {
  try {
    // Получаем язык для локализации ответа
    const language = req.query.language as string || 'en';
    
    // Базовые локации
    let popularLocations = [];
    
    // Набор популярных мест в зависимости от языка
    if (language === 'ar') {
      popularLocations = [
        {
          name: "مكة",
          country: "المملكة العربية السعودية",
          latitude: 21.4225,
          longitude: 39.8262,
          value: "mecca-saudi-arabia"
        },
        {
          name: "المدينة المنورة",
          country: "المملكة العربية السعودية",
          latitude: 24.5247,
          longitude: 39.5692,
          value: "medina-saudi-arabia"
        },
        {
          name: "اسطنبول",
          country: "تركيا",
          latitude: 41.0082,
          longitude: 28.9784,
          value: "istanbul-turkey"
        },
        {
          name: "القاهرة",
          country: "مصر",
          latitude: 30.0444,
          longitude: 31.2357,
          value: "cairo-egypt"
        },
        {
          name: "دبي",
          country: "الإمارات العربية المتحدة",
          latitude: 25.2048,
          longitude: 55.2708,
          value: "dubai-uae"
        }
      ];
    } else if (language === 'ru') {
      popularLocations = [
        {
          name: "Мекка",
          country: "Саудовская Аравия",
          latitude: 21.4225,
          longitude: 39.8262,
          value: "mecca-saudi-arabia"
        },
        {
          name: "Медина",
          country: "Саудовская Аравия",
          latitude: 24.5247,
          longitude: 39.5692,
          value: "medina-saudi-arabia"
        },
        {
          name: "Стамбул",
          country: "Турция",
          latitude: 41.0082,
          longitude: 28.9784,
          value: "istanbul-turkey"
        },
        {
          name: "Каир",
          country: "Египет",
          latitude: 30.0444,
          longitude: 31.2357,
          value: "cairo-egypt"
        },
        {
          name: "Дубай",
          country: "ОАЭ",
          latitude: 25.2048,
          longitude: 55.2708,
          value: "dubai-uae"
        }
      ];
    } else if (language === 'fr') {
      popularLocations = [
        {
          name: "La Mecque",
          country: "Arabie Saoudite",
          latitude: 21.4225,
          longitude: 39.8262,
          value: "mecca-saudi-arabia"
        },
        {
          name: "Médine",
          country: "Arabie Saoudite",
          latitude: 24.5247,
          longitude: 39.5692,
          value: "medina-saudi-arabia"
        },
        {
          name: "Istanbul",
          country: "Turquie",
          latitude: 41.0082,
          longitude: 28.9784,
          value: "istanbul-turkey"
        },
        {
          name: "Le Caire",
          country: "Égypte",
          latitude: 30.0444,
          longitude: 31.2357,
          value: "cairo-egypt"
        },
        {
          name: "Dubaï",
          country: "Émirats Arabes Unis",
          latitude: 25.2048,
          longitude: 55.2708,
          value: "dubai-uae"
        }
      ];
    } else {
      // English и другие языки по умолчанию
      popularLocations = [
        {
          name: "Mecca",
          country: "Saudi Arabia",
          latitude: 21.4225,
          longitude: 39.8262,
          value: "mecca-saudi-arabia"
        },
        {
          name: "Medina",
          country: "Saudi Arabia",
          latitude: 24.5247,
          longitude: 39.5692,
          value: "medina-saudi-arabia"
        },
        {
          name: "Istanbul",
          country: "Turkey",
          latitude: 41.0082,
          longitude: 28.9784,
          value: "istanbul-turkey"
        },
        {
          name: "Cairo",
          country: "Egypt",
          latitude: 30.0444,
          longitude: 31.2357,
          value: "cairo-egypt"
        },
        {
          name: "Dubai",
          country: "United Arab Emirates",
          latitude: 25.2048,
          longitude: 55.2708,
          value: "dubai-uae"
        }
      ];
    }
    
    res.json(popularLocations);
  } catch (error) {
    console.error('Error getting popular locations:', error);
    res.status(500).json({ error: 'Failed to get popular locations' });
  }
});

// Prayer time endpoints
app.get('/api/prayer-times', async (req: Request, res: Response) => {
  try {
    const latitude = req.query.latitude || '21.4225'; // Mecca default
    const longitude = req.query.longitude || '39.8262';
    const method = parseInt(req.query.method as string || '2');
    
    const prayerTimes = await getPrayerTimes(latitude as string, longitude as string, method);
    res.json(prayerTimes);
  } catch (error) {
    console.error('Error getting prayer times:', error);
    res.status(500).json({ error: 'Failed to get prayer times' });
  }
});

app.get('/api/prayer-times/monthly', async (req: Request, res: Response) => {
  try {
    const latitude = req.query.latitude || '21.4225'; // Mecca default
    const longitude = req.query.longitude || '39.8262';
    const now = new Date();
    const month = parseInt(req.query.month as string || (now.getMonth() + 1).toString());
    const year = parseInt(req.query.year as string || now.getFullYear().toString());
    const method = parseInt(req.query.method as string || '2');
    
    const monthlyTimes = await getMonthlyPrayerTimes(
      latitude as string,
      longitude as string,
      month,
      year,
      method
    );
    
    res.json(monthlyTimes);
  } catch (error) {
    console.error('Error getting monthly prayer times:', error);
    res.status(500).json({ error: 'Failed to get monthly prayer times' });
  }
});

// User preferences API
// Функция для получения IP адреса пользователя
const getClientIp = (req: any): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip: string) => ip.trim());
    return ips[0];
  }
  return req.socket.remoteAddress || '127.0.0.1';
};

// Получение текущих настроек пользователя
app.get('/api/preferences', async (req: Request, res: Response) => {
  try {
    const ipAddress = getClientIp(req);
    const userPrefs = await storage.getUserPreferences(ipAddress);
    
    if (userPrefs) {
      res.json({
        theme: userPrefs.theme,
        language: userPrefs.language,
        location: userPrefs.location,
        latitude: userPrefs.latitude,
        longitude: userPrefs.longitude,
        method: userPrefs.method
      });
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Error getting user preferences:', error);
    res.status(500).json({ error: 'Failed to get user preferences' });
  }
});

// Обновление темы пользователя
app.post('/api/preferences/theme', async (req: Request, res: Response) => {
  try {
    const { theme } = req.body;
    const ipAddress = getClientIp(req);
    
    // Проверяем, есть ли уже настройки для этого IP
    let userPrefs = await storage.getUserPreferences(ipAddress);
    
    if (userPrefs) {
      // Обновляем существующие настройки
      userPrefs = await storage.updateUserPreferences(ipAddress, { theme });
    } else {
      // Создаем новые настройки
      userPrefs = await storage.createUserPreferences({
        ipAddress,
        theme,
        location: 'Mecca', // Default location
        latitude: '21.4225',
        longitude: '39.8262',
        language: 'ru',
        method: 1
      });
    }
    
    res.json({ success: true, theme });
  } catch (error) {
    console.error('Error updating theme preference:', error);
    res.status(500).json({ error: 'Failed to update theme preference' });
  }
});

// Обновление языка пользователя
app.post('/api/preferences/language', async (req: Request, res: Response) => {
  try {
    const { language } = req.body;
    const ipAddress = getClientIp(req);
    
    // Проверяем, есть ли уже настройки для этого IP
    let userPrefs = await storage.getUserPreferences(ipAddress);
    
    if (userPrefs) {
      // Обновляем существующие настройки
      userPrefs = await storage.updateUserPreferences(ipAddress, { language });
    } else {
      // Создаем новые настройки
      userPrefs = await storage.createUserPreferences({
        ipAddress,
        language,
        location: 'Mecca', // Default location
        latitude: '21.4225',
        longitude: '39.8262',
        theme: 'light',
        method: 1
      });
    }
    
    res.json({ success: true, language });
  } catch (error) {
    console.error('Error updating language preference:', error);
    res.status(500).json({ error: 'Failed to update language preference' });
  }
});

// Обновление местоположения пользователя
app.post('/api/preferences/location', async (req: Request, res: Response) => {
  try {
    const { location, latitude, longitude, method } = req.body;
    const ipAddress = getClientIp(req);
    
    // Проверяем, есть ли уже настройки для этого IP
    let userPrefs = await storage.getUserPreferences(ipAddress);
    
    if (userPrefs) {
      // Обновляем существующие настройки
      userPrefs = await storage.updateUserPreferences(ipAddress, { 
        location, 
        latitude: String(latitude), 
        longitude: String(longitude),
        method: method || userPrefs.method
      });
    } else {
      // Создаем новые настройки
      userPrefs = await storage.createUserPreferences({
        ipAddress,
        location,
        latitude: String(latitude),
        longitude: String(longitude),
        language: 'ru',
        theme: 'light',
        method: method || 1
      });
    }
    
    res.json({ 
      success: true, 
      location,
      latitude,
      longitude,
      method: userPrefs.method
    });
  } catch (error) {
    console.error('Error updating location preference:', error);
    res.status(500).json({ error: 'Failed to update location preference' });
  }
});

// Обработка ошибок
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('API error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  });
});

// Vercel serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Инициализация базы данных при первом запуске
  try {
    await initDb();
    
    return new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) {
          console.error('Express middleware error:', err);
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });
  } catch (error) {
    console.error('Unhandled error in serverless function:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Произошла внутренняя ошибка сервера' });
    return;
  }
}