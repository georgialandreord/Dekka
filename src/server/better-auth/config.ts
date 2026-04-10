import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";

import { env } from "~/env";
import { db } from "~/server/db";

import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  // server: "sandbox",
  server:"production"
});

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      banner: {
        type: "string",
        required: false,
      },
    },
  },
  socialProviders: {
    dropbox: {
      clientId: env.DROPBOX_CLIENT_ID as string,
      clientSecret: env.DROPBOX_CLIENT_SECRET as string,
      accessType: "offline",
      scope: [
        "files.content.write",
        "files.content.read",
        "files.metadata.read",
        "files.metadata.write",
        "account_info.read",
        "sharing.write",
      ],
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      scope: ["profile", "email", "https://www.googleapis.com/auth/drive"],
      prompt: "select_account consent",
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;

      if (!newSession) {
        return;
      }

      if (
        ctx.path.includes("/callback") ||
        ctx.path.includes("/sign-up") ||
        ctx.path.includes("/sign-in")
      ) {
        const userId = newSession.user.id;

        const existingSettings = await db.userPlatformSettings.findUnique({
          where: { userId },
        });

        if (existingSettings) {
          return;
        }

        const account = await db.account.findFirst({
          where: { userId },
        });

        let activePlatform = "dropbox";

        if (account?.providerId?.includes("google")) {
          activePlatform = "google_drive";
        } else if (account?.providerId?.includes("dropbox")) {
          activePlatform = "dropbox";
        }

        await db.userPlatformSettings.create({
          data: {
            userId,
            activePlatform,
          },
        });
      }
    }),
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
         
          ],
          successUrl: env.POLAR_SUCCESS_URL as string,
          authenticatedUsersOnly: true,
        }),
        usage(),
        portal(),
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;