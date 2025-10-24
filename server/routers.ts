import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createGiveawayEntry, getAllGiveawayEntries, markSurveyClicked } from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  giveaway: router({
    createEntry: protectedProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        nflTeam: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const result = await createGiveawayEntry({
          ...input,
          clickedSurvey: 0,
        });
        // Return the entry ID from the insert result
        const entryId = result[0]?.insertId;
        return { success: true, entryId };
      }),

    markSurveyClicked: publicProcedure
      .input(z.object({
        entryId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await markSurveyClicked(input.entryId);
        return { success: true };
      }),

    getAllEntries: publicProcedure
      .query(async () => {
        // Temporarily public for development - add authentication back for production
        const entries = await getAllGiveawayEntries();
        return entries;
      }),
  }),
});

export type AppRouter = typeof appRouter;
