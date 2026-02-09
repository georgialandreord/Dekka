import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { v2 as cloudinary } from "cloudinary";
import { fal } from "@fal-ai/client";
import { env } from "~/env";
import { polarClient } from "~/server/better-auth/config";

// Configure fal.ai client
fal.config({
  credentials: env.FAL_API_KEY || "",
});

export const stickerGeneratorRouter = createTRPCRouter({
  generateAndSaveSticker: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(1, "Prompt is required"),
        removeBackground: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const userEmail = ctx.session.user.email || "";
      const removeBackground = input.removeBackground || false;


      const customerMeters = await polarClient.customerMeters.list({
        externalCustomerId: userId,
      });
      const credits = customerMeters.result.items[0]?.balance;
      if (!customerMeters || !credits || credits <= 0) {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: `Insufficient credits. Balance: ${credits ? Math.abs(credits) : 0}. Please purchase more via /checkout/Ai-Image-Generation.`,
        });
      }


      try {
        // Generate sticker using fal.ai
        const result = await fal.subscribe("fal-ai/flux/schnell", {
          input: {
            prompt: input.prompt,
            output_format:"png"
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              console.log("Generation in progress:", update.logs);
            }
          },
        });

        // // If user wants background removed, call the background removal model
        const stickerUrl = result.data.images[0]?.url;
        let removeBgUrl;

        if (!stickerUrl) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate sticker - no image URL returned",
          });
        }

        if (removeBackground) {
          const bgRemoved = await fal.subscribe("fal-ai/birefnet/v2", {
            input: {
              image_url: stickerUrl,
            },
          });
          removeBgUrl = bgRemoved?.data?.image?.url;

          if (!removeBgUrl) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to generate sticker - no image URL returned",
            });
          }
        }

        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
          removeBgUrl || stickerUrl,
          {
            folder: `ai_stickers/${userId}`,
            public_id: `sticker_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            resource_type: "image",
            format: "png",
          },
        );

        // Create a new record in the UserUploadStickers table
        const userUploadSticker = await ctx.db.userUploadStickers.create({
          data: {
            fileUrl: cloudinaryResponse.secure_url,
            // fileName: `sticker_${Date.now()}.png`,
            fileName:
              input.prompt.length > 15
                ? `${input.prompt.slice(0, 15)}.png`
                : `${input.prompt}.png`,
            thumbnailUrl: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
            createdById: userId,
            createdBy: userEmail,
            isSample: false,
          },
        });

        const response = await polarClient.events.ingest({
          events: [
            {
              externalCustomerId: userId,
              name: "ai image generation credit",
              metadata: { units: 1 },
            },
          ],
        });
        console.log(response, "response");
        return userUploadSticker;
      } catch (error) {
        console.error("Error generating and saving sticker:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate and save sticker",
        });
      }
    }),
});
