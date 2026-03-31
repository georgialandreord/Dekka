/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import { Dropbox } from "dropbox";
import superjson from "superjson";
import {z, ZodError } from "zod";
import { env } from "~/env";

import { auth } from "~/server/better-auth";
import { db } from "~/server/db";
import { GoogleDriveClient } from "~/server/lib/google-drive";
import {
  createFileSystemClient,
  PLATFORMS,
  type FileSystemClient,
  type PLATFORM,
} from "~/server/lib/file-system-client";
import { polarClient } from "../better-auth/config";
/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });
  return {
    db,
    session,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next, getRawInput }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    const user = ctx.session.user;

    const platformSettings = await ctx.db.userPlatformSettings.findUnique({
      where: { userId: user.id },
    });

    let activePlatform: PLATFORM = "dropbox";

    if (platformSettings) {
      activePlatform = platformSettings.activePlatform as PLATFORM;
    } else {
      const firstAccount = await ctx.db.account.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (firstAccount?.providerId?.includes("google")) {
        activePlatform = "google_drive";
      } else if (firstAccount?.providerId?.includes("dropbox")) {
        activePlatform = "dropbox";
      } else {
        activePlatform = "dropbox";
      }
    }

    const googleAccount = await ctx.db.account.findFirst({
      where: {
        userId: user.id,
        providerId: {
          contains: "google",
        },
      },
    });

    const dropboxAccount = await ctx.db.account.findFirst({
      where: {
        userId: user.id,
        providerId: {
          contains: "dropbox",
        },
      },
    });

    const dbx = new Dropbox({
      accessToken: dropboxAccount?.accessToken || "",
      fetch: fetch,
      refreshToken: dropboxAccount?.refreshToken || "",
      clientId: env.DROPBOX_CLIENT_ID,
      clientSecret: env.DROPBOX_CLIENT_SECRET,
    });

    const gdrive = new GoogleDriveClient(
      googleAccount?.accessToken || "",
      googleAccount?.refreshToken || "",
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
    );

    const activeAccount =
      activePlatform === "google_drive" ? googleAccount : dropboxAccount;

    if (!activeAccount?.accessToken || !activeAccount?.refreshToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: `Access or Refresh token not found for platform: ${activePlatform}`,
      });
    }

    const fsClient = createFileSystemClient(activePlatform, dbx, gdrive);

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
        dbx,
        gdrive,
        fsClient,
        activePlatform,
      },
    });
  });

  export const subscribedProcedure = protectedProcedure.use(
    async ({ ctx, next }) => {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.session.user.id,
      });
  
      if (
        !customer.activeSubscriptions ||
        customer.activeSubscriptions.length === 0
      ) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not subscribed" });
      }
  
      return next({ ctx: { ...ctx, customer } });
    }
  );