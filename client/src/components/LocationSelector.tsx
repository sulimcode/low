import { FC, useState } from "react";
import { Location } from "@shared/types";
import { useQuery } from "@tanstack/react-query";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { MapPin, Compass, Search, AlertCircle } from "lucide-react";
import { searchLocations, getPopularLocations } from "../lib/api";

interface LocationSelectorProps {
  selectedLocation: Location | null;
  onLocationChange: (location: Location) => void;
  onGeolocationRequest: () => Promise<void>;
}

const LocationSelector: FC<LocationSelectorProps> = ({ 
  selectedLocation, 
  onLocationChange, 
  onGeolocationRequest 
}) => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searchError, setSearchError] = useState("");

  // Fetch popular locations based on current language
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: [`popular-locations-${language}`],
    queryFn: () => getPopularLocations(language)
  });

  const handleLocationSelect = (locationId: string) => {
    const location = locations.find((loc) => loc.value === locationId);
    if (location) {
      onLocationChange(location);
      setSearchResults([]);
    }
  };

  const handleGeolocation = async () => {
    setIsLoading(true);
    try {
      await onGeolocationRequest();
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!cityInput) {
      setSearchError(language === 'ru' ? "Пожалуйста, введите название города" : "Please enter a city name");
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const query = `${cityInput}${countryInput ? ', ' + countryInput : ''}`;
      
      // Use our direct API function with language support
      const searchData = await searchLocations(query, language);
      
      if (searchData && searchData.length > 0) {
        setSearchResults(searchData);
        // Automatically select the first result
        onLocationChange(searchData[0]);
      } else {
        setSearchError(language === 'ru' 
          ? "Место не найдено. Попробуйте другой запрос." 
          : "Location not found. Please try a different search.");
      }
    } catch (error) {
      setSearchError(language === 'ru'
        ? "Произошла ошибка при поиске. Пожалуйста, попробуйте снова."
        : "An error occurred during search. Please try again.");
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleResultSelect = (location: Location) => {
    onLocationChange(location);
    setSearchResults([]);
  };

  // Add translations for this component
  const prayerTimesTitle = language === 'ru' ? 'Время намаза' : 
    language === 'en' ? 'Prayer Times' :
    language === 'ar' ? 'أوقات الصلاة' :
    language === 'fr' ? 'Horaires de prière' :
    'Prayer Times';
    
  const showingTimesFor = language === 'ru' ? 'Показаны времена для' :
    language === 'en' ? 'Showing times for' :
    language === 'ar' ? 'عرض الأوقات لـ' :
    language === 'fr' ? 'Affichage des horaires pour' :
    'Showing times for';
    
  const selectLocationText = language === 'ru' ? 'Выберите местоположение для просмотра времен намаза' :
    language === 'en' ? 'Select a location to view prayer times' :
    language === 'ar' ? 'اختر موقعًا لعرض أوقات الصلاة' :
    language === 'fr' ? 'Sélectionnez un lieu pour voir les horaires de prière' :
    'Select a location to view prayer times';
    
  const enterCityText = language === 'ru' ? 'Введите город' :
    language === 'en' ? 'Enter city' :
    language === 'ar' ? 'أدخل المدينة' :
    language === 'fr' ? 'Entrez la ville' :
    'Enter city';
    
  const countryOptionalText = language === 'ru' ? 'Страна (опционально)' :
    language === 'en' ? 'Country (optional)' :
    language === 'ar' ? 'البلد (اختياري)' :
    language === 'fr' ? 'Pays (facultatif)' :
    'Country (optional)';
    
  const searchingText = language === 'ru' ? 'Поиск...' :
    language === 'en' ? 'Searching...' :
    language === 'ar' ? 'جاري البحث...' :
    language === 'fr' ? 'Recherche...' :
    'Searching...';
    
  const searchText = language === 'ru' ? 'Поиск' :
    language === 'en' ? 'Search' :
    language === 'ar' ? 'بحث' :
    language === 'fr' ? 'Rechercher' :
    'Search';
    
  const searchResultsText = language === 'ru' ? 'Результаты поиска:' :
    language === 'en' ? 'Search results:' :
    language === 'ar' ? 'نتائج البحث:' :
    language === 'fr' ? 'Résultats de recherche:' :
    'Search results:';
    
  const locatingText = language === 'ru' ? 'Определение...' :
    language === 'en' ? 'Locating...' :
    language === 'ar' ? 'تحديد الموقع...' :
    language === 'fr' ? 'Localisation...' :
    'Locating...';
    
  const myLocationText = language === 'ru' ? 'Моё местоположение' :
    language === 'en' ? 'My location' :
    language === 'ar' ? 'موقعي' :
    language === 'fr' ? 'Ma position' :
    'My location';
    
  const popularCitiesText = t('popular_locations');
  
  const { theme } = useTheme();

  return (
    <section className="mb-8">
      <div className="rounded-lg shadow-md p-4 md:p-6 transition-all"
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
        <div className="flex flex-col">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2" 
              style={{ color: 'var(--primary-color)' }}>
              {prayerTimesTitle}
            </h2>
            {selectedLocation ? (
              <p className="text-sm flex items-center" 
                style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                <MapPin size={16} className="mr-1 inline-block" style={{ color: 'var(--accent-color)' }} />
                {showingTimesFor} <span className="font-medium ml-1">{selectedLocation.name}, {selectedLocation.country}</span>
              </p>
            ) : (
              <p className="text-sm" 
                style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}>
                {selectLocationText}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Custom Location Search */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  placeholder={enterCityText}
                  className="flex-1"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f8f8',
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
                  }}
                />
                <Input
                  type="text"
                  placeholder={countryOptionalText}
                  className="flex-1"
                  value={countryInput}
                  onChange={(e) => setCountryInput(e.target.value)}
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f8f8',
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
                  }}
                />
                <Button 
                  onClick={handleSearch} 
                  className="flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: '#ffffff',
                    boxShadow: theme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(13, 92, 61, 0.2)'
                  }}
                  disabled={searchLoading}
                >
                  {searchLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>{searchingText}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Search size={16} className="mr-1.5" />
                      <span>{searchText}</span>
                    </div>
                  )}
                </Button>
              </div>
              
              {searchError && (
                <p className="text-sm flex items-center mt-1" style={{ color: '#f44336' }}>
                  <AlertCircle size={14} className="mr-1.5" />
                  {searchError}
                </p>
              )}
              
              {searchResults.length > 0 && (
                <div className="rounded-md p-2 max-h-48 overflow-y-auto custom-scrollbar"
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    boxShadow: theme === 'dark' 
                      ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {searchResults.map((location, index) => (
                    <div 
                      key={index}
                      className="px-3 py-2 cursor-pointer rounded text-sm flex items-center transition-colors"
                      style={{
                        backgroundColor: 'transparent',
                        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                        borderBottom: index < searchResults.length - 1 
                          ? theme === 'dark' 
                            ? '1px solid rgba(255, 255, 255, 0.05)' 
                            : '1px solid rgba(0, 0, 0, 0.05)'
                          : 'none'
                      }}
                      onClick={() => handleResultSelect(location)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.03)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <MapPin size={14} className="mr-2 flex-shrink-0" 
                        style={{ color: 'var(--accent-color)' }} />
                      <span>{location.name}, {location.country}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 md:flex-col justify-end">
              {/* Popular Locations */}
              <Select onValueChange={handleLocationSelect} value={selectedLocation?.value}>
                <SelectTrigger className="w-full"
                  style={{
                    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f8f8',
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)'
                  }}
                >
                  <SelectValue placeholder={popularCitiesText} />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--card-bg)' : '#ffffff',
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
                  }}
                >
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}
                      style={{
                        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      <div className="flex items-center">
                        <MapPin size={12} className="mr-1.5 flex-shrink-0" 
                          style={{ color: 'var(--accent-color)' }} />
                        <span>{location.name}, {location.country}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Geolocation Button */}
              <Button 
                onClick={handleGeolocation} 
                variant="outline"
                className="flex items-center justify-center transition-all"
                style={{
                  borderColor: 'var(--primary-color)',
                  borderWidth: '1px',
                  color: theme === 'dark' ? '#ffffff' : 'var(--primary-color)',
                  backgroundColor: theme === 'dark' ? 'rgba(13, 92, 61, 0.15)' : 'transparent'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent rounded-full"
                      style={{ borderColor: `${theme === 'dark' ? '#ffffff' : 'var(--primary-color)'} transparent ${theme === 'dark' ? '#ffffff' : 'var(--primary-color)'} ${theme === 'dark' ? '#ffffff' : 'var(--primary-color)'}` }}
                    ></div>
                    <span>{locatingText}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Compass size={16} className="mr-1.5" />
                    <span>{myLocationText}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSelector;
