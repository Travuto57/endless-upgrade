import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifyToken, AuthUser } from "./auth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AuthUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: AuthUser | null = null;

  try {
    // Check for JWT token in Authorization header
    const authHeader = opts.req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      user = verifyToken(token);
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
