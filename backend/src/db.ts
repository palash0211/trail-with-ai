import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@shared/schema';

// Get database configuration from environment variables
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432'),
  ssl: process.env.NODE_ENV === 'production',
});

// Create drizzle instance with the schema
export const db = drizzle(pool, { schema });

// Interface for storage abstraction
export interface IStorage {
  getUser(id: number): Promise<schema.User | undefined>;
  getUserByUsername(username: string): Promise<schema.User | undefined>;
  createUser(insertUser: schema.InsertUser): Promise<schema.User>;
  createSession(userId: number, token: string, expiresAt: Date): Promise<schema.Session>;
  getSessionByToken(token: string): Promise<schema.Session | undefined>;
  deleteSession(token: string): Promise<boolean>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<schema.User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async createUser(insertUser: schema.InsertUser): Promise<schema.User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  async createSession(userId: number, token: string, expiresAt: Date): Promise<schema.Session> {
    const [session] = await db
      .insert(schema.sessions)
      .values({
        userId,
        token,
        expiresAt,
      })
      .returning();
    return session;
  }

  async getSessionByToken(token: string): Promise<schema.Session | undefined> {
    const [session] = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.token, token));
    return session;
  }

  async deleteSession(token: string): Promise<boolean> {
    const result = await db
      .delete(schema.sessions)
      .where(eq(schema.sessions.token, token));
    return true;
  }
}

// Import statement for eq that was missing
import { eq } from 'drizzle-orm';

// Export the storage instance
export const storage = new DatabaseStorage();
