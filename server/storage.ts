import { users, rides, locations, type User, type Ride, type Location, type InsertUser, type InsertRide, type InsertLocation } from "@shared/schema";
import { db } from "./db";
import { eq, or, desc, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getDrivers(): Promise<User[]>;
  
  // Ride operations
  createRide(ride: InsertRide): Promise<Ride>;
  getRide(id: number): Promise<Ride | undefined>;
  updateRideStatus(id: number, status: string, driverId?: number): Promise<Ride>;
  getUserRides(userId: number): Promise<Ride[]>;
  
  // Location operations
  updateLocation(location: InsertLocation): Promise<Location>;
  getDriverLocations(): Promise<Location[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rides: Map<number, Ride>;
  private locations: Map<number, Location>;
  private currentUserId: number;
  private currentRideId: number;
  private currentLocationId: number;

  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.locations = new Map();
    this.currentUserId = 1;
    this.currentRideId = 1;
    this.currentLocationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, rating: 5 };
    this.users.set(id, user);
    return user;
  }

  async getDrivers(): Promise<User[]> {
    return Array.from(this.users.values()).filter((user) => user.isDriver);
  }

  async createRide(ride: InsertRide): Promise<Ride> {
    const id = this.currentRideId++;
    const newRide: Ride = {
      ...ride,
      id,
      status: "pending",
      driverId: null,
      createdAt: new Date(),
    };
    this.rides.set(id, newRide);
    return newRide;
  }

  async getRide(id: number): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async updateRideStatus(id: number, status: string, driverId?: number): Promise<Ride> {
    const ride = this.rides.get(id);
    if (!ride) throw new Error("Ride not found");
    
    const updatedRide: Ride = {
      ...ride,
      status,
      ...(driverId && { driverId }),
    };
    this.rides.set(id, updatedRide);
    return updatedRide;
  }

  async getUserRides(userId: number): Promise<Ride[]> {
    return Array.from(this.rides.values()).filter(
      (ride) => ride.userId === userId || ride.driverId === userId,
    );
  }

  async updateLocation(location: InsertLocation): Promise<Location> {
    const id = this.currentLocationId++;
    const newLocation: Location = {
      ...location,
      id,
      timestamp: new Date(),
    };
    this.locations.set(id, newLocation);
    return newLocation;
  }

  async getDriverLocations(): Promise<Location[]> {
    const drivers = await this.getDrivers();
    const driverIds = new Set(drivers.map(d => d.id));
    return Array.from(this.locations.values())
      .filter(loc => driverIds.has(loc.userId))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, rating: 5 })
      .returning();
    return user;
  }

  async getDrivers(): Promise<User[]> {
    return db.select().from(users).where(eq(users.isDriver, true));
  }

  async createRide(ride: InsertRide): Promise<Ride> {
    const [newRide] = await db
      .insert(rides)
      .values({ ...ride, status: "pending", driverId: null })
      .returning();
    return newRide;
  }

  async getRide(id: number): Promise<Ride | undefined> {
    const [ride] = await db.select().from(rides).where(eq(rides.id, id));
    return ride;
  }

  async updateRideStatus(id: number, status: string, driverId?: number): Promise<Ride> {
    const [updatedRide] = await db
      .update(rides)
      .set({
        status,
        ...(driverId !== undefined && { driverId }),
      })
      .where(eq(rides.id, id))
      .returning();
    if (!updatedRide) throw new Error("Ride not found");
    return updatedRide;
  }

  async getUserRides(userId: number): Promise<Ride[]> {
    return db
      .select()
      .from(rides)
      .where(or(eq(rides.userId, userId), eq(rides.driverId, userId)));
  }

  async updateLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db
      .insert(locations)
      .values(location)
      .returning();
    return newLocation;
  }

  async getDriverLocations(): Promise<Location[]> {
    const drivers = await this.getDrivers();
    const driverIds = drivers.map((d) => d.id);
    if (driverIds.length === 0) return [];
    return db
      .select()
      .from(locations)
      .where(inArray(locations.userId, driverIds))
      .orderBy(desc(locations.timestamp));
  }
}

export const storage = new DbStorage();
