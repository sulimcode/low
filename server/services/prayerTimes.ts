import axios from 'axios';
import { 
  PrayerTimes, 
  MonthlyPrayerTimes, 
  PrayerTimesApiResponse, 
  MonthlyPrayerTimesApiResponse,
  Location,
  GeoLocationApiResponse
} from '@shared/types';
import { processPrayerTimesResponse, processMonthlyPrayerTimesResponse } from '../../client/src/utils/prayer';

// Free prayer times API
const PRAYER_API_BASE_URL = 'https://api.aladhan.com/v1';
// Ipinfo.io for IP geolocation
const IP_INFO_API_KEY = process.env.IP_INFO_API_KEY; 

/**
 * Fetch prayer times for a specific day from API
 * @param latitude Latitude
 * @param longitude Longitude
 * @param method Calculation method
 * @returns Processed prayer times
 */
export async function getPrayerTimes(
  latitude: string | number,
  longitude: string | number,
  method: number = 2
): Promise<PrayerTimes> {
  // Конвертируем координаты в строки для API запроса
  const latStr = latitude.toString();
  const lngStr = longitude.toString();
  // Конвертируем координаты в числа для расчетов
  const latNum = typeof latitude === 'string' ? parseFloat(latitude) : latitude;
  const lngNum = typeof longitude === 'string' ? parseFloat(longitude) : longitude;
  const today = new Date();
  const url = `${PRAYER_API_BASE_URL}/timings/${today.getTime() / 1000}`;
  
  try {
    // Запрос к API для получения времен намаза
    // Важно: используем API параметр "school" с значением 1, это школа расчета Ханафи
    // которая является стандартной для России и Кавказа
    const response = await axios.get<PrayerTimesApiResponse>(url, {
      params: {
        latitude: latStr,
        longitude: lngStr,
        method,
        school: 1, // Ханафи - стандартная школа расчета для России и Кавказа
        adjustment: 0 // Без дополнительных корректировок
      }
    });
    
    console.log("API response for location:", response.data.data.meta);
    
    // Вычисляем временную зону на основе координат
    let timezoneOffset = 0;
    
    // Особая обработка для Грозного и Кавказского региона
    if (latNum >= 43.2 && latNum <= 43.4 && 
        lngNum >= 45.6 && lngNum <= 45.8) {
      // Точные координаты Грозного
      timezoneOffset = 3; // Грозный: UTC+3
      console.log("Обнаружен город Грозный, установлен часовой пояс UTC+3");
    }
    // Примерные часовые пояса для России и стран СНГ по долготе
    else if (lngNum > 30 && lngNum < 37.5) timezoneOffset = 3; // Москва и западная Россия (UTC+3)
    else if (lngNum >= 37.5 && lngNum < 52.5) timezoneOffset = 3; // Центральная Россия (UTC+3)
    else if (lngNum >= 52.5 && lngNum < 67.5) timezoneOffset = 4; // Урал (UTC+4) 
    else if (lngNum >= 67.5 && lngNum < 82.5) timezoneOffset = 5; // Западная Сибирь (UTC+5)
    else if (lngNum >= 82.5 && lngNum < 97.5) timezoneOffset = 6; // Центральная Сибирь (UTC+6)
    else if (lngNum >= 97.5 && lngNum < 112.5) timezoneOffset = 7; // Восточная Сибирь (UTC+7)
    else if (lngNum >= 112.5 && lngNum < 127.5) timezoneOffset = 8; // Якутия (UTC+8)
    else if (lngNum >= 127.5 && lngNum < 142.5) timezoneOffset = 9; // Дальний Восток (UTC+9)
    else if (lngNum >= 142.5 && lngNum < 157.5) timezoneOffset = 10; // Камчатка (UTC+10)
    else if (lngNum >= 35 && lngNum < 50 && latNum > 40 && latNum < 46) timezoneOffset = 3; // Кавказ (UTC+3)
    else timezoneOffset = Math.round(lngNum / 15); // Примерный расчет для других стран
    
    console.log("Расчетный часовой пояс для координат:", latitude, longitude, "UTC+" + timezoneOffset);
    
    // Получаем часовой пояс из ответа API, если он доступен
    const apiTimezone = response.data.data.meta.timezone;
    
    // Передаем данные о часовом поясе для корректного расчета текущей/предстоящей молитвы
    return processPrayerTimesResponse(response.data, apiTimezone, timezoneOffset * 3600); // переводим часы в секунды
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    try {
      // Запасной вариант, если запрос timezone не удался
      const response = await axios.get<PrayerTimesApiResponse>(url, {
        params: {
          latitude,
          longitude,
          method
        }
      });
      
      // Передаем null вместо часового пояса, будет использовано время устройства
      return processPrayerTimesResponse(response.data);
    } catch (backupError) {
      console.error('Backup request also failed:', backupError);
      throw new Error('Failed to fetch prayer times from API');
    }
  }
}

/**
 * Fetch prayer times for an entire month
 * @param latitude Latitude
 * @param longitude Longitude
 * @param month Month (1-12)
 * @param year Year (e.g., 2023)
 * @param method Calculation method
 * @returns Processed monthly prayer times
 */
