import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, hashPassword } from "./auth";
import passport from "passport";

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      phone: string;
      role: string;
      isVerified: boolean | null;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const requireFarmer = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || req.user.role !== 'Farmer') {
      return res.status(401).json({ message: "Requires Farmer role" });
    }
    next();
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || req.user.role !== 'Admin') {
      return res.status(401).json({ message: "Requires Admin role" });
    }
    next();
  };

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByPhone(input.phone);
      if (existingUser) {
        return res.status(400).json({ message: "Phone number already registered", field: "phone" });
      }
      const passwordHash = await hashPassword(req.body.password);
      const user = await storage.createUser({ ...input, passwordHash });
      
      req.login(user, (err: any) => {
        if (err) return res.status(500).json({ message: "Error logging in" });
        return res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Error logging out" });
      res.status(200).json({ message: "Logged out" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(req.user);
  });

  // Farm Routes
  app.post(api.farms.create.path, requireFarmer, async (req, res) => {
    try {
      const input = api.farms.create.input.parse(req.body);
      const existingFarm = await storage.getFarmByUserId(req.user!.id);
      if (existingFarm) {
        return res.status(400).json({ message: "Farm profile already exists" });
      }
      const farm = await storage.createFarm({ ...input, userId: req.user!.id });
      res.status(201).json(farm);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.farms.getMine.path, requireAuth, async (req, res) => {
    try {
      const farm = await storage.getFarmByUserId(req.user!.id);
      if (!farm) return res.status(404).json({ message: "Farm not found" });
      res.status(200).json(farm);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Listings Routes
  app.post(api.listings.create.path, requireFarmer, async (req, res) => {
    try {
      const input = api.listings.create.input.parse(req.body);
      const listing = await storage.createListing({ ...input, farmerId: req.user!.id });
      res.status(201).json(listing);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.listings.list.path, async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        state: req.query.state as string,
        minPrice: req.query.minPrice as string,
        maxPrice: req.query.maxPrice as string,
      };
      const listings = await storage.getListings(filters);
      res.status(200).json(listings);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.listings.getMine.path, requireFarmer, async (req, res) => {
    try {
      const listings = await storage.getListingsByFarmer(req.user!.id);
      res.status(200).json(listings);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.listings.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getListing(id);
      if (!listing) return res.status(404).json({ message: "Listing not found" });
      res.status(200).json(listing);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch(api.listings.update.path, requireFarmer, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listingInfo = await storage.getListing(id);
      if (!listingInfo) return res.status(404).json({ message: "Listing not found" });
      if (listingInfo.listing.farmerId !== req.user!.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const input = api.listings.update.input.parse(req.body);
      const updated = await storage.updateListing(id, input);
      res.status(200).json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.listings.delete.path, requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listingInfo = await storage.getListing(id);
      if (!listingInfo) return res.status(404).json({ message: "Listing not found" });
      if (listingInfo.listing.farmerId !== req.user!.id && req.user!.role !== 'Admin') {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await storage.deleteListing(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.listings.recordView.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const views = await storage.incrementListingViews(id);
      res.status(200).json({ views });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics Routes
  app.get(api.analytics.trendingCrops.path, async (req, res) => {
    try {
      const trends = await storage.getTrendingCrops();
      res.status(200).json(trends);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.analytics.priceInsights.path, async (req, res) => {
    try {
      const cropName = req.query.cropName as string;
      const insights = await storage.getPriceInsights(cropName);
      res.status(200).json(insights);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin Routes
  app.get(api.admin.users.path, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.admin.verifyFarmer.path, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.verifyFarmer(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.admin.stats.path, requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getTotalCropsPerState();
      res.status(200).json({ totalCropsPerState: stats });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Upvote Routes
  app.post(api.votes.upvote.path, requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { type } = api.votes.upvote.input.parse(req.body);
      const user = await storage.upvoteUser(id, type);
      res.status(200).json({ 
        deliverySpeedVotes: user.deliverySpeedVotes || 0, 
        performanceVotes: user.performanceVotes || 0 
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed DB with demo data (run async to not block startup)
  seedDatabase().catch(console.error);

  return httpServer;
}

async function seedDatabase() {
  const users = await storage.getAllUsers();
  if (users.length === 0) {
    console.log("Seeding database with demo data...");
    const adminHash = await hashPassword("admin123");
    const farmerHash = await hashPassword("farmer123");
    const buyerHash = await hashPassword("buyer123");

    const admin = await storage.createUser({
      name: "Admin User",
      phone: "0000000000",
      state: "Lagos",
      role: "Admin",
      passwordHash: adminHash,
    });

    const farmer1 = await storage.createUser({
      name: "John Doe",
      phone: "1111111111",
      state: "Kano",
      role: "Farmer",
      passwordHash: farmerHash,
    });
    
    const farmer2 = await storage.createUser({
      name: "Jane Smith",
      phone: "2222222222",
      state: "Oyo",
      role: "Farmer",
      passwordHash: farmerHash,
    });

    const buyer = await storage.createUser({
      name: "Acme Foods",
      phone: "3333333333",
      state: "Lagos",
      role: "Buyer",
      passwordHash: buyerHash,
    });

    await storage.verifyFarmer(farmer1.id);

    await storage.createFarm({
      userId: farmer1.id,
      farmSize: "5 Hectares",
      mainCrops: "Maize, Soybeans",
      lga: "Dala"
    });

    await storage.createFarm({
      userId: farmer2.id,
      farmSize: "2 Hectares",
      mainCrops: "Cassava",
      lga: "Ibadan North"
    });

    await storage.createListing({
      farmerId: farmer1.id,
      cropName: "White Maize",
      category: "Food crop",
      quantity: "50",
      unit: "bags",
      price: "15000",
      status: "Available",
      boosted: true,
      imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    });

    await storage.createListing({
      farmerId: farmer1.id,
      cropName: "Soybeans",
      category: "Cash crop",
      quantity: "2",
      unit: "ton",
      price: "450000",
      status: "Available",
      boosted: false,
      imageUrl: "https://images.unsplash.com/photo-1599863486307-e81882bd6d7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    });

    await storage.createListing({
      farmerId: farmer2.id,
      cropName: "Cassava Tubers",
      category: "Food crop",
      quantity: "100",
      unit: "kg",
      price: "2000",
      status: "Available",
      boosted: false,
      imageUrl: "https://images.unsplash.com/photo-1628156107384-59e55717bc44?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    });
    console.log("Database seeded successfully.");
  }
}
