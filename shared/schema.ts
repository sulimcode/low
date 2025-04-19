import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User preferences table
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  method: integer("calculation_method").default(2), // Default to Islamic Society of North America
  language: text("language").default("en"),
  theme: text("theme").default("light"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Cache table for prayer times
export const prayerTimesCache = pgTable("prayer_times_cache", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  date: text("date").notNull(),
  method: integer("calculation_method").default(2),
  times: text("times").notNull(), // JSON string of prayer times
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const insertPrayerTimesCacheSchema = createInsertSchema(prayerTimesCache).omit({
  id: true,
  createdAt: true,
});

export type InsertPrayerTimesCache = z.infer<typeof insertPrayerTimesCacheSchema>;
export type PrayerTimesCache = typeof prayerTimesCache.$inferSelect;

// Users table in case authentication is needed later
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
