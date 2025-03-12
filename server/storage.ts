import { users, farms, listings } from "@shared/schema";
import type { User, InsertUser, Farm, InsertFarm, Listing, InsertListing } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser & { passwordHash: string }): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  
  createFarm(farm: InsertFarm & { userId: number }): Promise<Farm>;
  getFarmByUserId(userId: number): Promise<Farm | undefined>;
  
  createListing(listing: InsertListing & { farmerId: number }): Promise<Listing>;
  getListings(filters?: { search?: string, category?: string, state?: string, minPrice?: string, maxPrice?: string }): Promise<Array<{listing: Listing, farmer: User, farm: Farm | undefined}>>;
  getListing(id: number): Promise<{listing: Listing, farmer: User, farm: Farm | undefined} | undefined>;
  getListingsByFarmer(farmerId: number): Promise<Listing[]>;
  updateListing(id: number, updates: Partial<InsertListing> & { status?: string, boosted?: boolean }): Promise<Listing>;
  deleteListing(id: number): Promise<void>;
  incrementListingViews(id: number): Promise<number>;
  
  getTrendingCrops(): Promise<Array<{cropName: string, count: number}>>;
  getPriceInsights(cropName?: string): Promise<{averagePrice: number, minPrice: number, maxPrice: number}>;
  
  getAllUsers(): Promise<User[]>;
  verifyFarmer(id: number): Promise<User>;
  getTotalCropsPerState(): Promise<Record<string, number>>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async createUser(user: InsertUser & { passwordHash: string }): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updated;
  }

  async createFarm(farm: InsertFarm & { userId: number }): Promise<Farm> {
    const [newFarm] = await db.insert(farms).values(farm).returning();
    return newFarm;
  }

  async getFarmByUserId(userId: number): Promise<Farm | undefined> {
    const [farm] = await db.select().from(farms).where(eq(farms.userId, userId));
    return farm;
  }

  async createListing(listing: InsertListing & { farmerId: number }): Promise<Listing> {
    const [newListing] = await db.insert(listings).values(listing).returning();
    return newListing;
  }

  async getListings(filters?: { search?: string, category?: string, state?: string, minPrice?: string, maxPrice?: string }) {
    let query = db
      .select({
        listing: listings,
        farmer: users,
        farm: farms
      })
      .from(listings)
      .innerJoin(users, eq(listings.farmerId, users.id))
      .leftJoin(farms, eq(users.id, farms.userId));
      
    const conditions = [];
    if (filters?.search) {
      conditions.push(ilike(listings.cropName, `%${filters.search}%`));
    }
    if (filters?.category) {
      conditions.push(eq(listings.category, filters.category));
    }
    if (filters?.state) {
      conditions.push(ilike(users.state, `%${filters.state}%`));
    }
    if (filters?.minPrice) {
      conditions.push(gte(listings.price, filters.minPrice));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(listings.price, filters.maxPrice));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    query = query.orderBy(desc(listings.boosted), desc(listings.createdAt)) as any;
    
    return await query;
  }

  async getListing(id: number) {
    const [result] = await db
      .select({
        listing: listings,
        farmer: users,
        farm: farms
      })
      .from(listings)
      .where(eq(listings.id, id))
      .innerJoin(users, eq(listings.farmerId, users.id))
      .leftJoin(farms, eq(users.id, farms.userId));
    return result;
  }

  async getListingsByFarmer(farmerId: number): Promise<Listing[]> {
    return await db.select().from(listings).where(eq(listings.farmerId, farmerId)).orderBy(desc(listings.createdAt));
  }

  async updateListing(id: number, updates: Partial<InsertListing> & { status?: string, boosted?: boolean }): Promise<Listing> {
    const [updated] = await db.update(listings).set(updates).where(eq(listings.id, id)).returning();
    return updated;
  }

  async deleteListing(id: number): Promise<void> {
    await db.delete(listings).where(eq(listings.id, id));
  }

  async incrementListingViews(id: number): Promise<number> {
    const [updated] = await db.update(listings)
      .set({ views: sql`${listings.views} + 1` })
      .where(eq(listings.id, id))
      .returning({ views: listings.views });
    return updated?.views ?? 0;
  }

  async getTrendingCrops() {
    const result = await db.execute(
      sql`SELECT crop_name, COUNT(*) as count FROM listings GROUP BY crop_name ORDER BY count DESC LIMIT 5`
    );
    return result.rows.map(r => ({ cropName: r.crop_name as string, count: Number(r.count) }));
  }

  async getPriceInsights(cropName?: string) {
    let querySql = sql`SELECT AVG(price::numeric) as avg_price, MIN(price::numeric) as min_price, MAX(price::numeric) as max_price FROM listings`;
    if (cropName) {
      querySql = sql`SELECT AVG(price::numeric) as avg_price, MIN(price::numeric) as min_price, MAX(price::numeric) as max_price FROM listings WHERE crop_name ILIKE ${'%' + cropName + '%'}`;
    }
    
    const result = await db.execute(querySql);
    if (result.rows.length > 0 && result.rows[0].avg_price !== null) {
      return {
        averagePrice: Number(result.rows[0].avg_price),
        minPrice: Number(result.rows[0].min_price),
        maxPrice: Number(result.rows[0].max_price),
      };
    }
    return { averagePrice: 0, minPrice: 0, maxPrice: 0 };
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async verifyFarmer(id: number): Promise<User> {
    const [updated] = await db.update(users).set({ isVerified: true }).where(eq(users.id, id)).returning();
    return updated;
  }

  async upvoteUser(id: number, type: 'deliverySpeed' | 'performance'): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const currentValue = type === 'deliverySpeed' 
      ? (user.deliverySpeedVotes || 0) 
      : (user.performanceVotes || 0);

    const [updated] = await db.update(users)
      .set({ [type === 'deliverySpeed' ? 'deliverySpeedVotes' : 'performanceVotes']: currentValue + 1 })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getTotalCropsPerState(): Promise<Record<string, number>> {
    const result = await db.execute(
      sql`SELECT u.state, COUNT(l.id) as count FROM users u JOIN listings l ON u.id = l.farmer_id GROUP BY u.state`
    );
    const record: Record<string, number> = {};
    result.rows.forEach(r => {
      record[r.state as string] = Number(r.count);
    });
    return record;
  }
}

export const storage = new DatabaseStorage();
