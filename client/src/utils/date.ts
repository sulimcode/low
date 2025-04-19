/**
 * Formats a time string from 24-hour format to 12-hour format with AM/PM
 * @param timeString Time string in 24-hour format (HH:MM)
 * @returns Formatted time string in 12-hour format with AM/PM
 */
export function formatTime(timeString: string): string {
  // Remove any timezone information if present
  const cleanTimeString = timeString.split(' ')[0];
  
  // Parse hours and minutes
  const [hours, minutes] = cleanTimeString.split(':').map(Number);
  
  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Calculates the remaining time until a specific prayer time
 * @param prayerTimeInMinutes Prayer time in minutes from the start of the day
 * @param currentTimeInMinutes Current time in minutes from the start of the day
 * @returns Formatted string showing remaining time
 */
export function calculateRemainingTime(prayerTimeInMinutes: number, currentTimeInMinutes: number): string {
  if (prayerTimeInMinutes < currentTimeInMinutes) {
    // Prayer time is earlier in the day, so it's tomorrow
    prayerTimeInMinutes += 24 * 60; // Add 24 hours in minutes
  }
  
  const remainingMinutes = prayerTimeInMinutes - currentTimeInMinutes;
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  
  // We'll return an object with time values so the UI can use translations
  return JSON.stringify({
    hours,
    minutes,
    format: hours === 0 ? 'minutes_only' : 'hours_minutes'
  });
}

/**
 * Converts a time string to minutes since the start of the day
 * @param timeString Time string in 24-hour format (HH:MM)
 * @returns Minutes since the start of the day
 */
export function timeToMinutes(timeString: string): number {
  // Remove any timezone information if present
  const cleanTimeString = timeString.split(' ')[0];
  
  const [hours, minutes] = cleanTimeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Determines if a prayer time is the current active prayer
 * @param prayerTimeMinutes Prayer time in minutes since start of day
 * @param nextPrayerTimeMinutes Next prayer time in minutes since start of day
 * @param currentTimeMinutes Current time in minutes since start of day
 * @returns Boolean indicating if this is the current prayer time
 */
export function isCurrentPrayer(
  prayerTimeMinutes: number, 
  nextPrayerTimeMinutes: number | null, 
  currentTimeMinutes: number
): boolean {
  if (nextPrayerTimeMinutes === null) {
    // This is the last prayer of the day
    return currentTimeMinutes >= prayerTimeMinutes;
  }
  
  return currentTimeMinutes >= prayerTimeMinutes && currentTimeMinutes < nextPrayerTimeMinutes;
}

/**
 * Formats a date in Gregorian format
 * @param date The date to format
 * @returns Formatted date string (e.g., "October 12, 2023")
 */
export function formatGregorianDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Gets the day of the week
 * @param date The date
 * @returns Day of week (e.g., "Monday")
 */
export function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}
