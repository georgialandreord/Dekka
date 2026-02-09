import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { v2 as cloudinary } from "cloudinary";
import { env } from "~/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const cloudinaryRouter = createTRPCRouter({
  // get user profile presigned url
  getPresignedUrl: protectedProcedure
    .input(z.object({ fileName: z.string(), fileType: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const publicId = `user_profile/${userId}`;

      const params = {
        timestamp: Math.floor(Date.now() / 1000),
        public_id: publicId,
        folder: "user_profiles",
      };

      const signature = cloudinary.utils.api_sign_request(
        params,
        env.CLOUDINARY_API_SECRET,
      );

      return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        signature,
        params: { ...params, api_key: env.CLOUDINARY_API_KEY },
      };
    }),

  // get user banner presigned url
  getBannerPresignedUrl: protectedProcedure
    .input(z.object({ fileName: z.string(), fileType: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const publicId = `user_profile_banner/${userId}`;

      const params = {
        timestamp: Math.floor(Date.now() / 1000),
        public_id: publicId,
        folder: "user_profiles",
      };

      const signature = cloudinary.utils.api_sign_request(
        params,
        env.CLOUDINARY_API_SECRET,
      );

      return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        signature,
        params: { ...params, api_key: env.CLOUDINARY_API_KEY },
      };
    }),

  // get user upload stickers presigned url

  getUserUploadStickerPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        isSample: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const timestamp = Date.now();
      const publicId = `user_upload_stickers/${userId}/${timestamp}`;

      const params = {
        timestamp: Math.floor(timestamp / 1000),
        public_id: publicId,
        folder: "user_upload_stickers",
      };

      const signature = cloudinary.utils.api_sign_request(
        params,
        env.CLOUDINARY_API_SECRET,
      );

      return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        signature,
        params: { ...params, api_key: env.CLOUDINARY_API_KEY },
        publicId,
      };
    }),

  getUploadStickerPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        isSample: z.boolean().optional().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const timestamp = Date.now();
      const publicId = `upload_stickers/${userId}/${timestamp}`;

      const params = {
        timestamp: Math.floor(timestamp / 1000),
        public_id: publicId,
        folder: "upload_stickers",
      };

      const signature = cloudinary.utils.api_sign_request(
        params,
        env.CLOUDINARY_API_SECRET,
      );

      return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        signature,
        params: { ...params, api_key: env.CLOUDINARY_API_KEY },
        publicId,
      };
    }),

  getUploadBackgroundPatternPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx }) => {
      const userId = ctx.session.user.id;
      const timestamp = Date.now();
      const publicId = `upload_patterns/${userId}/${timestamp}`;

      const params = {
        timestamp: Math.floor(timestamp / 1000),
        public_id: publicId,
        folder: "upload_patterns",
      };

      const signature = cloudinary.utils.api_sign_request(
        params,
        env.CLOUDINARY_API_SECRET,
      );

      return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        signature,
        params: { ...params, api_key: env.CLOUDINARY_API_KEY },
        publicId,
      };
    }),
});
