import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';
import { users } from '../../drizzle/schema';
import { getDb } from '../db';
import { ENV } from './env';
import { COOKIE_NAME } from '@shared/const';
import { registerSchema, loginSchema, checkPasswordStrength } from './validation';

const SALT_ROUNDS = 12;
const JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret);

export interface AuthUser {
  id: number;
  username?: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  openId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against its hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Create a JWT token for a user
   */
  async createToken(user: AuthUser): Promise<string> {
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    return token;
  }

  /**
   * Verify a JWT token and return the payload
   */
  async verifyToken(token: string): Promise<{ userId: number; email: string; role: string } | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return {
        userId: payload.userId as number,
        email: payload.email as string,
        role: payload.role as string,
      };
    } catch (error) {
      console.error('[Auth] Token verification failed:', error);
      return null;
    }
  }

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    // Validate input
    const validatedData = registerSchema.parse(credentials);

    // Check password strength
    const strengthCheck = checkPasswordStrength(validatedData.password);
    if (strengthCheck.score < 3) {
      throw new Error(`Password is too weak. ${strengthCheck.feedback.join(', ')}`);
    }

    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Check if username is taken
    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, validatedData.username))
      .limit(1);

    if (existingUsername.length > 0) {
      throw new Error('Username is already taken');
    }

    // Hash the password
    const passwordHash = await this.hashPassword(validatedData.password);

    // Create user
    const newUser = {
      username: validatedData.username,
      email: validatedData.email,
      passwordHash,
      name: validatedData.name || null,
      role: 'user' as const,
      lastSignedIn: new Date(),
    };

    const result = await db.insert(users).values(newUser);
    const userId = result[0]?.insertId;

    if (!userId) {
      throw new Error('Failed to create user');
    }

    return {
      id: userId,
      username: validatedData.username,
      email: validatedData.email,
      name: validatedData.name,
      role: 'user',
    };
  }

  /**
   * Authenticate a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    // Validate input
    const validatedData = loginSchema.parse(credentials);

    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (userResult.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = userResult[0];

    // Check if user has a password (custom auth user)
    if (!user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(validatedData.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last signed in
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    return {
      id: user.id,
      username: user.username || undefined,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
      openId: user.openId || undefined,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<AuthUser | null> {
    const db = await getDb();
    if (!db) {
      return null;
    }

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userResult.length === 0) {
      return null;
    }

    const user = userResult[0];
    return {
      id: user.id,
      username: user.username || undefined,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
      openId: user.openId || undefined,
    };
  }

  /**
   * Authenticate request from JWT token
   */
  async authenticateRequest(token: string): Promise<AuthUser> {
    const payload = await this.verifyToken(token);
    if (!payload) {
      throw new Error('Invalid token');
    }

    const user = await this.getUserById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();
