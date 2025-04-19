import { FC, useState, useEffect } from "react";
import { PrayerTime } from "@shared/types";
import { useLanguage } from "../contexts/LanguageContext";

interface NextPrayerCountdownProps {
  prayerTimes: PrayerTime[] | undefined;
  isLoading: boolean;
}

const NextPrayerCountdown: FC<NextPrayerCountdownProps> = ({ prayerTimes, isLoading }) => {
  const { t } = useLanguage();
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [hoursRemaining, setHoursRemaining] = useState<number>(0);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    if (!prayerTimes || prayerTimes.length === 0) return;
    
    // Логируем все молитвы для отладки
    console.log("Все молитвы:", prayerTimes.map(p => 
      `${p.name}: ${p.time} (${p.timeInMinutes}min) isCurrent:${p.isCurrent} isUpcoming:${p.isUpcoming}`
    ));
    
    // Находим молитву, отмеченную как следующая
    const upcomingPrayer = prayerTimes.find(prayer => prayer.isUpcoming);
    
    if (!upcomingPrayer) {
      // Если не нашли молитву с флагом isUpcoming, найдем первую молитву после текущего времени
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      
      // Сортируем молитвы по времени до них
      const sortedPrayers = [...prayerTimes]
        .map(prayer => {
          let timeToNextPrayer = prayer.timeInMinutes - currentTimeInMinutes;
          if (timeToNextPrayer < 0) {
            timeToNextPrayer += 24 * 60; // Если молитва уже прошла сегодня, добавляем 24 часа
          }
          return { ...prayer, timeToNextPrayer };
        })
        .sort((a, b) => a.timeToNextPrayer - b.timeToNextPrayer);
      
      // Находим первую молитву, которая не является текущей
      const calculatedNextPrayer = sortedPrayers.find(prayer => !prayer.isCurrent);
      
      if (calculatedNextPrayer) {
        console.log("Вычисленная следующая молитва:", calculatedNextPrayer.name, calculatedNextPrayer.time);
        setNextPrayer(calculatedNextPrayer);
        
        // Функция обновления времени
        const updateTime = () => updateRemainingTime(calculatedNextPrayer);
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
      } else if (sortedPrayers.length > 0) {
        // Если все молитвы отмечены как текущие, берём первую из отсортированного списка
        console.log("Резервная следующая молитва:", sortedPrayers[0].name);
        setNextPrayer(sortedPrayers[0]);
        
        // Функция обновления времени
        const updateTime = () => updateRemainingTime(sortedPrayers[0]);
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
      }
    } else {
      console.log("Следующая молитва из флагов:", upcomingPrayer.name, upcomingPrayer.time);
      setNextPrayer(upcomingPrayer);
      
      // Функция обновления времени
      const updateTime = () => updateRemainingTime(upcomingPrayer);
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);
  
  // Функция для обновления оставшегося времени до молитвы
  const updateRemainingTime = (prayer: PrayerTime) => {
    // Используем timeInMinutes из молитвы
    const prayerTimeInMinutes = prayer.timeInMinutes;
    
    // Текущее время в минутах с начала дня (время пользователя)
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    const currentTimeInMinutes = currentHours * 60 + currentMinutes;
    
    // Разница в минутах между временем молитвы и текущим временем
    let diffMinutes = prayerTimeInMinutes - currentTimeInMinutes;
    
    // Если разница отрицательная, значит молитва будет завтра
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60; // Добавляем 24 часа в минутах (полные сутки)
    }
    
    // Корректируем значение секунд для более точного отсчета
    let adjustedDiffMinutes = diffMinutes;
    if (currentSeconds > 0) {
      // Вычитаем уже прошедшие в текущей минуте секунды
      adjustedDiffMinutes = diffMinutes - 1 + (60 - currentSeconds) / 60;
    }
    
    // Переводим в часы, минуты и секунды для отображения
    const hours = Math.floor(adjustedDiffMinutes / 60);
    const minutes = Math.floor(adjustedDiffMinutes % 60);
    const seconds = currentSeconds > 0 ? (60 - currentSeconds) : 0;
    
    setHoursRemaining(hours);
    setMinutesRemaining(minutes);
    setSecondsRemaining(seconds);
    
    // Форматируем время с ведущими нулями для отображения в интерфейсе
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    setTimeRemaining(formattedTime);
  };

  // Компонент загрузки
  if (isLoading) {
    return (
      <div className="rounded-lg shadow-lg p-6 mb-8 animate-pulse relative overflow-hidden"
        style={{ 
          backgroundColor: 'var(--primary-color)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--primary-color)',
          opacity: 0.9,
          boxShadow: 'var(--shadow-md)'
        }}>
        {/* Декоративные элементы для скелетона */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10"
             style={{
               background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)'
             }}></div>
             
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
             style={{
               background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)'
             }}></div>
        
        {/* Скелетоны UI элементов */}
        <div className="flex items-center mb-4">
          <div className="h-5 w-5 rounded-full mr-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
          <div className="h-6 rounded w-1/3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <div className="h-12 w-2 rounded mr-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
              <div className="h-10 rounded w-36" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
            </div>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full mr-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
              <div className="h-7 rounded w-28" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <div className="h-4 rounded w-24 mb-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
            <div className="h-8 rounded w-20 mb-2 mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
            <div className="flex items-center justify-center">
              <div className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
              <div className="h-4 rounded w-16" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Если нет данных о следующей молитве, ничего не показываем
  if (!nextPrayer) return null;

  // Получаем переводы
  const nextPrayerText = t('next_prayer');
  const remainingTimeText = t('time_remaining');
  const prayerName = t(nextPrayer.name.toLowerCase());

  // Получаем отформатированную метку времени на основе оставшегося времени
  const getTimeLabel = () => {
    if (hoursRemaining > 0 && minutesRemaining > 0) {
      return t('in_x_hours_y_minutes')
        .replace('{hours}', hoursRemaining.toString())
        .replace('{minutes}', minutesRemaining.toString());
    } else if (hoursRemaining > 0) {
      return t('in_x_hours').replace('{hours}', hoursRemaining.toString());
    } else {
      return t('in_x_minutes').replace('{minutes}', minutesRemaining.toString());
    }
  };

  // Рендерим блок с информацией о следующей молитве
  return (
    <div className="rounded-lg shadow-lg p-6 mb-8 animate-fade-in relative overflow-hidden transition-all duration-300 hover:shadow-xl"
      style={{ 
        backgroundColor: 'var(--primary-color)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--primary-color)',
        boxShadow: 'var(--shadow-md)'
      }}>
      {/* Декоративные элементы */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30"
           style={{
             background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)'
           }}></div>
           
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-20"
           style={{
             background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)'
           }}></div>
      
      {/* Декоративная мечеть */}
      <div className="absolute top-2 right-2 opacity-10 text-4xl">
        🕌
      </div>
      
      <h3 className="text-lg font-medium mb-3 relative flex items-center" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {nextPrayerText}
      </h3>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between relative">
        <div className="mb-4 md:mb-0">
          <div className="text-3xl font-bold mb-2 flex items-center" style={{ color: '#FFFFFF' }}>
            <span className="inline-block w-2 h-12 mr-2 rounded" 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                  }}></span>
            {prayerName}
          </div>
          <div className="text-xl flex items-center" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {nextPrayer.timeFormatted}
          </div>
        </div>
        
        <div className="p-4 rounded-lg glass-effect transition-all duration-300" 
          style={{ 
            boxShadow: 'var(--shadow)',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.1)'
          }}>
          <div className="text-sm mb-1" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{remainingTimeText}</div>
          <div className="text-2xl font-semibold flex items-center justify-center" style={{ color: '#FFFFFF' }}>
            {getTimeLabel()}
          </div>
          <div className="text-sm font-mono mt-1.5 flex items-center justify-center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <span className="inline-block w-2 h-2 rounded-full mr-1.5 animate-pulse" 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 0 5px rgba(255, 255, 255, 0.5)'
                  }}></span>
            {timeRemaining}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextPrayerCountdown;