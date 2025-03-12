import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  state: text("state").notNull(),
  role: text("role").notNull(), // 'farmer', 'buyer', 'admin'
  passwordHash: text("password_hash").notNull(),
  isVerified: boolean("is_verified").default(false),
  deliverySpeedVotes: integer("delivery_speed_votes").default(0),
  performanceVotes: integer("performance_votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const farms = pgTable("farms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  farmSize: text("farm_size").notNull(),
  mainCrops: text("main_crops").notNull(),
  lga: text("lga").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").notNull().references(() => users.id),
  cropName: text("crop_name").notNull(),
  category: text("category").notNull(), // 'Food crop', 'Cash crop'
  quantity: numeric("quantity").notNull(),
  unit: text("unit").notNull(), // 'kg', 'ton', 'bags'
  price: numeric("price").notNull(),
  harvestDate: timestamp("harvest_date"),
  imageUrl: text("image_url"),
  boosted: boolean("boosted").default(false),
  status: text("status").notNull().default("Available"), // 'Available', 'Sold'
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  farm: one(farms, {
    fields: [users.id],
    references: [farms.userId],
  }),
  listings: many(listings),
}));

export const farmsRelations = relations(farms, ({ one }) => ({
  user: one(users, {
    fields: [farms.userId],
    references: [users.id],
  }),
}));

export const listingsRelations = relations(listings, ({ one }) => ({
  farmer: one(users, {
    fields: [listings.farmerId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, isVerified: true });
export const insertFarmSchema = createInsertSchema(farms).omit({ id: true, createdAt: true, userId: true });
export const insertListingSchema = createInsertSchema(listings).omit({ id: true, createdAt: true, farmerId: true, views: true, boosted: true, status: true });

// Type Inference
export type User = typeof users.$inferSelect;
export type Farm = typeof farms.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertFarm = z.infer<typeof insertFarmSchema>;
export type InsertListing = z.infer<typeof insertListingSchema>;

// API Contracts
export const loginSchema = z.object({
  phone: z.string(),
  password: z.string(),
});
export type LoginRequest = z.infer<typeof loginSchema>;
export type UpdateListingRequest = Partial<InsertListing> & { status?: string, boosted?: boolean };