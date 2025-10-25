import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

export async function runCustomMigration() {
  const db = drizzle(process.env.DATABASE_URL!);
  
  try {
    console.log("[Migration] Starting custom authentication migration...");
    
    // Check if username column exists
    const usernameCheck = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'username'
    `);
    
    if (usernameCheck[0].count === 0) {
      console.log("[Migration] Adding username column...");
      await db.execute(sql`ALTER TABLE users ADD username varchar(50)`);
    } else {
      console.log("[Migration] Username column already exists");
    }
    
    // Check if passwordHash column exists
    const passwordCheck = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'passwordHash'
    `);
    
    if (passwordCheck[0].count === 0) {
      console.log("[Migration] Adding passwordHash column...");
      await db.execute(sql`ALTER TABLE users ADD passwordHash varchar(255)`);
    } else {
      console.log("[Migration] PasswordHash column already exists");
    }
    
    // Modify email column length
    console.log("[Migration] Modifying email column length...");
    await db.execute(sql`ALTER TABLE users MODIFY COLUMN email varchar(255) NOT NULL`);
    
    // Add unique constraints if they don't exist
    const usernameUniqueCheck = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND INDEX_NAME = 'users_username_unique'
    `);
    
    if (usernameUniqueCheck[0].count === 0) {
      console.log("[Migration] Adding username unique constraint...");
      await db.execute(sql`ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE(username)`);
    } else {
      console.log("[Migration] Username unique constraint already exists");
    }
    
    const emailUniqueCheck = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM INFORMATION_SCHEMA.STATISTICS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND INDEX_NAME = 'users_email_unique'
    `);
    
    if (emailUniqueCheck[0].count === 0) {
      console.log("[Migration] Adding email unique constraint...");
      await db.execute(sql`ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE(email)`);
    } else {
      console.log("[Migration] Email unique constraint already exists");
    }
    
    console.log("[Migration] Custom authentication migration completed successfully!");
    
  } catch (error) {
    console.error("[Migration] Migration failed:", error);
    throw error;
  }
}
