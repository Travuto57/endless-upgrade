import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';
import { generateToken, verifyToken, AuthUser } from './auth';

// Admin credentials - in production, these should be stored securely
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = '$2b$10$Yhsq9hbyYDCo1ovoLDv.o.j1zN3DbzsA6LQgF2kOnj555OH1/XViO'; // 9s71Q8VO+1-1

export const authRouter = router({
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { username, password } = input;

      // Check if username matches admin
      if (username !== ADMIN_USERNAME) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid credentials'
        };
      }

      // Generate JWT token
      const user: AuthUser = {
        id: 'admin-1',
        username: ADMIN_USERNAME,
        role: 'admin'
      };

      const token = generateToken(user);

      return {
        success: true,
        token,
        user
      };
    }),

  verifyToken: publicProcedure
    .query(async ({ ctx }) => {
      const authHeader = ctx.req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return null;
      }

      const user = verifyToken(token);
      return user;
    }),

  logout: publicProcedure
    .mutation(() => {
      // Since we're using JWT, logout is handled client-side by removing the token
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }),
});
