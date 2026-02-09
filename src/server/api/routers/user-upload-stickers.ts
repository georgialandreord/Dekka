import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { v2 as cloudinary } from "cloudinary";

export const userUploadStickerRouter = createTRPCRouter({
  // save user upload stickers
  saveUserUploadSticker: protectedProcedure
    .input(
      z.object({
        fileUrl: z.string(),
        fileName: z.string(),
        thumbnailUrl: z.string().optional(),
        publicId: z.string().optional(),
        isSample: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const userEmail = ctx.session.user.email || "";

      // Create a new record in the UserUploadStickers table
      const userUploadSticker = await ctx.db.userUploadStickers.create({
        data: {
          fileUrl: input.fileUrl,
          fileName: input.fileName,
          thumbnailUrl: input.thumbnailUrl || input.fileUrl, // Use fileUrl as fallback
          publicId: input.publicId,
          createdById: userId,
          createdBy: userEmail,
          isSample: input.isSample,
        },
      });

      return userUploadSticker;
    }),

  // get all user upload stickers
  getUserUploadStickers: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const userUploadStickers = await ctx.db.userUploadStickers.findMany({
      where: {
        createdById: userId,
      },
      orderBy: {
        createdDate: "desc",
      },
    });

    return userUploadStickers;
  }),

  // Delete a user's uploaded sticker
  deleteUserUploadSticker: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // 1. Find the sticker in the database to get its publicId
      const sticker = await ctx.db.userUploadStickers.findUnique({
        where: { id: input.id },
      });

      // 2. Security check: Ensure the sticker exists and belongs to the user
      if (!sticker || sticker.createdById !== userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Sticker not found or you don't have permission to delete it.",
        });
      }

      // 3. If the sticker has a publicId, delete it from Cloudinary
      if (sticker.publicId) {
        try {
          const cloudinaryResponse = await cloudinary.uploader.destroy(
            sticker.publicId,
          );
          // Optional: Check the response from Cloudinary
          if (cloudinaryResponse.result !== "ok") {
            console.error("Cloudinary deletion failed:", cloudinaryResponse);
            // Decide if you want to proceed with DB deletion even if Cloudinary fails.
            // Here, we'll throw an error to stop the process.
            throw new Error("Failed to delete image from Cloudinary.");
          }
        } catch (error) {
          console.error("Error calling Cloudinary API:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not delete image from cloud storage.",
          });
        }
      }

      // 4. After successfully deleting from Cloudinary, delete the record from the database
      await ctx.db.userUploadStickers.delete({
        where: { id: input.id },
      });

      return { success: true, message: "Sticker delete successfully" };
    }),
});
