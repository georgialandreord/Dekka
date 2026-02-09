import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Define Zod schemas for input validation
const PackInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  purchaseLink: z.string().optional(),
  price: z.number().default(0),
  tags: z.array(z.string()).default([]),
});

export const userStickerPacksRouter = createTRPCRouter({
  // 1. GET Packs List (with Search & Tag filtering)
  getPacks: publicProcedure
    .input(
      z.object({
        searchQuery: z.string().optional(),
        tag: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { searchQuery, tag } = input;

      return ctx.db.userStickerPacks.findMany({
        where: {
          // Search Logic: Matches title OR description (case insensitive)
          ...(searchQuery && {
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { description: { contains: searchQuery, mode: "insensitive" } },
            ],
          }),
          // Tag Logic: Matches specific tag if provided
          ...(tag &&
            tag !== "all" && {
              tags: {
                has: tag,
              },
            }),
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  // 2. CREATE Pack
  // Protected: Only logged-in users
  createPack: protectedProcedure
    .input(PackInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;

        const pack = await ctx.db.userStickerPacks.create({
          data: {
            ...input,
            createdById: userId,
          },
        });

        return {
          success: true,
          pack,
          message: `Sticker Pack Created Successfully`,
        };
      } catch (error) {
        console.log("ERROR creating sticker pack", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a sticker pack",
        });
      }
    }),

  // 3. EDIT Pack
  // Protected: Only logged-in users
  editPack: protectedProcedure
    .input(
      z.object({
        id: z.string(), // ID of the pack to edit
        data: PackInputSchema, // The new data
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const userId = ctx.session.user.id;

      // SECURITY CHECK: Verify ownership before updating
      const existingPack = await ctx.db.userStickerPacks.findUnique({
        where: { id },
      });

      if (!existingPack) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pack not found",
        });
      }

      if (existingPack.createdById !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to edit this pack",
        });
      }

      // Proceed with update
      const updatedPack = await ctx.db.userStickerPacks.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        updatedPack,
        message: "Pack Update Successfully",
      };
    }),

  // 4. DELETE Pack
  // Protected: Only logged-in users
  deletePack: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.session.user.id;

      // SECURITY CHECK: Verify ownership before deleting
      const existingPack = await ctx.db.userStickerPacks.findUnique({
        where: { id },
      });

      if (!existingPack) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pack not found",
        });
      }

      if (existingPack.createdById !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to delete this pack",
        });
      }

      // Proceed with delete
      await ctx.db.userStickerPacks.delete({
        where: { id },
      });

      return { success: true, message: "Pack deleted successfully" };
    }),
});
