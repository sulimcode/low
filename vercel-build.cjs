// Файл запускается при сборке на Vercel (CommonJS версия)
// Используется как основной скрипт для подготовки сборки

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Vercel build script (CJS version) started');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// Проверяем, выполняется ли сборка на Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_DEPLOYMENT;
console.log('Running on Vercel:', isVercel ? 'Yes' : 'No');

// Функция для выполнения команд
function run(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`, error);
    return false;
  }
}

// Основная функция для подготовки к сборке
function prepareVercelBuild() {
  if (!isVercel) {
    console.log('Not running on Vercel, skipping preparation');
    return true;
  }

  try {
    console.log('Starting Vercel build preparation');

    // Create polyfill for import.meta.dirname
    console.log('Creating polyfill for import.meta.dirname');
    const polyfillContent = `
// This module provides Node.js 18.x compatibility for import.meta.dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Create a dirname polyfill for ESM
export function getPathFromRoot(...pathSegments) {
  return pathSegments.join('/');
}

export function getDirname() {
  const filename = fileURLToPath(import.meta.url);
  return dirname(filename);
}

// Provide a global polyfill if running on Node.js versions without import.meta.dirname
if (typeof import.meta === 'object' && !('dirname' in import.meta)) {
  Object.defineProperty(import.meta, 'dirname', {
    get() {
      return getDirname();
    }
  });
}
`;
    
    // Write the polyfill file if it doesn't exist
    const polyfillPath = path.join(process.cwd(), 'dirname-polyfill.mjs');
    if (!fs.existsSync(polyfillPath)) {
      fs.writeFileSync(polyfillPath, polyfillContent);
      console.log('Created dirname-polyfill.mjs');
    }

    // Проверяем наличие входного файла Vite
    const clientIndexPath = path.join(process.cwd(), 'client', 'index.html');
    const rootIndexPath = path.join(process.cwd(), 'index.html');
    
    // Copy client/index.html to the root directory for Vite build
    if (fs.existsSync(clientIndexPath)) {
      console.log(`Found client/index.html at ${clientIndexPath}`);
      fs.copyFileSync(clientIndexPath, rootIndexPath);
      console.log(`Copied client/index.html to ${rootIndexPath}`);
      
      // Update the script path in the copied index.html
      let indexContent = fs.readFileSync(rootIndexPath, 'utf-8');
      indexContent = indexContent.replace(
        '<script type="module" src="/src/main.tsx"></script>',
        '<script type="module" src="/client/src/main.tsx"></script>'
      );
      fs.writeFileSync(rootIndexPath, indexContent);
      console.log('Updated script path in index.html');
      
      return true;
    } else {
      console.error('ERROR: client/index.html not found!');
      
      // List directories for debugging
      console.log('Files in root directory:');
      try {
        const rootFiles = fs.readdirSync(process.cwd());
        console.log(rootFiles);
      } catch (e) {
        console.error('Error reading root directory:', e);
      }
      
      console.log('Files in client directory:');
      try {
        const clientFiles = fs.readdirSync(path.join(process.cwd(), 'client'));
        console.log(clientFiles);
      } catch (e) {
        console.error('Error reading client directory:', e);
      }
      
      const clientSrcDirPath = path.join(process.cwd(), 'client', 'src');
      if (fs.existsSync(clientSrcDirPath)) {
        console.log('Files in client/src directory:');
        try {
          const clientSrcFiles = fs.readdirSync(clientSrcDirPath);
          console.log(clientSrcFiles);
        } catch (e) {
          console.error('Error reading client/src directory:', e);
        }
      }
      
      // Create a minimal index.html as fallback
      console.log('Creating minimal index.html as fallback...');
      const minimalHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prayer Times App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/client/src/main.tsx"></script>
</body>
</html>`;
      
      fs.writeFileSync(rootIndexPath, minimalHTML);
      console.log('Created minimal index.html in root directory');
      return true;
    }
  } catch (error) {
    console.error('Error during Vercel build preparation:', error);
    return false;
  }
}

// Запускаем подготовку
if (prepareVercelBuild()) {
  console.log('Vercel build preparation completed successfully');
} else {
  console.error('Vercel build preparation failed');
  process.exit(1);
}

// Экспортируем функции для возможного использования
module.exports = {
  run,
  prepareVercelBuild
};