import { apiRequest } from "./queryClient";
import type { Location } from "@shared/types";

/**
 * Get prayer times for the current day for a specific location
 * @param latitude Latitude
 * @param longitude Longitude
 * @param method Calculation method (default: 2 - Egyptian General Authority of Survey)
 * @returns Promise with prayer times data
 */
export async function getPrayerTimes(latitude: string, longitude: string, method = 2) {
  const res = await apiRequest('GET', `/api/prayer-times?latitude=${latitude}&longitude=${longitude}&method=${method}`, undefined);
  return res.json();
}

/**
 * Get prayer times for a specific month
 * @param latitude Latitude
 * @param longitude Longitude
 * @param month Month number (1-12)
 * @param year Year (e.g., 2023)
 * @param method Calculation method
 * @returns Promise with monthly prayer times data
 */
export async function getMonthlyPrayerTimes(latitude: string, longitude: string, month: number, year: number, method = 2) {
  const res = await apiRequest(
    'GET', 
    `/api/prayer-times/monthly?latitude=${latitude}&longitude=${longitude}&month=${month}&year=${year}&method=${method}`, 
    undefined
  );
  return res.json();
}

/**
 * Get location based on IP address
 * @param language Language code for results (optional)
 * @returns Promise with location data
 */
export async function getLocationByIp(language = 'en') {
  const res = await apiRequest('GET', `/api/geo/ip-location?language=${language}`, undefined);
  return res.json();
}

/**
 * Get location based on coordinates
 * @param latitude Latitude
 * @param longitude Longitude
 * @param language Language code for results (optional)
 * @returns Promise with location data
 */
export async function getLocationByCoordinates(latitude: number, longitude: number, language = 'ru') {
  const res = await apiRequest(
    'GET', 
    `/api/geo/coordinates/${latitude}/${longitude}?lang=${language}`, 
    undefined
  );
  return res.json();
}

/**
 * Get a list of popular locations
 * @param language Language code for results (optional)
 * @returns Promise with location data
 */
export async function getPopularLocations(language = 'ru') {
  const res = await apiRequest('GET', `/api/locations/popular?language=${language}`, undefined);
  return res.json();
}

/**
 * Search for locations by name
 * @param query Search query
 * @param language Language code for results (optional)
 * @returns Promise with location search results
 */
export async function searchLocations(query: string, language = 'ru') {
  const res = await apiRequest('GET', `/api/locations/search?q=${encodeURIComponent(query)}&lang=${language}`, undefined);
  return res.json();
}
