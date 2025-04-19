import { PrayerTime, PrayerTimes, DailyPrayerTime, MonthlyPrayerTimes, PrayerTimesApiResponse, MonthlyPrayerTimesApiResponse } from '@shared/types';
import { formatTime, timeToMinutes, calculateRemainingTime, isCurrentPrayer, formatGregorianDate, getDayOfWeek } from './date';

/**
 * Process the API response to create formatted prayer times
 * @param response API response with prayer times data
 * @param timezone The timezone of the location
 * @param gmtOffset The GMT offset in seconds
 * @returns Processed prayer times data
 */
export function processPrayerTimesResponse(
  response: PrayerTimesApiResponse, 
  timezone?: string, 
  gmtOffset?: number
): PrayerTimes {
  const { data } = response;
  const { timings, date, meta } = data;
  
  // Получаем текущее время в локации
  let locationDate;
  
  if (timezone && gmtOffset !== undefined) {
    // Если у нас есть информация о часовом поясе локации, используем его
    // для определения текущего времени в этой локации
    const deviceDate = new Date();
    const utcTime = deviceDate.getTime() + (deviceDate.getTimezoneOffset() * 60000); // UTC время в миллисекундах
    locationDate = new Date(utcTime + (gmtOffset * 1000)); // Локальное время локации
    console.log("Using location time:", locationDate, "for timezone", timezone, "GMT offset:", gmtOffset);
  } else {
    // Если нет информации о часовом поясе, используем время устройства
    locationDate = new Date();
    console.log("Using device time:", locationDate);
  }
  
  const locationHours = locationDate.getHours();
  const locationMinutes = locationDate.getMinutes();
  const locationTimeInMinutes = locationHours * 60 + locationMinutes;
  
  console.log("Текущее время в локации:", `${locationHours}:${locationMinutes}`, `(${locationTimeInMinutes} минут)`);

  // Create an array of prayer times in chronological order
  const prayerTimesArray: PrayerTime[] = [
    { name: 'Fajr', time: timings.Fajr, timeFormatted: formatTime(timings.Fajr), timeInMinutes: timeToMinutes(timings.Fajr), isCurrent: false },
    { name: 'Sunrise', time: timings.Sunrise, timeFormatted: formatTime(timings.Sunrise), timeInMinutes: timeToMinutes(timings.Sunrise), isCurrent: false },
    { name: 'Dhuhr', time: timings.Dhuhr, timeFormatted: formatTime(timings.Dhuhr), timeInMinutes: timeToMinutes(timings.Dhuhr), isCurrent: false },
    { name: 'Asr', time: timings.Asr, timeFormatted: formatTime(timings.Asr), timeInMinutes: timeToMinutes(timings.Asr), isCurrent: false },
    { name: 'Maghrib', time: timings.Maghrib, timeFormatted: formatTime(timings.Maghrib), timeInMinutes: timeToMinutes(timings.Maghrib), isCurrent: false },
    { name: 'Isha', time: timings.Isha, timeFormatted: formatTime(timings.Isha), timeInMinutes: timeToMinutes(timings.Isha), isCurrent: false },
  ];
  
  // Определение текущей и следующей молитвы на основе времени в локации
  let foundCurrent = false;
  let foundUpcoming = false;
  
  // Сначала сбрасываем все статусы
  prayerTimesArray.forEach(prayer => {
    prayer.isCurrent = false;
    prayer.isUpcoming = false;
  });
  
  console.log("Времена молитв сегодня:");
  prayerTimesArray.forEach(prayer => {
    console.log(`${prayer.name}: ${prayer.time} (${prayer.timeInMinutes} минут)`);
  });
  
  // Определяем, какая молитва является текущей - между ее временем и временем следующей молитвы
  for (let i = 0; i < prayerTimesArray.length; i++) {
    const nextIndex = i < prayerTimesArray.length - 1 ? i + 1 : 0;
    
    let endTimeMinutes;
    if (nextIndex === 0) {
      // Если это последняя молитва дня, то её конец - начало первой молитвы следующего дня
      endTimeMinutes = prayerTimesArray[nextIndex].timeInMinutes + 24 * 60;
    } else {
      endTimeMinutes = prayerTimesArray[nextIndex].timeInMinutes;
    }
    
    let startTimeMinutes = prayerTimesArray[i].timeInMinutes;
    
    // Обрабатываем случай, когда текущее время после полуночи (рано утром), но до первой молитвы дня
    if (i === 0 && locationTimeInMinutes < startTimeMinutes) {
      // Проверяем, не находимся ли мы между последней молитвой предыдущего дня и полуночью
      const lastPrayerIndex = prayerTimesArray.length - 1;
      // Время последней молитвы предыдущего дня (вчера)
      const lastPrayerStartTime = prayerTimesArray[lastPrayerIndex].timeInMinutes - 24 * 60;
      
      if (locationTimeInMinutes >= lastPrayerStartTime) {
        prayerTimesArray[lastPrayerIndex].isCurrent = true;
        foundCurrent = true;
        console.log("Текущая молитва (предыдущего дня):", prayerTimesArray[lastPrayerIndex].name);
      }
    }
    
    // Если сейчас между временем этой молитвы и временем следующей молитвы, то эта молитва текущая
    if (locationTimeInMinutes >= startTimeMinutes && locationTimeInMinutes < endTimeMinutes) {
      prayerTimesArray[i].isCurrent = true;
      foundCurrent = true;
      console.log("Текущая молитва:", prayerTimesArray[i].name);
    }
    
    // Обрабатываем случай, когда текущее время поздний вечер после последней молитвы дня
    if (i === prayerTimesArray.length - 1 && locationTimeInMinutes >= startTimeMinutes) {
      prayerTimesArray[i].isCurrent = true;
      foundCurrent = true;
      console.log("Текущая молитва (последняя в дне):", prayerTimesArray[i].name);
    }
    
    // Вычисляем оставшееся время до каждой молитвы (для отображения в интерфейсе)
    let timeToThisPrayer = prayerTimesArray[i].timeInMinutes - locationTimeInMinutes;
    // Если время молитвы уже прошло сегодня, значит, она наступит завтра
    if (timeToThisPrayer < 0) {
      timeToThisPrayer += 24 * 60;  // добавляем 24 часа (сутки)
    }
    
    prayerTimesArray[i].remainingTime = calculateRemainingTime(
      prayerTimesArray[i].timeInMinutes,
      locationTimeInMinutes
    );
  }
  
  // Сначала нормализуем время всех молитв, чтобы у каждой был правильный признак текущей или нет
  let activePrayerCount = 0;
  for (const prayer of prayerTimesArray) {
    if (prayer.isCurrent) {
      activePrayerCount++;
    }
  }
  
  // Если больше одной молитвы отмечены как текущие, это ошибка - оставляем только одну
  if (activePrayerCount > 1) {
    console.log("Обнаружено больше одной текущей молитвы, исправляем...");
    // Найдем последнюю молитву в дне, которая отмечена как текущая
    let lastCurrentPrayer = null;
    for (let i = prayerTimesArray.length - 1; i >= 0; i--) {
      if (prayerTimesArray[i].isCurrent) {
        lastCurrentPrayer = prayerTimesArray[i];
        break;
      }
    }
    
    // Сбрасываем статус у всех молитв и устанавливаем его только для последней
    for (const prayer of prayerTimesArray) {
      prayer.isCurrent = (prayer === lastCurrentPrayer);
    }
  }
  
  // Теперь находим следующую молитву - первую молитву после текущего времени
  // Сортируем все молитвы по времени до них от текущего момента
  const sortedByTimeToNextPrayer = [...prayerTimesArray]
    .map(prayer => {
      // Вычисляем, сколько минут осталось до этой молитвы от текущего времени
      let timeToNextPrayer = prayer.timeInMinutes - locationTimeInMinutes;
      // Если время молитвы уже прошло сегодня, значит эта молитва будет завтра
      if (timeToNextPrayer < 0) {
        timeToNextPrayer += 24 * 60; // Добавляем 24 часа (сутки)
      }
      return { ...prayer, timeToNextPrayer };
    })
    // Сортируем от ближайшей молитвы к самой дальней
    .sort((a, b) => a.timeToNextPrayer - b.timeToNextPrayer);
  
  // Сбрасываем признак следующей молитвы у всех молитв
  for (const prayer of prayerTimesArray) {
    prayer.isUpcoming = false;
  }
  
  // Находим первую молитву, которая не является текущей - это следующая молитва
  let nextPrayerFound = false;
  for (const sortedPrayer of sortedByTimeToNextPrayer) {
    if (!sortedPrayer.isCurrent) {
      // Находим эту молитву в оригинальном массиве и помечаем как следующую
      for (const prayer of prayerTimesArray) {
        if (prayer.name === sortedPrayer.name) {
          prayer.isUpcoming = true;
          foundUpcoming = true;
          nextPrayerFound = true;
          console.log("Следующая молитва:", prayer.name, "через", sortedPrayer.timeToNextPrayer, "минут");
          break;
        }
      }
      // Если нашли следующую молитву, прекращаем поиск
      if (nextPrayerFound) break;
    }
  }
  
  // Если не нашли следующую молитву (например, когда все молитвы отмечены как текущие),
  // берем первую молитву из отсортированного списка
  if (!nextPrayerFound && sortedByTimeToNextPrayer.length > 0) {
    const firstPrayer = sortedByTimeToNextPrayer[0];
    // Находим эту молитву в оригинальном массиве и помечаем как следующую
    for (const prayer of prayerTimesArray) {
      if (prayer.name === firstPrayer.name) {
        prayer.isUpcoming = true;
        foundUpcoming = true;
        console.log("Резервная следующая молитва:", prayer.name, "через", firstPrayer.timeToNextPrayer, "минут");
        break;
      }
    }
  }

  // Return the processed prayer times information
  return {
    date: date.gregorian.date,
    gregorianDate: `${date.gregorian.day} ${date.gregorian.month.en}, ${date.gregorian.year}`,
    islamicDate: `${date.hijri.day} ${date.hijri.month.en}, ${date.hijri.year}`,
    dayOfWeek: date.gregorian.weekday.en,
    location: meta.timezone,
    timezone: timezone,
    gmtOffset: gmtOffset,
    latitude: meta.latitude.toString(),
    longitude: meta.longitude.toString(),
    times: prayerTimesArray
  };
}

