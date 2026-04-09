import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./config";
import { polarClient } from "@polar-sh/better-auth/client";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>(), polarClient()],
});

export type Session = typeof authClient.$Infer.Session;
