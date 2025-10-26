import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, giveawayEntries, InsertGiveawayEntry } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// In-memory storage for testing when database is not available
const inMemoryStorage = {
  giveawayEntries: [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "555-0123",
      nflTeam: "Kansas City Chiefs",
      clickedSurvey: 1,
      createdAt: new Date("2024-01-15T10:30:00Z"),
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phone: "555-0456",
      nflTeam: "San Francisco 49ers",
      clickedSurvey: 0,
      createdAt: new Date("2024-01-16T14:20:00Z"),
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@example.com",
      phone: "555-0789",
      nflTeam: "Buffalo Bills",
      clickedSurvey: 1,
      createdAt: new Date("2024-01-17T09:15:00Z"),
    },
  ] as any[],
  users: [] as any[],
};

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Giveaway entry queries
export async function createGiveawayEntry(entry: InsertGiveawayEntry) {
  const db = await getDb();
  if (!db) {
    // Use in-memory storage for testing
    const newEntry = {
      id: inMemoryStorage.giveawayEntries.length + 1,
      ...entry,
      createdAt: new Date(),
    };
    inMemoryStorage.giveawayEntries.push(newEntry);
    return [{ insertId: newEntry.id }];
  }

  const result = await db.insert(giveawayEntries).values(entry);
  return result;
}

export async function getAllGiveawayEntries() {
  const db = await getDb();
  if (!db) {
    // Use in-memory storage for testing
    return inMemoryStorage.giveawayEntries.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  const entries = await db.select().from(giveawayEntries).orderBy(giveawayEntries.createdAt);
  return entries;
}

export async function markSurveyClicked(entryId: number) {
  const db = await getDb();
  if (!db) {
    // Use in-memory storage for testing
    const entry = inMemoryStorage.giveawayEntries.find(e => e.id === entryId);
    if (entry) {
      entry.clickedSurvey = 1;
    }
    return;
  }

  await db.update(giveawayEntries)
    .set({ clickedSurvey: 1 })
    .where(eq(giveawayEntries.id, entryId));
}

export async function getGiveawayEntryByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    // Use in-memory storage for testing
    return inMemoryStorage.giveawayEntries.find(e => e.email === email);
  }

  const result = await db.select().from(giveawayEntries).where(eq(giveawayEntries.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
