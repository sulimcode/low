// Middleware функция для Vercel Serverless Functions
// Это позволяет выполнять предварительные операции перед запуском API функций

// @ts-ignore - Игнорируем отсутствие типов
import type { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';

// Полифил для import.meta.dirname в Node.js 18
if (typeof import.meta.dirname === 'undefined') {
  // @ts-ignore - Расширяем import.meta
  import.meta.dirname = process.cwd();
}

// Middleware высшего порядка для обработки CORS
export const withCors = (handler: VercelApiHandler) => async (req: VercelRequest, res: VercelResponse) => {
  // Настраиваем CORS заголовки для API запросов
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  // Обработка preflight запросов
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Вызываем основной обработчик
  return handler(req, res);
};

// Экспортируем middleware по умолчанию
const middleware = (req: VercelRequest, res: VercelResponse) => {
  res.status(200).json({ message: 'Middleware is running correctly' });
};

export default withCors(middleware);