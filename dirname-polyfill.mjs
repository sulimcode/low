// This module provides Node.js 18.x compatibility for import.meta.dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Create a dirname polyfill for ESM
export function getPathFromRoot(...pathSegments) {
  return path.join(process.cwd(), ...pathSegments);
}

export function getDirname(importMeta) {
  const filename = fileURLToPath(importMeta.url);
  return dirname(filename);
}

// Provide a global polyfill if running on Node.js versions without import.meta.dirname
if (typeof import.meta === 'object' && !('dirname' in import.meta)) {
  Object.defineProperty(import.meta, 'dirname', {
    get() {
      return getDirname(import.meta);
    }
  });
  console.log('Applied import.meta.dirname polyfill');
}

export default { getPathFromRoot, getDirname };