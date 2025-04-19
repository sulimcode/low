// Файл настройки для Vercel
// Указывает на использование Node.js 18.x
module.exports = {
  version: 2,
  builds: [
    {
      src: 'package.json',
      use: '@vercel/node@18.x',
      config: { 
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        installCommand: 'npm install'
      }
    }
  ],
  routes: [
    { src: '/api/(.*)', dest: '/api/[[...path]].ts' },
    { src: '/(.*)', dest: '/index.html' }
  ]
};