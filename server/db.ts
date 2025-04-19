// Импорт полифила import.meta.dirname
import './dirname-import.js';

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Настройка для Neon serverless PostgreSQL
neonConfig.webSocketConstructor = ws;

// Для поддержки локальных разработчиков и Vercel
const getDatabaseUrl = (): string => {
  // Log environment for debugging
  console.log('Running in env:', process.env.NODE_ENV);
  
  // Проверяем все возможные названия переменных для Vercel и других хостингов
  if (process.env.POSTGRES_URL) {
    console.log('Using POSTGRES_URL database connection');
    return process.env.POSTGRES_URL;
  }
  
  if (process.env.DATABASE_URL) {
    console.log('Using DATABASE_URL database connection');
    return process.env.DATABASE_URL; 
  }
  
  if (process.env.POSTGRES_PRISMA_URL) {
    console.log('Using POSTGRES_PRISMA_URL database connection');
    return process.env.POSTGRES_PRISMA_URL;
  }
  
  if (process.env.DB_URL) {
    console.log('Using DB_URL database connection');
    return process.env.DB_URL;
  }
  
  // Для локальной разработки можно установить дефолтное значение
  console.warn("DATABASE_URL not set, using in-memory storage");
  return "";
};

const dbUrl = getDatabaseUrl();

// Объявляем переменные с экспортом
export let pool: Pool | null = null;
export let db: any = null;

// Проверяем, есть ли URL базы данных
if (dbUrl) {
  pool = new Pool({ connectionString: dbUrl });
  db = drizzle({ client: pool, schema });
} else {
  // Создаем заглушку для db, которая будет использовать in-memory хранилище
  console.warn("No database connection, using in-memory storage");
  // Создаем пустые функции, чтобы избежать ошибок при вызове db методов
  db = {
    execute: async () => { console.log("DB execute called but no database is connected"); return []; },
    select: () => ({ from: () => ({ where: () => Promise.resolve([]) }) }),
    insert: () => ({ values: () => ({ returning: () => Promise.resolve([]) }) }),
    update: () => ({ set: () => ({ where: () => Promise.resolve([]) }) })
  };
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Проверяем, есть ли соединение с базой данных
    if (!dbUrl) {
      console.log("No database connection, skipping schema initialization");
      return;
    }
    
    console.log("Checking database schema...");
    
    // Execute the migration
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        ip_address TEXT NOT NULL,
        location TEXT NOT NULL,
        latitude TEXT,
        longitude TEXT,
        calculation_method INTEGER DEFAULT 2,
        language TEXT DEFAULT 'en',
        theme TEXT DEFAULT 'light',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS prayer_times_cache (
        id SERIAL PRIMARY KEY,
        location TEXT NOT NULL,
        latitude TEXT,
        longitude TEXT,
        date TEXT NOT NULL,
        calculation_method INTEGER DEFAULT 2,
        times TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP NOT NULL
      );
    `);
    
    console.log("Database schema is ready");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}
