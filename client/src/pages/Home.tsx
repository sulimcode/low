import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocationSelector from "@/components/LocationSelector";
import PrayerTimesDisplay from "@/components/PrayerTimesDisplay";
import NextPrayerCountdown from "@/components/NextPrayerCountdown";
import MonthlySchedule from "@/components/MonthlySchedule";
import { Location, PrayerTimes, MonthlyPrayerTimes } from "@shared/types";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "../contexts/LanguageContext";
import { getLocationByCoordinates, getPopularLocations, searchLocations, getLocationByIp } from "../lib/api";

export default function Home() {
  const { language } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // Fetch prayer times for today
  const { data: prayerTimes, isLoading: prayerTimesLoading } = useQuery<PrayerTimes>({
    queryKey: [`/api/prayer-times?latitude=${selectedLocation?.latitude || ''}&longitude=${selectedLocation?.longitude || ''}&language=${language}`],
    enabled: !!selectedLocation,
  });

  // Fetch monthly prayer times
  const { data: monthlyPrayerTimes, isLoading: monthlyLoading } = useQuery<MonthlyPrayerTimes>({
    queryKey: [`/api/prayer-times/monthly?latitude=${selectedLocation?.latitude || ''}&longitude=${selectedLocation?.longitude || ''}&month=${currentMonth}&year=${currentYear}&language=${language}`],
    enabled: !!selectedLocation,
  });

  // Fetch user's location based on IP on first load
  useEffect(() => {
    const fetchDefaultLocation = async () => {
      try {
        // Используем обновленную функцию с поддержкой языка
        const data = await getLocationByIp(language);
        if (data) {
          setSelectedLocation(data);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    // Refetch location when language changes to update display names
    fetchDefaultLocation();
    
  }, [language]);

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleGeolocation = async () => {
    if (navigator.geolocation) {
      try {
        const position: GeolocationPosition = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        // Use our updated API function with language parameter
        const location = await getLocationByCoordinates(
          position.coords.latitude,
          position.coords.longitude,
          language
        );
        
        setSelectedLocation(location);
      } catch (error) {
        console.error('Error getting geolocation:', error);
      }
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Header 
        gregorianDate={prayerTimes?.gregorianDate} 
        islamicDate={prayerTimes?.islamicDate}
        isLoading={prayerTimesLoading}
      />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <LocationSelector 
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          onGeolocationRequest={handleGeolocation}
        />
        
        {/* Next Prayer Countdown */}
        {prayerTimes && (
          <NextPrayerCountdown
            prayerTimes={prayerTimes.times}
            isLoading={prayerTimesLoading}
          />
        )}
        
        <PrayerTimesDisplay 
          prayerTimes={prayerTimes}
          isLoading={prayerTimesLoading}
        />
        
        <MonthlySchedule 
          monthlyData={monthlyPrayerTimes}
          isLoading={monthlyLoading}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      </main>
      
      <Footer />
    </div>
  );
}
