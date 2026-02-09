/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import type { NextConfig } from "next";

const config: NextConfig = {
  reactCompiler: true,
  rewrites: async () => {
    return [
      {
        // 👇 matches all routes except /api
        source: "/((?!api/).*)",
        destination: "/dashboard",
      },
    ];
  },
};

export default config;
