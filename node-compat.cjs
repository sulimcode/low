// Этот файл предназначен для исправления проблем совместимости с Node.js в CommonJS формате
// Используется как fallback, если ESM файлы не могут быть выполнены

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Node compatibility script (CJS version)');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// Основная функция для проверки и настройки окружения
function setupCompatibility() {
  try {
    // Если мы на Vercel, выполняем специфичные для Vercel настройки
    if (process.env.VERCEL || process.env.VERCEL_DEPLOYMENT) {
      console.log('Running in Vercel environment');
      
      // Проверка и создание необходимых директорий
      const apiDir = path.join(process.cwd(), 'api');
      if (!fs.existsSync(apiDir)) {
        console.log('Creating API directory');
        fs.mkdirSync(apiDir, { recursive: true });
      }
      
      // Проверка и копирование необходимых файлов
      const clientIndex = path.join(process.cwd(), 'client', 'index.html');
      const rootIndex = path.join(process.cwd(), 'index.html');
      
      if (fs.existsSync(clientIndex) && !fs.existsSync(rootIndex)) {
        console.log('Copying client/index.html to root directory');
        fs.copyFileSync(clientIndex, rootIndex);
      }
    }

    console.log('Compatibility setup completed');
    return true;
  } catch (error) {
    console.error('Error during compatibility setup:', error);
    return false;
  }
}

// Запускаем настройку
setupCompatibility();

// Экспортируем функции для возможного использования
module.exports = {
  setupCompatibility
};