export async function getMonthlyPrayerTimes(
  latitude: string,
  longitude: string,
  month: number,
  year: number,
  method: number = 2
): Promise<MonthlyPrayerTimes> {
  const url = `${PRAYER_API_BASE_URL}/calendar/${year}/${month}`;
  
  try {
    const response = await axios.get<MonthlyPrayerTimesApiResponse>(url, {
      params: {
        latitude,
        longitude,
        method
      }
    });
    
    return processMonthlyPrayerTimesResponse(response.data);
  } catch (error) {
    console.error('Error fetching monthly prayer times:', error);
    throw new Error('Failed to fetch monthly prayer times from API');
  }
}

/**
 * Get location from IP address
 * @param ip IP address
 * @returns Location object
 */
export async function getLocationFromIP(ip: string): Promise<Location> {
  try {
    // Check if we have an API key for ipinfo.io
    if (!IP_INFO_API_KEY) {
      console.warn('No IP_INFO_API_KEY provided, using default location (Mecca)');
      throw new Error('Missing IP_INFO_API_KEY');
    }
    
    // Use ipinfo.io to get location data from IP
    const url = `https://ipinfo.io/${ip}?token=${IP_INFO_API_KEY}`;
    const response = await axios.get<GeoLocationApiResponse>(url);
    
    // Parse location string in format "latitude,longitude"
    const [latitude, longitude] = response.data.loc.split(',').map(Number);
    
    return {
      name: response.data.city,
      country: response.data.country,
      latitude,
      longitude,
      value: `${response.data.city.toLowerCase()}-${response.data.country.toLowerCase()}`
    };
  } catch (error) {
    console.error('Error getting location from IP:', error);
    
    // Return a default location (Mecca) if IP lookup fails
    return {
      name: 'Мекка',
      country: 'Саудовская Аравия',
      latitude: 21.4225,
      longitude: 39.8262,
      value: 'mecca-saudi-arabia'
    };
  }
}

/**
 * Get location name from coordinates using reverse geocoding
 * @param latitude Latitude
 * @param longitude Longitude
 * @param language Language code for results
 * @returns Location object
 */
export async function getLocationFromCoordinates(latitude: number, longitude: number, language: string = 'ru'): Promise<Location> {
  try {
    // Use Open-Meteo Geocoding API (no API key required)
    const url = `https://geocoding-api.open-meteo.com/v1/search`;
    const response = await axios.get(url, {
      params: {
        latitude,
        longitude,
        count: 1,
        language // Use the specified language
      }
    });
    
    // Extract location details from response
    const locationData = response.data.results?.[0];
    
    if (!locationData) {
      throw new Error('No location found for these coordinates');
    }
    
    return {
      name: locationData.name,
      country: locationData.country,
      latitude,
      longitude,
      value: `${locationData.name.toLowerCase()}-${locationData.country_code.toLowerCase()}`
    };
  } catch (error) {
    console.error('Error getting location from coordinates:', error);
    
    // Return a location based on the coordinates with translated fallbacks
    const unknownLocation = language === 'ru' ? 'Пользовательское местоположение' :
                          language === 'en' ? 'Custom Location' :
                          language === 'ar' ? 'موقع مخصص' :
                          language === 'fr' ? 'Emplacement personnalisé' :
                          'Custom Location';
                          
    const unknownCountry = language === 'ru' ? 'Неизвестно' :
                         language === 'en' ? 'Unknown' :
                         language === 'ar' ? 'غير معروف' :
                         language === 'fr' ? 'Inconnu' :
                         'Unknown';
    
    return {
      name: unknownLocation,
      country: unknownCountry,
      latitude,
      longitude,
      value: `custom-${latitude.toFixed(4)}-${longitude.toFixed(4)}`
    };
  }
}

/**
 * Search for locations by name/query
 * @param query Search query (city name, possibly with country)
 * @param language Language code for results
 * @returns Array of matching locations
 */
export async function searchLocationsByName(query: string, language: string = 'ru'): Promise<Location[]> {
  try {
    console.log(`Searching for location with query: ${query} in language: ${language}`);
    
    // Use Open-Meteo Geocoding API for location search
    const url = `https://geocoding-api.open-meteo.com/v1/search`;
    const response = await axios.get(url, {
      params: {
        name: query,
        count: 10, // Limit results
        language // Use the passed language parameter
      }
    });
    
    console.log(`API response status: ${response.status}`);
    
    if (!response.data.results || response.data.results.length === 0) {
      console.log('No results found');
      return [];
    }
    
    console.log(`Found ${response.data.results.length} results`);
    
    // Map API results to our Location format
    const locations = response.data.results.map((result: any) => ({
      name: result.name || 'Unknown',
      country: result.country || 'Unknown',
      latitude: result.latitude,
      longitude: result.longitude,
      value: `${(result.name || 'loc').toLowerCase().replace(/\s+/g, '-')}-${(result.country_code || 'un').toLowerCase()}`
    }));
    
    console.log('Mapped locations:', locations);
    return locations;
  } catch (error) {
    console.error('Error searching for locations:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data || error.message);
    }
    return [];
  }
}
