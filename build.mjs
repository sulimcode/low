// Специальный скрипт для сборки проекта на Vercel (ES модуль версия)
// Запускается перед основной сборкой для подготовки окружения

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

console.log('Node.js version:', process.version);
console.log('Current working directory:', process.cwd());

// Get the directory name equivalent in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Проверяем, выполняется ли сборка на Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_DEPLOYMENT;
console.log('Building on Vercel:', isVercel ? 'Yes' : 'No');

// Функция для выполнения команд
function run(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`, error);
    process.exit(1);
  }
}

// Если это сборка на Vercel, выполняем дополнительные шаги
if (isVercel) {
  try {
    // Проверяем наличие входного файла Vite
    const clientIndexPath = path.join(process.cwd(), 'client', 'index.html');
    
    if (fs.existsSync(clientIndexPath)) {
      console.log(`Found client/index.html at ${clientIndexPath}`);
      
      // Копируем файл в корневую директорию, чтобы Vite мог его найти
      const rootIndexPath = path.join(process.cwd(), 'index.html');
      fs.copyFileSync(clientIndexPath, rootIndexPath);
      console.log(`Copied client/index.html to ${rootIndexPath}`);
    } else {
      console.error('ERROR: client/index.html not found!');
      console.log('Files in client directory:');
      try {
        const clientFiles = fs.readdirSync(path.join(process.cwd(), 'client'));
        console.log(clientFiles);
      } catch (e) {
        console.error('Could not read client directory:', e);
      }
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during Vercel build preparation:', error);
    process.exit(1);
  }
}

console.log('Build preparation completed successfully.');