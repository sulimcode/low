// Файл для обеспечения совместимости с различными версиями Node.js при деплое на Vercel
// Это CommonJS версия, которая будет использоваться в случае, если ESM не поддерживается

/**
 * Хелпер для определения версии Node.js
 */
function getNodeVersion() {
  const version = process.version;
  console.log('Running on Node.js version:', version);
  return version;
}

/**
 * Добавление полифила для import.meta.dirname в глобальное пространство имен
 */
function addDirnamePolyfill() {
  // Работаем только если мы в ESM контексте
  if (typeof globalThis.import === 'object' && 
      typeof globalThis.import.meta === 'object' && 
      typeof globalThis.import.meta.dirname === 'undefined') {
    
    Object.defineProperty(globalThis.import.meta, 'dirname', {
      value: process.cwd(),
      writable: false,
      enumerable: true,
      configurable: false
    });
    
    console.log('Added dirname polyfill for Node.js compatibility');
  }
}

// Запускаем нужные функции
getNodeVersion();
addDirnamePolyfill();

// Экспортируем функции для возможного использования
module.exports = {
  getNodeVersion,
  addDirnamePolyfill
};