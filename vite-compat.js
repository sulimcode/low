// Этот файл предоставляет совместимость для Vite с Node.js 18.x на Vercel
// Он импортируется перед загрузкой Vite при сборке

// Полифил для import.meta.dirname которая требуется в vite.config.ts
if (typeof globalThis.import === 'object' && typeof globalThis.import.meta === 'object') {
  if (typeof globalThis.import.meta.dirname === 'undefined') {
    Object.defineProperty(globalThis.import.meta, 'dirname', {
      value: process.cwd(), // Возвращаем текущую рабочую директорию
      writable: false,
      enumerable: true,
      configurable: false
    });
    
    console.log('[vite-compat] Added polyfill for import.meta.dirname');
  }
}

// Фикс проблемы с определением входного файла
// Эта функция вызывается перед началом сборки
module.exports = function setupViteCompat() {
  console.log('[vite-compat] Setting up Vite compatibility for Node.js 18.x');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Проверяем наличие index.html в корне проекта
    const rootIndexPath = path.join(process.cwd(), 'index.html');
    if (!fs.existsSync(rootIndexPath)) {
      // Если файла нет, пытаемся найти его в клиентской директории
      const clientIndexPath = path.join(process.cwd(), 'client', 'index.html');
      
      if (fs.existsSync(clientIndexPath)) {
        // Копируем файл в корень проекта
        fs.copyFileSync(clientIndexPath, rootIndexPath);
        console.log('[vite-compat] Copied client/index.html to project root');
      } else {
        console.warn('[vite-compat] Warning: Could not find index.html in client directory');
      }
    } else {
      console.log('[vite-compat] Found index.html in project root');
    }
    
    return true;
  } catch (error) {
    console.error('[vite-compat] Error setting up Vite compatibility:', error);
    return false;
  }
};