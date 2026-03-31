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

export const stickerRouter = createTRPCRouter({
  // Get all stickers
  getAllStickers: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stickers = await ctx.db.sticker.findMany({
        orderBy : {
          order : 'asc'
        },
        include: { stickers: true },
      });
      return stickers;
    } catch (error) {
      console.log("ERROR", error);
      throw error;
    }
  }),

  createStickerWithItems: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional().default(""),
        theme: z.string(),
        isFree: z.boolean().default(true),
        price: z.number().default(0),
        artistName: z.string().optional(),
        thumbnail: z.string().optional(),
        stickerItems: z.array(
          z.object({
            name: z.string(),
            url: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const userEmail = ctx.session.user.email || "";

      try {
        // Create the main Sticker record
        const sticker = await ctx.db.sticker.create({
          data: {
            name: input.name,
            description: input.description,
            theme: input.theme,
            isFree: input.isFree,
            price: input.price,
            artistName: input.artistName,
            thumbnail: input.thumbnail,
            // createdById: userId,
            // createdBy: userEmail,
            isSample: false,
            stickers: {
              create: input.stickerItems.map((item) => ({
                name: item.name,
                url: item.url,
              })),
            },
          },
          include: {
            stickers: true,
          },
        });

        return sticker;
      } catch (error) {
        console.error("Error creating sticker:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create sticker",
        });
      }
    }),

  createOrUpdate: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string().optional(),
          name: z.string(),
          description: z.string(),
          theme: z.string(),
          is_free: z.boolean().optional(),
          price: z.number(),
          artist_name: z.string().nullable().default(null),
          stickers: z.array(
            z.object({
              name: z.string(),
              url: z.string(),
            }),
          ),
          thumbnail: z.string().nullable(),
          downloads: z.number(),
          // createdDate: z.string().optional(),
          // updatedDate: z.string().optional(),
          // createdById: z.string().optional(),
          // createdBy: z.string().optional(),
          is_sample: z.boolean(),
        }),
      ),
    )
    .mutation(async ({ input: mockStickers }) => {
      const allStickers = [];

      for (const sticker of mockStickers) {
        try {
          const mainImageUrl = sticker.stickers[0]?.url;
          if (!mainImageUrl) continue;

          // Download and upload main image
          const response = await axios({
            method: "GET",
            url: mainImageUrl,
            responseType: "arraybuffer",
          });
          const tempPath = `sticker_${sticker.id}.png`;
          fs.writeFileSync(tempPath, response.data);
          const upload = await cloudinary.v2.uploader.upload(tempPath, {
            folder: "stickers",
          });
          fs.unlinkSync(tempPath);
          const cloudinaryUrl = upload.secure_url;

          // Upload sub-stickers
          const stickerItems = await Promise.all(
            sticker.stickers.map(async (subSticker) => {
              const res = await axios({
                method: "GET",
                url: subSticker.url,
                responseType: "arraybuffer",
              });
              const tPath = `temp_${subSticker.name}.png`;
              fs.writeFileSync(tPath, res.data);
              const up = await cloudinary.v2.uploader.upload(tPath, {
                folder: "stickers",
              });
              fs.unlinkSync(tPath);
              return {
                name: subSticker.name,
                url: up.secure_url,
              };
            }),
          );

          // Create an object with full data including URLs
          const fullStickerData = {
            ...sticker,
            imageUrl: cloudinaryUrl,
            stickers: stickerItems,
            // createdDate: new Date(sticker.createdDate),
            // updatedDate: new Date(sticker.updatedDate),
          };

          allStickers.push(fullStickerData);
        } catch (err) {
          console.error(`Error processing sticker ${sticker.name}:`, err);
        }
      }

      // Save to a static file
      fs.writeFileSync(
        "stickers_one.json",
        JSON.stringify(allStickers, null, 2),
      );
      return { message: "Generated stickers.json file" };
    }),
    deleteStickers: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx ,input}) => {
      try {
        const deleted = await ctx.db.stickerItem.deleteMany({
          where:{
            id:{
              in: input.ids
            }
          }
        })
        const failed = deleted.count - input.ids.length;
        if (failed > 0) {
          console.log("Failed to delete stickers", failed);
        }
        console.log("Acknowledged deletion of stickers", deleted.count);
        return deleted
      } catch (error) {
        console.error("Error deleting stickers:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete stickers",
        });
      }
    }),

    updateCategoryOrder: protectedProcedure
    .input(
      z.object({
        categoryName: z.string(),
        newOrder: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryName, newOrder } = input;

      try {

        const response = await ctx.db.sticker.updateMany({
          where:{
            name:categoryName
          },
          data:{
            order:newOrder
          }
        })

 

        return { success: true };
      } catch (error) {
        console.error("Error updating order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order",
        });
      }
    }),
});
