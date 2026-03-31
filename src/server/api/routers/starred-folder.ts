import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const starredFolderRouter = createTRPCRouter({
  // Get all starred folders for the current user with their decorations
  getAll: protectedProcedure
  .input(z.object({ platform: z.enum(["dropbox", "google_drive"]) }))
  .query(async ({ ctx, input }) => {
    return await ctx.db.starredFolder.findMany({
      where: {
        userId: ctx.session.user.id,
        platform: input.platform,
      },
      include: {
        decoration: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // Add a folder to starred
  add: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
        folderName: z.string(),
        folderPath: z.string(),
        folderDecorationId: z.string().optional(),
        platform: z.enum(["dropbox", "google_drive"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.starredFolder.create({
        data: {
          userId: ctx.session.user.id,
          folderId: input.folderId,
          folderName: input.folderName,
          folderPath: input.folderPath,
          folderDecorationId: input.folderDecorationId,
          platform: input.platform,
        },
        include: {
          decoration: true,
        },
      });
    }),

  // Remove a folder from starred
  remove: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.starredFolder.deleteMany({
        where: {
          userId: ctx.session.user.id,
          folderId: input.folderId,
        },
      });
    }),

  // Check if a folder is starred
  isStarred: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const starred = await ctx.db.starredFolder.findUnique({
        where: {
          userId_folderId: {
            userId: ctx.session.user.id,
            folderId: input.folderId,
          },
        },
      });
      return !!starred;
    }),
});
