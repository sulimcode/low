// Этот файл предоставляет совместимость для Node.js 18.x на Vercel
// Он автоматически загружается перед запуском приложения

// Проверка версии Node.js
console.log('Running on Node.js version:', process.version);

// Добавляем полифил для import.meta.dirname
if (typeof globalThis.import === 'object' && 
    typeof globalThis.import.meta === 'object' && 
    typeof globalThis.import.meta.dirname === 'undefined') {
  
  // Предотвращаем ошибки при запуске в Node.js 18
  Object.defineProperty(globalThis.import.meta, 'dirname', {
    value: process.cwd(),
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  console.log('Added dirname polyfill for Node.js 18 compatibility');
}

// Экспортируем пустой объект, чтобы файл можно было импортировать
export default {};