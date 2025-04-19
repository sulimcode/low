// Prayer calculation methods
export enum CalculationMethod {
  MWL = 0,            // Muslim World League
  ISNA = 1,           // Islamic Society of North America
  Egypt = 2,          // Egyptian General Authority of Survey
  Makkah = 3,         // Umm al-Qura University, Makkah
  Karachi = 4,        // University of Islamic Sciences, Karachi
  Tehran = 5,         // Institute of Geophysics, University of Tehran
  Jafari = 7,         // Shia Ithna-Ashari, Leva Institute, Qum
}

// Prayer times interface
export interface PrayerTime {
  name: string;
  time: string;
  timeFormatted: string;
  timeInMinutes: number;
  isCurrent: boolean;
  isUpcoming?: boolean;
  remainingTime?: string;
}

// Complete prayer times data
export interface PrayerTimes {
  date: string;
  gregorianDate: string;
  islamicDate: string;
  dayOfWeek: string;
  location: string;
  timezone?: string; // Часовой пояс локации
  gmtOffset?: number; // Смещение в секундах относительно UTC
  latitude?: string;
  longitude?: string;
  times: PrayerTime[];
}

// Monthly prayer times data
export interface MonthlyPrayerTimes {
  gregorianMonth: string;
  gregorianYear: number;
  islamicMonth: string;
  islamicYear: number;
  days: DailyPrayerTime[];
}

// Daily prayer time for monthly view
export interface DailyPrayerTime {
  gregorianDate: string;
  islamicDate: string;
  gregorianDay: number;
  islamicDay: number;
  gregorianMonth: number;
  islamicMonth: number;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Location data
export interface Location {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  value: string;
}

// API Response for prayer times
export interface PrayerTimesApiResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Sunset: string;
      Maghrib: string;
      Isha: string;
      Imsak: string;
      Midnight: string;
      Firstthird: string;
      Lastthird: string;
    };
    date: {
      readable: string;
      timestamp: string;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
        };
        month: {
          number: number;
          en: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
      };
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
        holidays: string[];
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: {
          Fajr: number;
          Isha: number;
        };
        location: {
          latitude: number;
          longitude: number;
        };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: {
        Imsak: number;
        Fajr: number;
        Sunrise: number;
        Dhuhr: number;
        Asr: number;
        Maghrib: number;
        Sunset: number;
        Isha: number;
        Midnight: number;
      };
    };
  };
}

// API Response for monthly prayer times
export interface MonthlyPrayerTimesApiResponse {
  code: number;
  status: string;
  data: Array<{
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Sunset: string;
      Maghrib: string;
      Isha: string;
      Imsak: string;
      Midnight: string;
      Firstthird: string;
      Lastthird: string;
    };
    date: {
      readable: string;
      timestamp: string;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
        };
        month: {
          number: number;
          en: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
      };
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
        holidays: string[];
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: {
          Fajr: number;
          Isha: number;
        };
        location: {
          latitude: number;
          longitude: number;
        };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: {
        Imsak: number;
        Fajr: number;
        Sunrise: number;
        Dhuhr: number;
        Asr: number;
        Maghrib: number;
        Sunset: number;
        Isha: number;
        Midnight: number;
      };
    };
  }>;
}

// Location API Response
export interface GeoLocationApiResponse {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string; // Latitude,Longitude
  org: string;
  postal: string;
  timezone: string;
}
