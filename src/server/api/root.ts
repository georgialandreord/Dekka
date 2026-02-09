import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { folderRouter } from "./routers/folder";
import { folderDecorationRouter } from "./routers/folder-decoration";
import { stickerRouter } from "./routers/stickers";
import { cloudinaryRouter } from "./routers/cloudnary";
import { userUploadStickerRouter } from "./routers/user-upload-stickers";
import { stickerGeneratorRouter } from "./routers/generate-stickers";
import { userRouter } from "./routers/user";
import { polarRouter } from "./routers/polar";
import { userStickerPacksRouter } from "./routers/user-sticker-packs";
import { backgroundPatternRouter } from "./routers/background-pattern";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  folder: folderRouter,
  folderDecoration: folderDecorationRouter,
  sticker: stickerRouter,
  cloudnary: cloudinaryRouter,
  user: userUploadStickerRouter,
  settings: userRouter,
  generateStickers: stickerGeneratorRouter,
  polar: polarRouter,
  userStickerPacks: userStickerPacksRouter,
  backgroundPattern: backgroundPatternRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
