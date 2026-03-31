import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

// Schema for decoration items
const decorationSchema = z.object({
  id: z.string().optional(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().default(0),
  effects: z.array(z.string()).default([]),
  sparkleColor:z.string().optional(),
  glitterColor: z.string().optional(),
  zIndex: z.number(),
  type: z.string(),
  content: z.string(),
  frame_content: z.string().optional().default(""),
  frame_color: z.string().optional().default(""),
  frame_content_offset_x: z.number().optional().default(0),
  frame_content_offset_y: z.number().optional().default(0),
  frame_content_scale: z.number().optional().default(0),
});

// Schema for folder decoration
const folderDecorationSchema = z.object({
  id: z.string().optional(),
  folderId: z.string(),
  name: z.string(),
  color: z.string(),
  backgroundPattern: z.string(),
  backgroundPatternSize: z.number().optional(),
  thumbnail: z.string().optional(),
  isSample: z.boolean().default(false),
  decorations: z.array(decorationSchema),
});

export const folderDecorationRouter = createTRPCRouter({
  // Get all folder decorations for the current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const folderDecorations = await ctx.db.folderDecoration.findMany({
        where: {
          createdBy: ctx.session.user.id,
        },
        include: {
          decorations: true,
          createdByUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          updatedDate: "desc",
        },
      });

      return folderDecorations;
    } catch (error) {
      console.error("Error fetching folder decorations:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch folder decorations",
      });
    }
  }),

  // Get a specific folder decoration by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const folderDecoration = await ctx.db.folderDecoration.findUnique({
          where: {
            id: input.id,
          },
          include: {
            decorations: true,
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        if (!folderDecoration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Folder decoration not found",
          });
        }

        // Check if the user owns this folder decoration or it's a sample
        if (
          folderDecoration.createdBy !== ctx.session.user.id &&
          !folderDecoration.isSample
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to access this folder decoration",
          });
        }

        return folderDecoration;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error fetching folder decoration:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch folder decoration",
        });
      }
    }),

  // Get a folder decoration by Dropbox folder ID
  getByDropboxFolderId: protectedProcedure
    .input(z.object({ dropboxFolderId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const folderDecoration = await ctx.db.folderDecoration.findUnique({
          where: {
            folderId: input.dropboxFolderId,
          },
          include: {
            decorations: true,
            createdByUser: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        if (!folderDecoration) {
          return null;
        }

        // Check if the user owns this folder decoration or it's a sample
        if (
          folderDecoration.createdBy !== ctx.session.user.id &&
          !folderDecoration.isSample
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to access this folder decoration",
          });
        }

        return folderDecoration;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error fetching folder decoration by Dropbox ID:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch folder decoration",
        });
      }
    }),

  // Create a new folder decoration
  create: protectedProcedure
    .input(folderDecorationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { decorations, ...folderData } = input;

        // Check if a folder decoration with this Dropbox folder ID already exists
        const existingDecoration = await ctx.db.folderDecoration.findUnique({
          where: {
            folderId: folderData.folderId,
          },
        });

        if (existingDecoration) {
          throw new TRPCError({
            code: "CONFLICT",
            message:
              "A folder decoration with this Dropbox folder ID already exists",
          });
        }

        // Create the folder decoration
        const newFolderDecoration = await ctx.db.folderDecoration.create({
          data: {
            ...folderData,
            createdBy: ctx.session.user.id,
            decorations: {
              create: decorations,
            },
          },
          include: {
            decorations: true,
          },
        });

        return newFolderDecoration;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error creating folder decoration:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create folder decoration",
        });
      }
    }),

  // Update an existing folder decoration
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: folderDecorationSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, data } = input;
        const { decorations, ...folderData } = data;

        // Check if the folder decoration exists and the user has permission
        const existingDecoration = await ctx.db.folderDecoration.findUnique({
          where: { id },
        });

        if (!existingDecoration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Folder decoration not found",
          });
        }

        if (existingDecoration.createdBy !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to update this folder decoration",
          });
        }

        // If decorations are provided, we need to handle them specially
        if (decorations) {
          // First, delete all existing decorations
          await ctx.db.decoration.deleteMany({
            where: {
              folderId: id,
            },
          });

          // Then create the new decorations
          const updatedFolderDecoration = await ctx.db.folderDecoration.update({
            where: { id },
            data: {
              ...folderData,
              decorations: {
                create: decorations,
              },
            },
            include: {
              decorations: true,
            },
          });

          return updatedFolderDecoration;
        } else {
          // Just update the folder decoration without changing decorations
          const updatedFolderDecoration = await ctx.db.folderDecoration.update({
            where: { id },
            data: folderData,
            include: {
              decorations: true,
            },
          });

          return updatedFolderDecoration;
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error updating folder decoration:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update folder decoration",
        });
      }
    }),

  // Delete a folder decoration
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if the folder decoration exists and the user has permission
        const existingDecoration = await ctx.db.folderDecoration.findUnique({
          where: { id: input.id },
        });

        if (!existingDecoration) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Folder decoration not found",
          });
        }

        if (existingDecoration.createdBy !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "You don't have permission to delete this folder decoration",
          });
        }

        // Delete the folder decoration (this will also delete related decorations due to cascade)
        await ctx.db.folderDecoration.delete({
          where: { id: input.id },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error deleting folder decoration:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete folder decoration",
        });
      }
    }),

  // Save or update a folder decoration (upsert operation)
  save: protectedProcedure
    .input(folderDecorationSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { decorations, ...folderData } = input;

        // Check if a folder decoration with this Dropbox folder ID already exists
        const existingDecoration = await ctx.db.folderDecoration.findUnique({
          where: {
            folderId: folderData.folderId,
          },
          include: {
            decorations: true,
          },
        });

        if (existingDecoration) {
          // Check if the user has permission to update
          if (
            existingDecoration.createdBy !== ctx.session.user.id &&
            !existingDecoration.isSample
          ) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message:
                "You don't have permission to update this folder decoration",
            });
          }

          // Update the existing decoration
          // First, delete all existing decorations
          await ctx.db.decoration.deleteMany({
            where: {
              folderId: existingDecoration.id,
            },
          });

          // Then update the folder decoration and create new decorations
          // Remove client-generated IDs from decorations to avoid MongoDB ObjectID conflicts
          const cleanDecorations = decorations.map(({ id, ...rest }) => rest);

          const updatedFolderDecoration = await ctx.db.folderDecoration.update({
            where: {
              id: existingDecoration.id,
            },
            data: {
              ...folderData,
              decorations: {
                create: cleanDecorations,
              },
            },
            include: {
              decorations: true,
            },
          });

          return updatedFolderDecoration;
        } else {
          const cleanDecorations = decorations.map(({ id, ...rest }) => rest);

          const newFolderDecoration = await ctx.db.folderDecoration.create({
            data: {
              ...folderData,
              createdBy: ctx.session.user.id,
              decorations: {
                create: cleanDecorations,
              },
            },
            include: {
              decorations: true,
            },
          });

          return newFolderDecoration;
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Error saving folder decoration:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save folder decoration",
        });
      }
    }),
});