/**
 * Process the monthly prayer times API response
 * @param response Monthly prayer times API response
 * @returns Processed monthly prayer times data
 */
export function processMonthlyPrayerTimesResponse(response: MonthlyPrayerTimesApiResponse): MonthlyPrayerTimes {
  const { data } = response;
  
  // Extract the month and year information from the first day
  const firstDay = data[0];
  const gregorianMonth = firstDay.date.gregorian.month.en;
  const gregorianYear = parseInt(firstDay.date.gregorian.year);
  const islamicMonth = firstDay.date.hijri.month.en;
  const islamicYear = parseInt(firstDay.date.hijri.year);
  
  // Process each day's data
  const days: DailyPrayerTime[] = data.map(day => {
    return {
      gregorianDate: day.date.gregorian.date,
      islamicDate: day.date.hijri.month.en,
      gregorianDay: parseInt(day.date.gregorian.day),
      islamicDay: parseInt(day.date.hijri.day),
      gregorianMonth: day.date.gregorian.month.number,
      islamicMonth: day.date.hijri.month.number,
      fajr: formatTime(day.timings.Fajr),
      sunrise: formatTime(day.timings.Sunrise),
      dhuhr: formatTime(day.timings.Dhuhr),
      asr: formatTime(day.timings.Asr),
      maghrib: formatTime(day.timings.Maghrib),
      isha: formatTime(day.timings.Isha)
    };
  });
  
  return {
    gregorianMonth,
    gregorianYear,
    islamicMonth,
    islamicYear,
    days
  };
}

/**
 * Get the common predefined prayer calculation methods
 * @returns Array of calculation method options
 */
export function getCalculationMethods() {
  return [
    { id: 0, name: 'Muslim World League' },
    { id: 1, name: 'Islamic Society of North America (ISNA)' },
    { id: 2, name: 'Egyptian General Authority of Survey' },
    { id: 3, name: 'Umm Al-Qura University, Makkah' },
    { id: 4, name: 'University of Islamic Sciences, Karachi' },
    { id: 5, name: 'Institute of Geophysics, University of Tehran' },
    { id: 7, name: 'Shia Ithna-Ashari, Leva Institute, Qum' }
  ];
}
