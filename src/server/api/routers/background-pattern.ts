import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import cloudinary from "cloudinary";
import axios from "axios";
import fs from "fs";
import { env } from "~/env";

cloudinary.v2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const backgroundPatternRouter = createTRPCRouter({
  // Get all patterns
  getAllPatterns: protectedProcedure.query(async ({ ctx }) => {
    try {
      const patterns = await ctx.db.backgroundPattern.findMany();
      return patterns;
    } catch (error) {
      console.log("ERROR", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch patterns",
      });
    }
  }),

  createBackgroundPattern: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        fileUrl: z.string(),
        publicId: z.string().optional(),
        size: z.number().optional().default(100),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Create the main Sticker record
        const pattern = await ctx.db.backgroundPattern.create({
          data: {
            filename: input.filename,
            fileUrl: input.fileUrl,
            publicId: input.publicId,
            size: input.size,
          },
        });

        return pattern;
      } catch (error) {
        console.error("Error creating pattern:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create pattern",
        });
      }
    }),
});
