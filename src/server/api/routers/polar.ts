import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { Polar } from "@polar-sh/sdk";
import { polarClient } from "~/server/better-auth/config";

export const polarRouter = createTRPCRouter({
  // Get Polar Products
  getProducts: protectedProcedure.query(async () => {
    try {
      const products = await polarClient.products.list({
        isArchived: false,
        isRecurring: false
      });

      return products.result.items;
    } catch (error) {
      console.error("Polar product fetch failed", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch products",
      });
    }
  }),
  getPlans: protectedProcedure.query(async () => {
    try {
      const products = await polarClient.products.list({
        isArchived: false,
        isRecurring:true
      });

      return products.result.items;
    } catch (error) {
      console.error("Polar product fetch failed", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch products",
      });
    }
  })
});
