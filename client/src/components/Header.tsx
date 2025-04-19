import { FC, useState, useRef, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Language, languageInfo } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, ExternalLink } from "lucide-react";
import { FaTelegram } from "react-icons/fa";

interface HeaderProps {
  gregorianDate?: string;
  islamicDate?: string;
  isLoading?: boolean;
}

const Header: FC<HeaderProps> = ({ gregorianDate, islamicDate, isLoading = false }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileBtnRef = useRef<HTMLButtonElement>(null);
  const desktopBtnRef = useRef<HTMLButtonElement>(null);
  
  const currentDate = new Date().toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Get all needed translations
  const selectLanguageText = t('select_language');
  const loadingText = t('loading');

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setMobileMenuOpen(false);
    setDesktopMenuOpen(false);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Mobile menu handling
      if (mobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) &&
          mobileBtnRef.current && 
          !mobileBtnRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      
      // Desktop menu handling
      if (desktopMenuOpen && 
          desktopMenuRef.current && 
          !desktopMenuRef.current.contains(event.target as Node) &&
          desktopBtnRef.current && 
          !desktopBtnRef.current.contains(event.target as Node)) {
        setDesktopMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, desktopMenuOpen]);

  // Language dropdown items
  const languageItems = Object.entries(languageInfo).map(([langCode, info]) => (
    <button
      key={langCode}
      onClick={() => handleLanguageChange(langCode as Language)}
      style={{
        backgroundColor: language === langCode ? 'var(--primary-color)' : 'transparent',
        color: language === langCode ? '#ffffff' : 'var(--foreground)'
      }}
      className="flex items-center px-3 py-2 text-sm text-left transition-colors rounded-md hover:bg-opacity-10"
    >
      <span className="mr-2 text-lg">{info.flag}</span>
      <div className="flex flex-col">
        <span className="font-medium">{info.nativeName}</span>
        <span className="text-xs opacity-75">{info.name}</span>
      </div>
    </button>
  ));

  return (
    <header 
      className="shadow-md relative z-10"
      style={{ 
        backgroundColor: 'var(--header-bg)', 
        color: 'var(--header-text)',
        backgroundImage: theme === 'dark' 
          ? 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 70%)' 
          : 'radial-gradient(circle at 50% 0%, rgba(13, 92, 61, 0.15) 0%, rgba(255, 255, 255, 0) 70%)'
      }}
    >
      {/* Dynamic Island Glow Effect for iPhone */}
      <div className="dynamic-island-glow hidden md:block"></div>
      
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center">
          {/* Top Bar - Logo, Title and Controls */}
          <div className="flex items-center justify-between w-full mb-3">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="mr-2 text-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))' }}>
                <span className="text-[#D4AF37]">🕌</span>
              </div>
              <h1 className="text-xl font-bold tracking-wide font-sans" 
                  style={{ 
                    backgroundImage: 'linear-gradient(135deg, #F7F7F7 10%, #D4AF37 50%, #F5EFD9 90%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    textShadow: theme === 'dark' ? '0 0 12px rgba(212, 175, 55, 0.4)' : '0 0 6px rgba(212, 175, 55, 0.25)',
                    letterSpacing: '0.08em',
                    fontWeight: '600'
                  }}>
                {t('prayer')} <span className="text-sm font-light ml-1 opacity-90" style={{ color: 'var(--header-text)' }}>{t('times')}</span>
              </h1>
            </div>
            
            {/* Controls - Theme Toggle, Telegram, and Language Selector */}
            <div className="flex items-center space-x-2">
              {/* Telegram Link - Mobile */}
              <a
                href="https://t.me/prayer_ton"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 transition-all flex items-center justify-center hover:scale-110"
                style={{ 
                  backgroundColor: '#0088cc', 
                  color: '#ffffff', 
                  borderColor: '#0088cc',
                  borderWidth: '1px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
                aria-label="Join our Telegram channel"
              >
                <FaTelegram size={16} className="telegram-icon" />
                <span className="sr-only">Telegram</span>
              </a>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="rounded-full p-2 transition-all flex items-center justify-center hover:scale-110 theme-toggle"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: 'var(--header-text)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderWidth: '1px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === 'dark' ? <Sun size={16} className="theme-icon" /> : <Moon size={16} className="theme-icon" />}
              </button>
              
              {/* Language Selector - Mobile */}
              <div className="relative">
                <button 
                  ref={mobileBtnRef}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="rounded-full px-2 py-1.5 transition-all flex items-center"
                  style={{ 
                    backgroundColor: 'var(--accent-light)', 
                    color: 'var(--accent-color)', 
                    borderColor: 'var(--accent-color)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    opacity: 0.95,
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span className="mr-1 text-lg">{languageInfo[language].flag}</span>
                  <span className="font-medium text-sm">{languageInfo[language].nativeName}</span>
                </button>
                
                {mobileMenuOpen && (
                  <div 
                    ref={mobileMenuRef}
                    className="absolute right-0 mt-2 rounded-lg shadow-lg p-2 z-[100] w-56 max-h-72 overflow-y-auto"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--foreground)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div className="grid grid-cols-1 gap-1">
                      <div className="font-medium text-xs px-2 pb-1" style={{ color: 'var(--accent-color)' }}>
                        {selectLanguageText}
                      </div>
                      {languageItems}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Date Display for Mobile */}
          <div className="flex items-center justify-between w-full px-1 mb-1">
            <div className="rounded-lg px-3 py-1.5 flex-1 text-center text-sm" 
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: 'var(--header-text)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
              {isLoading ? (
                <div className="w-full h-3 animate-pulse rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              ) : (
                <span style={{ opacity: 0.9 }}>{gregorianDate || currentDate}</span>
              )}
            </div>
            
            <div className="mx-1 opacity-50 text-sm">•</div>
            
            <div className="rounded-lg px-3 py-1.5 flex-1 text-center text-sm" 
              style={{ 
                backgroundColor: 'var(--accent-light)', 
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--accent-color)',
                color: 'var(--accent-color)',
                opacity: 0.95,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
              {isLoading ? (
                <div className="w-full h-3 animate-pulse rounded" style={{ backgroundColor: 'var(--accent-light)' }}></div>
              ) : (
                <span style={{ opacity: 0.95 }}>{islamicDate || loadingText}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 text-3xl" style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))' }}>
              <span className="text-[#D4AF37]">🕌</span>
            </div>
            <h1 className="text-3xl font-bold tracking-wide font-sans"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #F7F7F7 10%, #D4AF37 50%, #F5EFD9 90%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: theme === 'dark' ? '0 0 12px rgba(212, 175, 55, 0.4)' : '0 0 6px rgba(212, 175, 55, 0.25)',
                  letterSpacing: '0.08em',
                  fontWeight: '600'
                }}>
              {t('prayer')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 text-sm">
            {/* Telegram Link - Desktop */}
            <a
              href="https://t.me/prayer_ton"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2.5 transition-all flex items-center justify-center hover:scale-110 pulse-on-hover"
              style={{ 
                backgroundColor: '#0088cc', 
                color: '#ffffff', 
                borderColor: '#0088cc',
                borderWidth: '1px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
              }}
              aria-label="Join our Telegram channel"
              title="Join our Telegram channel"
            >
              <FaTelegram size={18} className="telegram-icon" />
              <span className="sr-only">Telegram</span>
            </a>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2.5 transition-all flex items-center justify-center hover:scale-110 theme-toggle"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'var(--header-text)', 
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: '1px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === 'dark' ? <Sun size={18} className="theme-icon" /> : <Moon size={18} className="theme-icon" />}
            </button>
            
            {/* Language Selector - Desktop */}
            <div className="relative">
              <button 
                ref={desktopBtnRef}
                onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                className="rounded-full px-3 py-2 transition-all flex items-center"
                style={{ 
                  backgroundColor: 'var(--accent-light)', 
                  color: 'var(--accent-color)', 
                  borderColor: 'var(--accent-color)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  opacity: 0.95,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className="mr-1.5">{languageInfo[language].flag}</span>
                <span>{languageInfo[language].nativeName}</span>
              </button>
              
              {desktopMenuOpen && (
                <div 
                  ref={desktopMenuRef}
                  className="absolute right-0 mt-2 rounded-lg shadow-lg p-2 z-[100] w-56 max-h-72 overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--foreground)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="grid grid-cols-1 gap-1">
                    <div className="font-medium text-xs px-2 pb-1" style={{ color: 'var(--accent-color)' }}>
                      {selectLanguageText}
                    </div>
                    {languageItems}
                  </div>
                </div>
              )}
            </div>
            
            {/* Gregorian Date */}
            <div className="rounded-full px-3 py-1.5" 
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--header-text)'
              }}>
              {isLoading ? (
                <div className="w-20 h-3 animate-pulse rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              ) : (
                <span style={{ opacity: 0.9 }}>{gregorianDate || currentDate}</span>
              )}
            </div>
            
            {/* Islamic Date */}
            <div className="rounded-full px-3 py-1.5" 
              style={{ 
                backgroundColor: 'var(--accent-light)', 
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--accent-color)',
                color: 'var(--accent-color)',
                opacity: 0.9
              }}>
              {isLoading ? (
                <div className="w-20 h-3 animate-pulse rounded" style={{ backgroundColor: 'var(--accent-light)' }}></div>
              ) : (
                <span style={{ opacity: 0.9 }}>{islamicDate || loadingText}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
