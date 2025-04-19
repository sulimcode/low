import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from '../locales/translations';

// Типы языков (12 самых популярных языков мира)
export type Language = 
  | 'en' // English
  | 'zh' // Chinese (Mandarin)
  | 'hi' // Hindi
  | 'es' // Spanish
  | 'fr' // French
  | 'ar' // Arabic
  | 'bn' // Bengali
  | 'ru' // Russian
  | 'pt' // Portuguese
  | 'id' // Indonesian
  | 'ur' // Urdu
  | 'de'; // German

// Информация о языках для отображения
export const languageInfo: Record<Language, { name: string, nativeName: string, flag: string }> = {
  'en': { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  'zh': { name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  'ar': { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  'bn': { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  'ru': { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  'id': { name: 'Indonesian', nativeName: 'Indonesia', flag: '🇮🇩' },
  'ur': { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  'de': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
};

// Интерфейс контекста
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Функция перевода
  languageInfo: typeof languageInfo;
}

// Создаем контекст
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Провайдер контекста
// Функция для сохранения настроек языка на сервере
async function saveUserLanguagePreference(language: Language) {
  try {
    await fetch('/api/preferences/language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language }),
    });
    console.log('Language preference saved on server');
  } catch (error) {
    console.error('Error saving language preference:', error);
    // При ошибке запроса к серверу, всё равно сохраняем в localStorage
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Инициализируем язык из localStorage или используем 'en' по умолчанию
  const [language, setLanguage] = useState<Language>(() => {
    // Попробуем получить язык из localStorage
    const savedLanguage = localStorage.getItem('prayer-app-language');
    
    // Если есть сохраненный язык, используем его
    if (savedLanguage && savedLanguage in languageInfo) {
      return savedLanguage as Language;
    }
    
    // Или попробуем определить язык браузера
    try {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang in languageInfo) {
        return browserLang as Language;
      }
    } catch (e) {
      console.error('Error detecting browser language:', e);
    }
    
    // По умолчанию используем русский
    return 'ru';
  });

  // При первой загрузке попробуем получить язык с сервера
  React.useEffect(() => {
    const fetchLanguageFromServer = async () => {
      try {
        const response = await fetch('/api/preferences', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        
        if (data && data.language && data.language in languageInfo) {
          setLanguage(data.language as Language);
        }
      } catch (error) {
        console.log('Using local language preference');
        // При ошибке запроса к серверу используем язык из localStorage
      }
    };
    
    fetchLanguageFromServer();
  }, []);

  // Эффект для сохранения выбранного языка
  React.useEffect(() => {
    // Сохраняем локально
    localStorage.setItem('prayer-app-language', language);
    
    // Сохраняем на сервере
    saveUserLanguagePreference(language);
  }, [language]);

  // Функция перевода
  const t = (key: string): string => {
    if (!translations[language][key]) {
      console.warn(`Translation key "${key}" not found for language ${language}`);
      // Вернем английский перевод если нет для текущего языка
      return translations['en'][key] || key;
    }
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageInfo }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования контекста
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};