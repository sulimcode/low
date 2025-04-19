import { Language } from "../contexts/LanguageContext";

// Определяем все переводы для приложения
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'prayer_times': 'Prayer Times',
    'prayer': 'Prayer', // This word should never be translated
    'times': 'Times',
    'select_language': 'Select language',
    'loading': 'Loading...',
    
    // Location selector
    'prayer_times_title': 'Prayer Times',
    'showing_times_for': 'Showing times for',
    'select_location': 'Select a location to view prayer times',
    'enter_city': 'Enter city',
    'country_optional': 'Country (optional)',
    'searching': 'Searching...',
    'search': 'Search',
    'search_results': 'Search results:',
    'locating': 'Locating...',
    'my_location': 'My location',
    'popular_locations': 'Popular locations',
    'location_not_found': 'Location not found. Please try a different search.',
    'enter_city_name': 'Please enter a city name',
    'search_error': 'An error occurred during search. Please try again.',
    
    // Prayer times display
    'daily_prayer_times': 'Daily Prayer Times',
    'sunrise': 'Sunrise',
    'fajr': 'Fajr',
    'dhuhr': 'Dhuhr',
    'asr': 'Asr',
    'maghrib': 'Maghrib',
    'isha': 'Isha',
    'current': 'CURRENT',
    'upcoming': 'NEXT',
    'now': 'Now',
    'next': 'Next',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'Monthly Prayer Schedule',
    'monthly_schedule': 'Monthly Prayer Schedule',
    'previous_month': 'Previous month',
    'next_month': 'Next month',
    'date': 'Date',
    'today': 'Today',
    
    // Next prayer countdown
    'next_prayer': 'Next prayer',
    'time_remaining': 'Time remaining',
    'in_x_minutes': 'In {minutes} minute(s)',
    'in_x_hours': 'In {hours} hour(s)',
    'in_x_hours_y_minutes': 'In {hours} hour(s) {minutes} min',
    
    // Footer
    'copyright': '© 2025 Prayer Times App. All rights reserved.',
    'website_description': 'Accurate prayer times for Muslims worldwide.'
  },
  ru: {
    // Header
    'prayer_times': 'Время намаза',
    'prayer': 'Prayer', // Keeping Prayer as original
    'times': 'Время',
    'select_language': 'Выберите язык',
    'loading': 'Загрузка...',
    
    // Location selector
    'prayer_times_title': 'Время намаза',
    'showing_times_for': 'Показаны времена для',
    'select_location': 'Выберите местоположение для просмотра времен намаза',
    'enter_city': 'Введите город',
    'country_optional': 'Страна (опционально)',
    'searching': 'Поиск...',
    'search': 'Поиск',
    'search_results': 'Результаты поиска:',
    'locating': 'Определение...',
    'my_location': 'Моё местоположение',
    'popular_locations': 'Популярные места',
    'location_not_found': 'Место не найдено. Попробуйте другой запрос.',
    'enter_city_name': 'Пожалуйста, введите название города',
    'search_error': 'Произошла ошибка при поиске. Пожалуйста, попробуйте снова.',
    
    // Prayer times display
    'daily_prayer_times': 'Времена намаза на сегодня',
    'sunrise': 'Восход',
    'fajr': 'Фаджр',
    'dhuhr': 'Зухр',
    'asr': 'Аср',
    'maghrib': 'Магриб',
    'isha': 'Иша',
    'current': 'ТЕКУЩИЙ',
    'upcoming': 'СЛЕДУЮЩИЙ',
    'now': 'Сейчас',
    'next': 'Следующий',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'Расписание намазов на месяц',
    'monthly_schedule': 'Расписание намазов на месяц',
    'previous_month': 'Предыдущий месяц',
    'next_month': 'Следующий месяц',
    'date': 'Дата',
    'today': 'Сегодня',
    
    // Next prayer countdown
    'next_prayer': 'Следующий намаз',
    'time_remaining': 'Осталось времени',
    'in_x_minutes': 'Через {minutes} минут(ы)',
    'in_x_hours': 'Через {hours} час(ов)',
    'in_x_hours_y_minutes': 'Через {hours} час(ов) {minutes} мин',
    
    // Footer
    'copyright': '© 2025 Приложение времен намаза. Все права защищены.',
    'website_description': 'Точное время намаза для мусульман по всему миру.'
  },
  ar: {
    // Header
    'prayer_times': 'أوقات الصلاة',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'أوقات',
    'select_language': 'اختر اللغة',
    'loading': 'جار التحميل...',
    
    // Location selector
    'prayer_times_title': 'أوقات الصلاة',
    'showing_times_for': 'عرض الأوقات لـ',
    'select_location': 'اختر موقعًا لعرض أوقات الصلاة',
    'enter_city': 'أدخل المدينة',
    'country_optional': 'البلد (اختياري)',
    'searching': 'جاري البحث...',
    'search': 'بحث',
    'search_results': 'نتائج البحث:',
    'locating': 'تحديد الموقع...',
    'my_location': 'موقعي',
    'popular_locations': 'المواقع الشائعة',
    'location_not_found': 'لم يتم العثور على الموقع. الرجاء تجربة بحث مختلف.',
    'enter_city_name': 'الرجاء إدخال اسم المدينة',
    'search_error': 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.',
    
    // Prayer times display
    'daily_prayer_times': 'أوقات الصلاة اليومية',
    'sunrise': 'شروق الشمس',
    'fajr': 'الفجر',
    'dhuhr': 'الظهر',
    'asr': 'العصر',
    'maghrib': 'المغرب',
    'isha': 'العشاء',
    'current': 'الحالي',
    'upcoming': 'التالي',
    'now': 'الآن',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'جدول الصلاة الشهري',
    'monthly_schedule': 'جدول الصلاة الشهري',
    'previous_month': 'الشهر السابق',
    'next_month': 'الشهر القادم',
    'date': 'التاريخ',
    'today': 'اليوم',
    
    // Next prayer countdown
    'next_prayer': 'الصلاة التالية',
    'time_remaining': 'الوقت المتبقي',
    'in_x_minutes': 'خلال {minutes} دقيقة',
    'in_x_hours': 'خلال {hours} ساعة',
    'in_x_hours_y_minutes': 'خلال {hours} ساعة و {minutes} دقيقة',
    
    // Footer
    'copyright': '© 2025 تطبيق أوقات الصلاة. جميع الحقوق محفوظة.',
    'website_description': 'أوقات صلاة دقيقة للمسلمين في جميع أنحاء العالم.'
  },
  fr: {
    // Header
    'prayer_times': 'Horaires de prière',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'Horaires',
    'select_language': 'Choisir la langue',
    'loading': 'Chargement...',
    
    // Location selector
    'prayer_times_title': 'Horaires de prière',
    'showing_times_for': 'Affichage des horaires pour',
    'select_location': 'Sélectionnez un lieu pour voir les horaires de prière',
    'enter_city': 'Entrez la ville',
    'country_optional': 'Pays (facultatif)',
    'searching': 'Recherche...',
    'search': 'Rechercher',
    'search_results': 'Résultats de recherche:',
    'locating': 'Localisation...',
    'my_location': 'Ma position',
    'popular_locations': 'Lieux populaires',
    'location_not_found': 'Lieu non trouvé. Veuillez essayer une recherche différente.',
    'enter_city_name': 'Veuillez entrer le nom d\'une ville',
    'search_error': 'Une erreur s\'est produite lors de la recherche. Veuillez réessayer.',
    
    // Prayer times display
    'daily_prayer_times': 'Horaires de prière quotidiens',
    'sunrise': 'Lever du soleil',
    'fajr': 'Fajr',
    'dhuhr': 'Dhuhr',
    'asr': 'Asr',
    'maghrib': 'Maghrib',
    'isha': 'Isha',
    'current': 'ACTUEL',
    'upcoming': 'SUIVANT',
    'now': 'Maintenant',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'Horaire mensuel des prières',
    'monthly_schedule': 'Calendrier mensuel',
    'previous_month': 'Mois précédent',
    'next_month': 'Mois suivant',
    'date': 'Date',
    'today': 'Aujourd\'hui',
    
    // Next prayer countdown
    'next_prayer': 'Prochaine prière',
    'time_remaining': 'Temps restant',
    'in_x_minutes': 'Dans {minutes} minute(s)',
    'in_x_hours': 'Dans {hours} heure(s)',
    'in_x_hours_y_minutes': 'Dans {hours} heure(s) {minutes} min',
    
    // Footer
    'copyright': '© 2025 Application Horaires de prière. Tous droits réservés.',
    'website_description': 'Horaires de prière précis pour les musulmans du monde entier.'
  },
  zh: {
    // Header
    'prayer_times': '礼拜时间',
    'prayer': 'Prayer', // Not translating Prayer
    'times': '时间',
    'select_language': '选择语言',
    'loading': '加载中...',
    
    // Location selector
    'prayer_times_title': '礼拜时间',
    'showing_times_for': '显示时间为',
    'select_location': '选择一个位置查看礼拜时间',
    'enter_city': '输入城市',
    'country_optional': '国家（可选）',
    'searching': '搜索中...',
    'search': '搜索',
    'search_results': '搜索结果：',
    'locating': '定位中...',
    'my_location': '我的位置',
    'popular_locations': '热门位置',
    'location_not_found': '未找到位置。请尝试不同的搜索。',
    'enter_city_name': '请输入城市名称',
    'search_error': '搜索时出错。请再试一次。',
    
    // Prayer times display
    'daily_prayer_times': '每日礼拜时间',
    'sunrise': '日出',
    'fajr': '晨礼',
    'dhuhr': '晌礼',
    'asr': '午礼',
    'maghrib': '昏礼',
    'isha': '宵礼',
    'current': '当前',
    'upcoming': '下一个',
    
    // Monthly schedule
    'monthly_prayer_schedule': '每月礼拜时间表',
    'monthly_schedule': '月度日程',
    'previous_month': '上个月',
    'next_month': '下个月',
    'now': '现在',
    'date': '日期',
    
    // Next prayer countdown
    'next_prayer': '下一个礼拜',
    'time_remaining': '剩余时间',
    'in_x_minutes': '还有 {minutes} 分钟',
    'in_x_hours': '还有 {hours} 小时',
    'in_x_hours_y_minutes': '还有 {hours} 小时 {minutes} 分钟',
    
    // Footer
    'copyright': '© 2025 礼拜时间应用。保留所有权利。',
    'website_description': '为全球穆斯林提供准确的礼拜时间。'
  },
  hi: {
    // Header
    'prayer_times': 'नमाज़ के समय',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'समय',
    'select_language': 'भाषा चुनें',
    'loading': 'लोड हो रहा है...',
    
    // Location selector
    'prayer_times_title': 'नमाज़ के समय',
    'showing_times_for': 'के लिए समय दिखा रहे हैं',
    'select_location': 'नमाज़ के समय देखने के लिए स्थान चुनें',
    'enter_city': 'शहर दर्ज करें',
    'country_optional': 'देश (वैकल्पिक)',
    'searching': 'खोज रहे हैं...',
    'search': 'खोज',
    'search_results': 'खोज परिणाम:',
    'locating': 'स्थान निर्धारित कर रहे हैं...',
    'my_location': 'मेरा स्थान',
    'popular_locations': 'लोकप्रिय स्थान',
    'location_not_found': 'स्थान नहीं मिला। कृपया अलग खोज का प्रयास करें।',
    'enter_city_name': 'कृपया शहर का नाम दर्ज करें',
    'search_error': 'खोज के दौरान एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
    
    // Prayer times display
    'daily_prayer_times': 'दैनिक नमाज़ के समय',
    'sunrise': 'सूर्योदय',
    'fajr': 'फज्र',
    'dhuhr': 'जुहर',
    'asr': 'अस्र',
    'maghrib': 'मगरिब',
    'isha': 'इशा',
    'current': 'वर्तमान',
    'upcoming': 'आगामी',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'मासिक नमाज़ कार्यक्रम',
    'monthly_schedule': 'मासिक कार्यक्रम',
    'previous_month': 'पिछला महीना',
    'next_month': 'अगला महीना',
    'now': 'अभी',
    'date': 'तिथि',
    
    // Next prayer countdown
    'next_prayer': 'अगली नमाज़',
    'time_remaining': 'शेष समय',
    'in_x_minutes': '{minutes} मिनट में',
    'in_x_hours': '{hours} घंटे में',
    'in_x_hours_y_minutes': '{hours} घंटे {minutes} मिनट में',
    
    // Footer
    'copyright': '© 2025 नमाज़ समय ऐप। सर्वाधिकार सुरक्षित।',
    'website_description': 'विश्व भर के मुसलमानों के लिए सटीक नमाज़ के समय।'
  },
  es: {
    // Header
    'prayer_times': 'Horarios de oración',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'Horarios',
    'select_language': 'Seleccionar idioma',
    'loading': 'Cargando...',
    
    // Location selector
    'prayer_times_title': 'Horarios de oración',
    'showing_times_for': 'Mostrando horarios para',
    'select_location': 'Seleccione una ubicación para ver los horarios de oración',
    'enter_city': 'Ingrese ciudad',
    'country_optional': 'País (opcional)',
    'searching': 'Buscando...',
    'search': 'Buscar',
    'search_results': 'Resultados de búsqueda:',
    'locating': 'Localizando...',
    'my_location': 'Mi ubicación',
    'popular_locations': 'Ubicaciones populares',
    'location_not_found': 'Ubicación no encontrada. Intente una búsqueda diferente.',
    'enter_city_name': 'Por favor ingrese el nombre de la ciudad',
    'search_error': 'Ocurrió un error durante la búsqueda. Por favor, inténtelo de nuevo.',
    
    // Prayer times display
    'daily_prayer_times': 'Horarios diarios de oración',
    'sunrise': 'Amanecer',
    'fajr': 'Fajr',
    'dhuhr': 'Dhuhr',
    'asr': 'Asr',
    'maghrib': 'Maghrib',
    'isha': 'Isha',
    'current': 'ACTUAL',
    'upcoming': 'PRÓXIMO',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'Horario mensual de oración',
    'monthly_schedule': 'Calendario mensual',
    'previous_month': 'Mes anterior',
    'next_month': 'Mes siguiente',
    'now': 'Ahora',
    'date': 'Fecha',
    
    // Next prayer countdown
    'next_prayer': 'Próxima oración',
    'time_remaining': 'Tiempo restante',
    'in_x_minutes': 'En {minutes} minuto(s)',
    'in_x_hours': 'En {hours} hora(s)',
    'in_x_hours_y_minutes': 'En {hours} hora(s) {minutes} min',
    
    // Footer
    'copyright': '© 2025 Aplicación de horarios de oración. Todos los derechos reservados.',
    'website_description': 'Horarios precisos de oración para musulmanes en todo el mundo.'
  },
  bn: {
    // Header
    'prayer_times': 'নামাজের সময়',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'সময়',
    'select_language': 'ভাষা নির্বাচন করুন',
    'loading': 'লোড হচ্ছে...',
    
    // Location selector
    'prayer_times_title': 'নামাজের সময়',
    'showing_times_for': 'এর জন্য সময় দেখানো হচ্ছে',
    'select_location': 'নামাজের সময় দেখতে একটি অবস্থান নির্বাচন করুন',
    'enter_city': 'শহর লিখুন',
    'country_optional': 'দেশ (ঐচ্ছিক)',
    'searching': 'খোঁজা হচ্ছে...',
    'search': 'খুঁজুন',
    'search_results': 'অনুসন্ধান ফলাফল:',
    'locating': 'অবস্থান নির্ধারণ করা হচ্ছে...',
    'my_location': 'আমার অবস্থান',
    'popular_locations': 'জনপ্রিয় অবস্থান',
    'location_not_found': 'অবস্থান পাওয়া যায়নি। অন্য একটি অনুসন্ধান চেষ্টা করুন।',
    'enter_city_name': 'দয়া করে শহরের নাম লিখুন',
    'search_error': 'অনুসন্ধানের সময় একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।',
    
    // Prayer times display
    'daily_prayer_times': 'দৈনিক নামাজের সময়',
    'sunrise': 'সূর্যোদয়',
    'fajr': 'ফজর',
    'dhuhr': 'যোহর',
    'asr': 'আসর',
    'maghrib': 'মাগরিব',
    'isha': 'ইশা',
    'current': 'বর্তমান',
    'upcoming': 'আগামী',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'মাসিক নামাজের সময়সূচী',
    'monthly_schedule': 'মাসিক সময়সূচী',
    'previous_month': 'আগের মাস',
    'next_month': 'পরের মাস',
    'now': 'এখন',
    'date': 'তারিখ',
    
    // Next prayer countdown
    'next_prayer': 'পরবর্তী নামাজ',
    'time_remaining': 'অবশিষ্ট সময়',
    'in_x_minutes': '{minutes} মিনিটে',
    'in_x_hours': '{hours} ঘণ্টায়',
    'in_x_hours_y_minutes': '{hours} ঘণ্টা {minutes} মিনিটে',
    
    // Footer
    'copyright': '© 2025 নামাজের সময় অ্যাপ। সর্বস্বত্ব সংরক্ষিত।',
    'website_description': 'বিশ্বব্যাপী মুসলিমদের জন্য সঠিক নামাজের সময়।'
  },
  pt: {
    // Header
    'prayer_times': 'Horários de oração',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'Horários',
    'select_language': 'Selecionar idioma',
    'loading': 'Carregando...',
    
    // Location selector
    'prayer_times_title': 'Horários de oração',
    'showing_times_for': 'Mostrando horários para',
    'select_location': 'Selecione um local para ver os horários de oração',
    'enter_city': 'Digite a cidade',
    'country_optional': 'País (opcional)',
    'searching': 'Pesquisando...',
    'search': 'Pesquisar',
    'search_results': 'Resultados da pesquisa:',
    'locating': 'Localizando...',
    'my_location': 'Minha localização',
    'popular_locations': 'Locais populares',
    'location_not_found': 'Local não encontrado. Tente uma pesquisa diferente.',
    'enter_city_name': 'Por favor, digite o nome da cidade',
    'search_error': 'Ocorreu um erro durante a pesquisa. Por favor, tente novamente.',
    
    // Prayer times display
    'daily_prayer_times': 'Horários diários de oração',
    'sunrise': 'Nascer do sol',
    'fajr': 'Fajr',
    'dhuhr': 'Dhuhr',
    'asr': 'Asr',
    'maghrib': 'Maghrib',
    'isha': 'Isha',
    'current': 'ATUAL',
    'upcoming': 'PRÓXIMO',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'Calendário mensal de orações',
    'monthly_schedule': 'Calendário mensal',
    'previous_month': 'Mês anterior',
    'next_month': 'Próximo mês',
    'now': 'Agora',
    'date': 'Data',
    
    // Next prayer countdown
    'next_prayer': 'Próxima oração',
    'time_remaining': 'Tempo restante',
    'in_x_minutes': 'Em {minutes} minuto(s)',
    'in_x_hours': 'Em {hours} hora(s)',
    'in_x_hours_y_minutes': 'Em {hours} hora(s) {minutes} min',
    
    // Footer
    'copyright': '© 2025 Aplicativo de horários de oração. Todos os direitos reservados.',
    'website_description': 'Horários precisos de oração para muçulmanos em todo o mundo.'
  },
  id: {
    // Header
    'prayer_times': 'Waktu Sholat',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'Waktu',
    'select_language': 'Pilih bahasa',
    'loading': 'Memuat...',
    
    // Location selector
    'prayer_times_title': 'Waktu Sholat',
    'showing_times_for': 'Menampilkan waktu untuk',
    'select_location': 'Pilih lokasi untuk melihat waktu sholat',
    'enter_city': 'Masukkan kota',
    'country_optional': 'Negara (opsional)',
    'searching': 'Mencari...',
    'search': 'Cari',
    'search_results': 'Hasil pencarian:',
    'locating': 'Mencari lokasi...',
    'my_location': 'Lokasi saya',
    'popular_locations': 'Lokasi populer',
    'location_not_found': 'Lokasi tidak ditemukan. Coba pencarian lain.',
    'enter_city_name': 'Silakan masukkan nama kota',
    'search_error': 'Terjadi kesalahan saat pencarian. Silakan coba lagi.',
    
    // Prayer times display
    'daily_prayer_times': 'Jadwal Sholat Harian',
    'sunrise': 'Matahari terbit',
    'fajr': 'Subuh',
    'dhuhr': 'Dzuhur',
    'asr': 'Ashar',
    'maghrib': 'Maghrib',
    'isha': 'Isya',
    'current': 'SAAT INI',
    'upcoming': 'BERIKUTNYA',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'Jadwal Sholat Bulanan',
    'monthly_schedule': 'Jadwal Bulanan',
    'previous_month': 'Bulan sebelumnya',
    'next_month': 'Bulan berikutnya',
    'now': 'Sekarang',
    'date': 'Tanggal',
    
    // Next prayer countdown
    'next_prayer': 'Sholat berikutnya',
    'time_remaining': 'Waktu tersisa',
    'in_x_minutes': 'Dalam {minutes} menit',
    'in_x_hours': 'Dalam {hours} jam',
    'in_x_hours_y_minutes': 'Dalam {hours} jam {minutes} menit',
    
    // Footer
    'copyright': '© 2025 Aplikasi Waktu Sholat. Hak cipta dilindungi.',
    'website_description': 'Waktu sholat yang akurat untuk umat Muslim di seluruh dunia.'
  },
  ur: {
    // Header
    'prayer_times': 'نماز کے اوقات',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'اوقات',
    'select_language': 'زبان منتخب کریں',
    'loading': 'لوڈ ہو رہا ہے...',
    
    // Location selector
    'prayer_times_title': 'نماز کے اوقات',
    'showing_times_for': 'کے لیے اوقات دکھا رہے ہیں',
    'select_location': 'نماز کے اوقات دیکھنے کے لیے مقام منتخب کریں',
    'enter_city': 'شہر درج کریں',
    'country_optional': 'ملک (اختیاری)',
    'searching': 'تلاش کر رہے ہیں...',
    'search': 'تلاش کریں',
    'search_results': 'تلاش کے نتائج:',
    'locating': 'مقام کا تعین کر رہے ہیں...',
    'my_location': 'میرا مقام',
    'popular_locations': 'مقبول مقامات',
    'location_not_found': 'مقام نہیں ملا۔ مختلف تلاش کی کوشش کریں۔',
    'enter_city_name': 'براہ کرم شہر کا نام درج کریں',
    'search_error': 'تلاش کے دوران ایک خرابی پیش آئی۔ براہ کرم دوبارہ کوشش کریں۔',
    
    // Prayer times display
    'daily_prayer_times': 'روزانہ نماز کے اوقات',
    'sunrise': 'طلوع آفتاب',
    'fajr': 'فجر',
    'dhuhr': 'ظہر',
    'asr': 'عصر',
    'maghrib': 'مغرب',
    'isha': 'عشاء',
    'current': 'موجودہ',
    'upcoming': 'آنے والی',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'ماہانہ نماز کا شیڈول',
    'monthly_schedule': 'ماہانہ شیڈول',
    'previous_month': 'پچھلا مہینہ',
    'next_month': 'اگلا مہینہ',
    'now': 'ابھی',
    'date': 'تاریخ',
    
    // Next prayer countdown
    'next_prayer': 'اگلی نماز',
    'time_remaining': 'باقی وقت',
    'in_x_minutes': '{minutes} منٹ میں',
    'in_x_hours': '{hours} گھنٹے میں',
    'in_x_hours_y_minutes': '{hours} گھنٹے {minutes} منٹ میں',
    
    // Footer
    'copyright': '© 2025 نماز کے اوقات ایپ۔ جملہ حقوق محفوظ ہیں۔',
    'website_description': 'دنیا بھر کے مسلمانوں کے لیے درست نماز کے اوقات۔'
  },
  de: {
    // Header
    'prayer_times': 'Gebetszeiten',
    'prayer': 'Prayer', // Not translating Prayer
    'times': 'Zeiten',
    'select_language': 'Sprache auswählen',
    'loading': 'Wird geladen...',
    
    // Location selector
    'prayer_times_title': 'Gebetszeiten',
    'showing_times_for': 'Zeiten für',
    'select_location': 'Wählen Sie einen Ort, um Gebetszeiten anzuzeigen',
    'enter_city': 'Stadt eingeben',
    'country_optional': 'Land (optional)',
    'searching': 'Suche...',
    'search': 'Suchen',
    'search_results': 'Suchergebnisse:',
    'locating': 'Ortung...',
    'my_location': 'Mein Standort',
    'popular_locations': 'Beliebte Orte',
    'location_not_found': 'Ort nicht gefunden. Versuchen Sie eine andere Suche.',
    'enter_city_name': 'Bitte geben Sie einen Stadtnamen ein',
    'search_error': 'Bei der Suche ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    
    // Prayer times display
    'daily_prayer_times': 'Tägliche Gebetszeiten',
    'sunrise': 'Sonnenaufgang',
    'fajr': 'Fadschr',
    'dhuhr': 'Dhuhr',
    'asr': 'Asr',
    'maghrib': 'Maghrib',
    'isha': 'Ischa',
    'current': 'AKTUELL',
    'upcoming': 'NÄCHSTE',
    
    // Monthly schedule
    'monthly_prayer_schedule': 'Monatlicher Gebetsplan',
    'monthly_schedule': 'Monatsplan',
    'previous_month': 'Vorheriger Monat',
    'next_month': 'Nächster Monat',
    'now': 'Jetzt',
    'date': 'Datum',
    
    // Next prayer countdown
    'next_prayer': 'Nächstes Gebet',
    'time_remaining': 'Verbleibende Zeit',
    'in_x_minutes': 'In {minutes} Minute(n)',
    'in_x_hours': 'In {hours} Stunde(n)',
    'in_x_hours_y_minutes': 'In {hours} Stunde(n) {minutes} Min',
    
    // Footer
    'copyright': '© 2025 Gebetszeiten-App. Alle Rechte vorbehalten.',
    'website_description': 'Genaue Gebetszeiten für Muslime weltweit.'
  }
};