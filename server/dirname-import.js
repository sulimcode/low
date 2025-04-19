// Файл создает полифил для import.meta.dirname в Node.js 18.x
// Это полностью совместимо с Vercel и другими средами
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Если import.meta.dirname не определен, добавляем его
if (typeof import.meta === 'object' && !('dirname' in import.meta)) {
  Object.defineProperty(import.meta, 'dirname', {
    get() {
      return dirname(fileURLToPath(import.meta.url));
    }
  });
  console.log('Added import.meta.dirname polyfill for Node.js 18.x');
}

export default {};