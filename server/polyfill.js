// Полифил для import.meta.dirname в Node.js 18.x
// Этот файл экспортирует функцию getPathFromRoot, которая заменяет import.meta.dirname

import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Функция для получения путей из корневой директории проекта
 * Замена import.meta.dirname в Node.js 18.x
 */
export function getPathFromRoot(...pathSegments) {
  // Используем process.cwd() для получения текущей рабочей директории
  return path.join(process.cwd(), ...pathSegments);
}

// Получение dirname из URL модуля в ESM
export function getDirname() {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
}

console.log('Node.js 18.x compatibility helpers loaded successfully');