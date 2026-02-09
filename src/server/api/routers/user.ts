import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import type { PLATFORM } from "~/server/lib/file-system-client";

export const userRouter = createTRPCRouter({
  getActivePlatform: protectedProcedure.query(async ({ ctx }) => {
    const platformSettings = await ctx.db.userPlatformSettings.findUnique({
      where: { userId: ctx.session.user.id },
    });

    return (platformSettings?.activePlatform || "dropbox") as PLATFORM;
  }),

  getAvailablePlatforms: protectedProcedure.query(async ({ ctx }) => {
    const userAccounts = await ctx.db.account.findMany({
      where: { userId: ctx.session.user.id },
    });
    const availablePlatforms = userAccounts.map((account) => {
      if (account.providerId.includes("google")) {
        return "google_drive";
      } else if (account.providerId.includes("dropbox")) {
        return "dropbox";
      }
    }).filter(p=>!!p)
    return availablePlatforms;
  }),

  setActivePlatform: protectedProcedure
    .input(
      z.object({
        platform: z.enum(["dropbox", "google_drive", "onedrive", "box"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingSettings = await ctx.db.userPlatformSettings.findUnique({
        where: { userId: ctx.session.user.id },
      });

      if (existingSettings) {
        await ctx.db.userPlatformSettings.update({
          where: { userId: ctx.session.user.id },
          data: { activePlatform: input.platform },
        });
      } else {
        await ctx.db.userPlatformSettings.create({
          data: {
            userId: ctx.session.user.id,
            activePlatform: input.platform,
          },
        });
      }

      return {
        success: true,
        platform: input.platform,
      };
    }),
});
