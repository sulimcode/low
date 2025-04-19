// Этот скрипт запускается после завершения основной сборки на Vercel
// для настройки окружения развертывания

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

console.log('Running post-build process for Vercel compatibility');
console.log('Node.js version:', process.version);

// Get the directory name equivalent in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Проверяем, есть ли указатели на запуск на Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_DEPLOYMENT || process.env.CI;
console.log('Running on Vercel:', isVercel ? 'Yes' : 'No');

// Функция для выполнения команд
function run(command) {
  try {
    console.log(`Executing: ${command}`);
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(`Failed to execute: ${command}`, error);
    return null;
  }
}

// Функция для проверки и копирования файлов
function ensureFile(source, destination, requireSource = true) {
  try {
    if (fs.existsSync(source)) {
      console.log(`Copying ${source} -> ${destination}`);
      fs.copyFileSync(source, destination);
      return true;
    } else if (requireSource) {
      console.error(`Error: Source file not found: ${source}`);
      return false;
    } else {
      console.log(`Source file not found (optional): ${source}`);
      return false;
    }
  } catch (error) {
    console.error(`Error copying file ${source} -> ${destination}:`, error);
    return false;
  }
}

// Функция для создания файла с содержимым
function createFile(filename, content) {
  try {
    console.log(`Creating file: ${filename}`);
    fs.writeFileSync(filename, content);
    return true;
  } catch (error) {
    console.error(`Error creating file ${filename}:`, error);
    return false;
  }
}

// Основной скрипт
try {
  console.log('Post-build process started');
  
  // Путь к директории сборки
  const distDir = path.join(process.cwd(), 'dist');
  const publicDir = path.join(distDir, 'public');
  const apiDir = path.join(distDir, 'api');
  
  // Проверяем существование директорий
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory does not exist');
    process.exit(1);
  }
  
  // Создаем директорию для API, если её нет
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  // Проверяем существование директории public
  if (!fs.existsSync(publicDir)) {
    console.error('Warning: public directory does not exist in dist');
  }
  
  // Список файлов для проверки в директории dist/public
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    console.log('Files in dist/public:');
    console.log(files);
  }
  
  // Создаем файл-проверку для понимания, что скрипт выполнился
  createFile(path.join(distDir, 'vercel-build-completed.txt'), 
    `Build completed: ${new Date().toISOString()}\nNode.js: ${process.version}\n`);
  
  console.log('Post-build process completed successfully');
} catch (error) {
  console.error('Post-build process failed:', error);
  process.exit(1);
}