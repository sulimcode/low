import { FC } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Info, Settings, Mail, Heart, ExternalLink } from "lucide-react";

const Footer: FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  // Translations
  const appTitle = t('prayer');
  
  const appDescription = language === 'ru' ? 'Точное расписание намазов для вашего местоположения' :
    language === 'en' ? 'Accurate prayer times schedule for your location' :
    language === 'ar' ? 'جدول دقيق لأوقات الصلاة حسب موقعك' :
    language === 'fr' ? 'Horaires de prière précis pour votre emplacement' :
    'Accurate prayer times schedule for your location';
    
  const aboutAppText = language === 'ru' ? 'О приложении' :
    language === 'en' ? 'About app' :
    language === 'ar' ? 'حول التطبيق' :
    language === 'fr' ? 'À propos' :
    'About app';
    
  const settingsText = language === 'ru' ? 'Настройки' :
    language === 'en' ? 'Settings' :
    language === 'ar' ? 'الإعدادات' :
    language === 'fr' ? 'Paramètres' :
    'Settings';
    
  const contactsText = language === 'ru' ? 'Контакты' :
    language === 'en' ? 'Contacts' :
    language === 'ar' ? 'جهات الاتصال' :
    language === 'fr' ? 'Contacts' :
    'Contacts';
    
  const footerNotice = language === 'ru' ? 'Данные предоставлены Prayer Times API. Все времена рассчитаны на основе вашего местоположения.' :
    language === 'en' ? 'Data provided by Prayer Times API. All times are calculated based on your location.' :
    language === 'ar' ? 'البيانات مقدمة من Prayer Times API. يتم حساب جميع الأوقات بناءً على موقعك.' :
    language === 'fr' ? 'Données fournies par Prayer Times API. Tous les horaires sont calculés en fonction de votre emplacement.' :
    'Data provided by Prayer Times API. All times are calculated based on your location.';
    
  const madeWithLove = language === 'ru' ? 'Сделано с любовью для мусульман по всему миру' :
    language === 'en' ? 'Made with love for Muslims around the world' :
    language === 'ar' ? 'صنع بحب للمسلمين حول العالم' :
    language === 'fr' ? 'Fait avec amour pour les musulmans du monde entier' :
    'Made with love for Muslims around the world';
    
  return (
    <footer className="mt-8 py-6 relative"
      style={{ 
        backgroundColor: theme === 'dark' ? '#121212' : 'var(--primary-color)',
        color: '#ffffff',
        backgroundImage: theme === 'dark' 
          ? 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15) 0%, rgba(0, 0, 0, 0) 60%)' 
          : 'radial-gradient(circle at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 60%)'
      }}
    >
      {/* Gold accent line at the top */}
      <div className="absolute top-0 left-0 right-0 h-1" 
        style={{ 
          background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.8) 50%, rgba(212, 175, 55, 0.3) 100%)',
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)'
        }}></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-[#D4AF37] text-2xl mr-2" style={{ filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))' }}>🕌</span>
              <h2 className="text-xl font-bold"
                style={{ textShadow: theme === 'dark' ? '0 0 10px rgba(212, 175, 55, 0.5)' : 'none' }}>
                {appTitle}
              </h2>
            </div>
            <p className="text-xs mt-1 opacity-80 max-w-xs mx-auto md:mx-0">{appDescription}</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-full transition-all flex items-center justify-center"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = '#D4AF37';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <span className="sr-only">{aboutAppText}</span>
                <Info size={16} />
              </a>
              <a href="#" className="p-2 rounded-full transition-all flex items-center justify-center"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = '#D4AF37';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <span className="sr-only">{settingsText}</span>
                <Settings size={16} />
              </a>
              <a href="#" className="p-2 rounded-full transition-all flex items-center justify-center"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(4px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = '#D4AF37';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                <span className="sr-only">{contactsText}</span>
                <Mail size={16} />
              </a>
            </div>
            
            <div className="flex items-center text-xs opacity-80">
              <Heart size={12} className="mr-1.5" style={{ color: '#D4AF37' }} />
              <span>{madeWithLove}</span>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-4 pt-4 text-center text-xs opacity-60"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <p className="flex items-center justify-center">
            {footerNotice}
            <a href="https://aladhan.com/prayer-times-api" target="_blank" rel="noopener noreferrer" 
              className="ml-1 inline-flex items-center transition-all opacity-80 hover:opacity-100">
              <ExternalLink size={10} className="ml-0.5" />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
