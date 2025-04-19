import { FC } from "react";
import { PrayerTimes, PrayerTime } from "@shared/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

interface PrayerTimesDisplayProps {
  prayerTimes?: PrayerTimes;
  isLoading: boolean;
}

const PrayerTimeCard: FC<{ prayer: PrayerTime; isCurrent: boolean }> = ({ prayer, isCurrent }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Translate the prayer name and labels using the new translation system
  const prayerName = t(prayer.name.toLowerCase());
  const currentText = t('current');
  const upcomingText = t('upcoming');
  
  // Format the remaining time with translations
  let nowText = '';
  
  if (isCurrent) {
    // Текущая молитва
    nowText = t('now');
  } else if (prayer.isUpcoming) {
    // Следующая молитва
    nowText = t('next');
  } else if (prayer.remainingTime) {
    // Оставшееся время до молитвы
    try {
      const timeData = JSON.parse(prayer.remainingTime);
      if (timeData.format === 'minutes_only') {
        nowText = t('in_x_minutes').replace('{minutes}', timeData.minutes.toString());
      } else {
        // Format: "In X hours Y min"
        if (timeData.minutes > 0) {
          nowText = t('in_x_hours_y_minutes')
            .replace('{hours}', timeData.hours.toString())
            .replace('{minutes}', timeData.minutes.toString());
        } else {
          nowText = t('in_x_hours')
            .replace('{hours}', timeData.hours.toString());
        }
      }
    } catch (e) {
      // Fallback if there's an error parsing the JSON
      nowText = prayer.remainingTime;
    }
  }

  return (
    <div className="prayer-time-card rounded-lg overflow-hidden transition-all duration-300 transform card-hover"
      style={{
        backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isCurrent 
          ? 'var(--accent-color)' 
          : theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        boxShadow: isCurrent 
          ? theme === 'dark' 
            ? 'var(--shadow-md), 0 0 15px rgba(212, 175, 55, 0.15)' 
            : 'var(--shadow-md), 0 0 15px rgba(13, 92, 61, 0.1)'
          : 'var(--shadow-sm)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {isCurrent && (
        <div className="absolute top-0 right-0 h-6 w-6 z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 -mt-4 -mr-4 rotate-45 bg-green"
              style={{ 
                backgroundColor: theme === 'dark' ? 'var(--accent-color)' : 'var(--primary-color)',
                opacity: 0.7
              }}>
          </div>
        </div>
      )}

      <div className="px-3 py-2 text-center relative"
        style={{
          backgroundColor: isCurrent
            ? theme === 'dark' 
              ? 'rgba(212, 175, 55, 0.15)' 
              : 'rgba(212, 175, 55, 0.05)'
            : theme === 'dark' 
              ? 'rgba(255, 255, 255, 0.03)' 
              : 'rgba(0, 0, 0, 0.02)',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: isCurrent
            ? theme === 'dark' 
              ? 'rgba(212, 175, 55, 0.2)' 
              : 'rgba(212, 175, 55, 0.1)'
            : theme === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(0, 0, 0, 0.05)'
        }}
      >
        {isCurrent && (
          <span className="absolute top-0 left-0 h-full w-1 animate-pulse" 
                style={{ 
                  backgroundColor: theme === 'dark' ? 'var(--accent-color)' : 'var(--primary-color)'
                }}>
          </span>
        )}
        
        <h3 className="text-base sm:text-lg font-medium flex items-center justify-center" 
          style={{ 
            color: theme === 'dark' ? 'var(--foreground)' : 'var(--primary-color)'
          }}
        >
          {isCurrent && (
            <span className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse" 
                  style={{ backgroundColor: theme === 'dark' ? 'var(--accent-color)' : 'var(--primary-color)' }}></span>
          )}
          {prayerName}
        </h3>
        
        <div className="flex justify-center gap-1 mt-1 flex-wrap">
          {isCurrent && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-full glass-effect"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.1)',
                color: 'var(--accent-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {currentText}
            </span>
          )}
          
          {prayer.isUpcoming && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-full glass-effect"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(13, 92, 61, 0.1)',
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'var(--primary-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {upcomingText}
            </span>
          )}
        </div>
      </div>
      
      <div className="px-3 py-4 text-center">
        <p className="text-xl sm:text-2xl font-medium flex items-center justify-center" 
          style={{ 
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
          }}
        >
          {isCurrent && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 opacity-70" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {prayer.timeFormatted}
        </p>
        <p className="text-xs mt-1 font-medium" 
          style={{ 
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
          }}
        >
          {nowText}
        </p>
      </div>
    </div>
  );
};

const PrayerTimesDisplay: FC<PrayerTimesDisplayProps> = ({ prayerTimes, isLoading }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Use the updated translation system
  const todayScheduleTitle = t('daily_prayer_times');
  const selectLocationText = t('select_location');
  
  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-medium" 
            style={{ color: 'var(--primary-color)' }}>
            {todayScheduleTitle}
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            <div className="h-px w-12" style={{ backgroundColor: 'var(--accent-color)' }}></div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
              }}>
              <div className="px-3 py-2 text-center"
                style={{
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                }}>
                <Skeleton className="h-5 w-16 mx-auto" />
              </div>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-7 w-20 mx-auto mb-2" />
                <Skeleton className="h-3 w-14 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!prayerTimes || !prayerTimes.times) {
    return (
      <section className="mb-8">
        <Card className="p-4 text-center"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)'
          }}>
          <p>{selectLocationText}</p>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-8 animate-fade-in">
      {/* Today's Date */}
      <div className="mb-6">
        <h2 className="text-xl font-medium flex items-center" 
          style={{ color: 'var(--primary-color)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {todayScheduleTitle}
        </h2>
        <div className="flex items-center space-x-2 mt-1">
          <div className="h-px w-12" style={{ backgroundColor: 'var(--accent-color)' }}></div>
          <div className="text-sm flex items-center" 
            style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" 
                  style={{ backgroundColor: 'var(--accent-color)' }}></span>
            {prayerTimes.dayOfWeek}
          </div>
        </div>
      </div>

      {/* Prayer Time Cards - 2 columns on all screens */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up">
        {prayerTimes.times.map((prayer, index) => (
          <div key={prayer.name} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <PrayerTimeCard 
              prayer={prayer} 
              isCurrent={prayer.isCurrent} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PrayerTimesDisplay;
