import { FC } from "react";
import { MonthlyPrayerTimes } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface MonthlyScheduleProps {
  monthlyData?: MonthlyPrayerTimes;
  isLoading: boolean;
  currentMonth: number;
  currentYear: number;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const MonthlySchedule: FC<MonthlyScheduleProps> = ({ 
  monthlyData, 
  isLoading, 
  currentMonth, 
  currentYear, 
  onPreviousMonth, 
  onNextMonth 
}) => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  // Translate the monthly schedule title
  const monthlyScheduleTitle = t('monthly_schedule');
  
  // Translate the prev and next month buttons
  const prevMonthText = t('previous_month');
  const nextMonthText = t('next_month');
  
  // Translate table headers
  const dateText = t('date');
    
  const fajrText = t('fajr');
  const sunriseText = t('sunrise');
  const dhuhrText = t('dhuhr');
  const asrText = t('asr');
  const maghribText = t('maghrib');
  const ishaText = t('isha');
  
  // Format month name based on current language
  const getMonthName = (month: number, year: number) => {
    return new Date(year, month - 1, 1).toLocaleString(
      language === 'ru' ? 'ru-RU' : 
      language === 'en' ? 'en-US' :
      language === 'ar' ? 'ar-SA' :
      language === 'fr' ? 'fr-FR' :
      language === 'es' ? 'es-ES' :
      language === 'de' ? 'de-DE' :
      language === 'zh' ? 'zh-CN' :
      language === 'hi' ? 'hi-IN' :
      language === 'bn' ? 'bn-BD' :
      language === 'pt' ? 'pt-PT' :
      language === 'id' ? 'id-ID' :
      language === 'ur' ? 'ur-PK' :
      'en-US', 
      { month: 'long' }
    );
  };
  
  const monthName = getMonthName(currentMonth, currentYear);

  if (isLoading) {
    return (
      <section>
        <div className="rounded-lg shadow-md p-4 transition-all"
          style={{
            backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            boxShadow: theme === 'dark' 
              ? '0 4px 20px rgba(0, 0, 0, 0.25)' 
              : '0 2px 10px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-center mb-4">
            <Calendar 
              size={18} 
              className="mr-2"
              style={{ color: 'var(--accent-color)' }} 
            />
            <h2 className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>
              {monthlyScheduleTitle}
            </h2>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-50"
              style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)' }}
              disabled
            >
              <ChevronLeft size={16} className="mr-1" />
              {prevMonthText}
            </Button>
            <Skeleton className="h-6 w-32 rounded-md" 
              style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' 
              }}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-50"
              style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)' }}
              disabled
            >
              {nextMonthText}
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar rounded-md">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr style={{
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                }}>
                  <th className="py-2 px-2 text-left font-medium rounded-tl-md">{dateText}</th>
                  <th className="py-2 px-2 text-center font-medium">{fajrText}</th>
                  <th className="py-2 px-2 text-center font-medium">{sunriseText}</th>
                  <th className="py-2 px-2 text-center font-medium">{dhuhrText}</th>
                  <th className="py-2 px-2 text-center font-medium">{asrText}</th>
                  <th className="py-2 px-2 text-center font-medium">{maghribText}</th>
                  <th className="py-2 px-2 text-center font-medium rounded-tr-md">{ishaText}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} style={{
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    borderBottomColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
                  }}>
                    <td className="py-2 px-2">
                      <Skeleton className="h-4 w-24 mb-1 rounded" 
                        style={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' 
                        }}
                      />
                      <Skeleton className="h-3 w-16 rounded" 
                        style={{ 
                          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' 
                        }}
                      />
                    </td>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <td key={cellIndex} className="py-2 px-2 text-center">
                        <Skeleton className="h-4 w-12 mx-auto rounded" 
                          style={{ 
                            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' 
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (!monthlyData) {
    return null;
  }

  return (
    <section className="animate-fade-in">
      <div className="rounded-lg shadow-md p-4 transition-all card"
        style={{
          backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          boxShadow: 'var(--shadow)'
        }}
      >
        <div className="flex items-center mb-4">
          <Calendar 
            size={18} 
            className="mr-2"
            style={{ color: 'var(--accent-color)' }} 
          />
          <h2 className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>
            {monthlyScheduleTitle}
          </h2>
        </div>
        
        {/* Calendar Controls */}
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="transition-all"
            style={{
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'var(--primary-color)',
              borderRadius: '0.375rem',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(13, 92, 61, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={onPreviousMonth}
          >
            <ChevronLeft size={16} className="mr-1" />
            {prevMonthText}
          </Button>
          
          <h3 className="text-lg font-medium flex items-center"
            style={{ 
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.375rem',
              boxShadow: theme === 'dark' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <span className="mr-1" style={{ color: 'var(--accent-color)' }}>{monthlyData.gregorianMonth}</span>
            <span>{currentYear}</span>
          </h3>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="transition-all"
            style={{
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'var(--primary-color)',
              borderRadius: '0.375rem',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(13, 92, 61, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={onNextMonth}
          >
            {nextMonthText}
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        {/* Calendar Table */}
        <div className="overflow-x-auto custom-scrollbar rounded-md shadow-inner animate-fade-in" 
             style={{ 
               backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.02)',
               boxShadow: 'var(--shadow-sm)'
             }}>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{
                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'var(--accent-light)',
                color: theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'var(--primary-color)'
              }}>
                <th className="py-3 px-2 text-left font-medium rounded-tl-md">{dateText}</th>
                <th className="py-3 px-2 text-center font-medium">{fajrText}</th>
                <th className="py-3 px-2 text-center font-medium">{sunriseText}</th>
                <th className="py-3 px-2 text-center font-medium">{dhuhrText}</th>
                <th className="py-3 px-2 text-center font-medium">{asrText}</th>
                <th className="py-3 px-2 text-center font-medium">{maghribText}</th>
                <th className="py-3 px-2 text-center font-medium rounded-tr-md">{ishaText}</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.days.map((day, index) => {
                // Определяем, является ли день сегодняшним
                const isToday = day.gregorianDay === new Date().getDate() && 
                                currentMonth === new Date().getMonth() + 1 && 
                                currentYear === new Date().getFullYear();
                
                // Получаем название месяца для дня, на случай если отображаем несколько месяцев
                const dayMonthName = getMonthName(day.gregorianMonth, currentYear);
                
                return (
                  <tr 
                    key={index} 
                    className="transition-all duration-200"
                    style={{
                      borderBottomWidth: '1px',
                      borderBottomStyle: 'solid',
                      borderBottomColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      backgroundColor: isToday
                        ? theme === 'dark' 
                          ? 'rgba(212, 175, 55, 0.15)' 
                          : 'rgba(13, 92, 61, 0.08)'
                        : 'transparent',
                      position: 'relative'
                    }}
                    onMouseOver={(e) => {
                      if (!isToday) {
                        e.currentTarget.style.backgroundColor = theme === 'dark' 
                          ? 'rgba(255, 255, 255, 0.03)' 
                          : 'rgba(0, 0, 0, 0.01)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isToday) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <td className="py-2 px-2 relative">
                      {isToday && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 animate-pulse"
                              style={{ 
                                backgroundColor: theme === 'dark' ? 'var(--accent-color)' : 'var(--primary-color)'
                              }}>
                        </span>
                      )}
                      <div className="font-medium flex items-center" style={{ 
                        color: isToday 
                          ? theme === 'dark' 
                            ? 'var(--accent-color)' 
                            : 'var(--primary-color)'
                          : theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.9)' 
                            : 'rgba(0, 0, 0, 0.8)'
                      }}>
                        {isToday && (
                          <span className="mr-1 text-xs px-1.5 py-0.5 rounded-full" 
                                style={{ 
                                  backgroundColor: theme === 'dark' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(13, 92, 61, 0.1)'
                                }}>
                            {t('today')}
                          </span>
                        )}
                        {day.gregorianDay} {dayMonthName}
                      </div>
                      <div className="text-xs flex items-center mt-0.5" style={{ 
                        color: isToday 
                          ? 'var(--accent-color)' 
                          : theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.5)' 
                            : 'rgba(0, 0, 0, 0.5)'
                      }}>
                        {isToday && (
                          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" 
                                style={{ backgroundColor: 'var(--accent-color)' }}></span>
                        )}
                        {day.islamicDay} {day.islamicDate}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center" style={{
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
                    }}>{day.fajr}</td>
                    <td className="py-2 px-2 text-center" style={{
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
                    }}>{day.sunrise}</td>
                    <td className="py-2 px-2 text-center" style={{
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
                    }}>{day.dhuhr}</td>
                    <td className="py-2 px-2 text-center" style={{
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
                    }}>{day.asr}</td>
                    <td className="py-2 px-2 text-center" style={{
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
                    }}>{day.maghrib}</td>
                    <td className="py-2 px-2 text-center" style={{
                      color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
                    }}>{day.isha}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default MonthlySchedule;
