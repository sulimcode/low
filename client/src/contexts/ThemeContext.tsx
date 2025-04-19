import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Функция для сохранения настроек на сервере
async function saveUserThemePreference(theme: Theme) {
  try {
    await apiRequest('POST', '/api/preferences/theme', { theme });
    console.log('Theme preference saved on server');
  } catch (error) {
    console.error('Error saving theme preference:', error);
    // При ошибке запроса к серверу, всё равно сохраняем в localStorage
  }
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Инициализируем тему из localStorage или используем 'light' по умолчанию
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('prayer-app-theme');
    return (savedTheme as Theme) || 'light';
  });

  // При первой загрузке попробуем получить тему с сервера
  useEffect(() => {
    const fetchThemeFromServer = async () => {
      try {
        const response = await apiRequest('GET', '/api/preferences', undefined);
        const data = await response.json();
        
        if (data && data.theme) {
          setTheme(data.theme);
        }
      } catch (error) {
        console.log('Using local theme preference');
        // При ошибке запроса к серверу используем тему из localStorage
      }
    };
    
    fetchThemeFromServer();
  }, []);

  // Эффект для применения темы к документу
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Очистим предыдущие классы тем
    root.classList.remove('light-theme', 'dark-theme');
    
    // Добавим новый класс темы
    root.classList.add(`${theme}-theme`);
    
    // Обновим CSS переменные для темной темы, чтобы сделать ее менее яркой
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--background', '#121212');
      document.documentElement.style.setProperty('--foreground', 'rgba(255, 255, 255, 0.87)');
      document.documentElement.style.setProperty('--card-bg', '#1e1e1e');
      document.documentElement.style.setProperty('--accent-light', 'rgba(13, 92, 61, 0.2)');
    } else {
      document.documentElement.style.setProperty('--background', '#f5f5f5');
      document.documentElement.style.setProperty('--foreground', '#333333');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--accent-light', 'rgba(13, 92, 61, 0.1)');
    }
    
    // Сохраним выбор пользователя локально
    localStorage.setItem('prayer-app-theme', theme);
    
    // Сохраним на сервере
    saveUserThemePreference(theme);
  }, [theme]);

  // Функция переключения темы
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для доступа к контексту темы
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};