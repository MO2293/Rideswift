import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isDriver: boolean("is_driver").notNull().default(false),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  rating: integer("rating"),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  driverId: integer("driver_id"),
  status: text("status").notNull(), // "pending", "accepted", "completed", "cancelled"
  pickup: jsonb("pickup").notNull(), // {lat: number, lng: number, address: string}
  dropoff: jsonb("dropoff").notNull(), // {lat: number, lng: number, address: string}
  fare: integer("fare").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  location: jsonb("location").notNull(), // {lat: number, lng: number}
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isDriver: true,
  name: true,
  phone: true,
});

export const insertRideSchema = createInsertSchema(rides).pick({
  userId: true,
  pickup: true,
  dropoff: true,
  fare: true,
});

export const insertLocationSchema = createInsertSchema(locations).pick({
  userId: true,
  location: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type InsertLocation = z.infer<typeof insertLocationSchema>;

export type User = typeof users.$inferSelect;
export type Ride = typeof rides.$inferSelect;
export type Location = typeof locations.$inferSelect;
