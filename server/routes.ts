import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertRideSchema, insertLocationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.get("/api/drivers", async (req, res) => {
    const drivers = await storage.getDrivers();
    res.json(drivers);
  });

  // Ride routes
  app.post("/api/rides", async (req, res) => {
    try {
      const rideData = insertRideSchema.parse(req.body);
      const ride = await storage.createRide(rideData);
      
      // Notify all connected drivers about new ride
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "NEW_RIDE", ride }));
        }
      });
      
      res.json(ride);
    } catch (error) {
      res.status(400).json({ error: "Invalid ride data" });
    }
  });

  app.patch("/api/rides/:id", async (req, res) => {
    const { id } = req.params;
    const { status, driverId } = req.body;
    
    try {
      const ride = await storage.updateRideStatus(Number(id), status, driverId);
      
      // Notify relevant parties about ride status change
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "RIDE_UPDATE", ride }));
        }
      });
      
      res.json(ride);
    } catch (error) {
      res.status(404).json({ error: "Ride not found" });
    }
  });

  app.get("/api/users/:userId/rides", async (req, res) => {
    const { userId } = req.params;
    const rides = await storage.getUserRides(Number(userId));
    res.json(rides);
  });

  // Location routes
  app.post("/api/locations", async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const location = await storage.updateLocation(locationData);
      
      // Broadcast location update to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "LOCATION_UPDATE", location }));
        }
      });
      
      res.json(location);
    } catch (error) {
      res.status(400).json({ error: "Invalid location data" });
    }
  });

  app.get("/api/drivers/locations", async (req, res) => {
    const locations = await storage.getDriverLocations();
    res.json(locations);
  });

  return httpServer;
}
