// Конфигурация для Vercel
module.exports = {
  // Отключаем автоматическое использование файла vercel.json
  // и переопределяем настройки программно
  version: 2,
  
  // Важно: указываем правильную директорию сборки
  outputDirectory: 'dist',
  
  // Настройки сборки
  builds: [
    {
      src: 'package.json',
      use: '@vercel/node',
      config: { 
        buildCommand: 'npm run build',
        // Явно указываем что входной файл находится в client/index.html
        entrypoint: 'client/index.html'
      }
    }
  ],
  
  // Правила роутинга
  routes: [
    // API эндпоинты
    {
      src: '/api/(.*)',
      dest: '/api/$1'
    },
    
    // Статичные файлы
    {
      src: '/assets/(.*)',
      dest: '/assets/$1'
    },
    
    // Любые другие пути отправляем на index.html
    {
      src: '/(.*)',
      dest: '/index.html'
    }
  ]
};