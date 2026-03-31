import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  GoogleDriveWrapper,
} from "~/server/lib/file-system-client";
import type {
  UploadFileResponse,
  RenameFolderResponse,
  RenameFileResponse,
} from "~/server/lib/google-drive";

export const folderRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx, input }) => {
    try {
      const response = await ctx.fsClient.listFolder({
        path: "",
      });
      return response;
    } catch (error) {
      console.log("ERROR", error);
    }
  }),

  getById: protectedProcedure
    .input(z.object({ path: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      try {
        let path = input.path || "";
        if (path && !path.startsWith("/")) {
          path = "/" + path;
        }
        const response = await ctx.fsClient.listFolder({
          path,
        });
        return response;
      } catch (error) {
        console.log("ERROR", error);
        throw error;
      }
    }),

  searchFolders: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const response = await ctx.fsClient.searchFolders(input.query);
        return response;
      } catch (error) {
        console.log("Folder search error", error);
        throw new Error(
          `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  createFolder: protectedProcedure
    .input(
      z.object({
        folderName: z.string().min(1, "Folder name is required"),
        parentPath: z.string().optional(),
        color: z.string().default("#FFB6C1"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { folderName, parentPath = "", color } = input;

        const response = await ctx.fsClient.createFolder(
          folderName,
          parentPath,
        );

        await ctx.db.folderDecoration.create({
          data: {
            folderId: response.id,
            name: folderName,
            color: color,
            backgroundPattern: "",
            createdBy: ctx.session.user.id,
            isSample: false,
            decorations: {
              create: [],
            },
          },
        });

        return {
          success: true,
          folder: response,
          message: `Folder created successfully`,
        };
      } catch (error) {
        console.log("ERROR creating folder", error);
        throw new Error(
          `Failed to create folder: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  deleteFolder: protectedProcedure
    .input(
      z.object({
        folderPath: z.string().min(1, "Folder path is required"),
        folderId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { folderPath, folderId } = input;

        const response = await ctx.fsClient.deleteFolder(folderPath);

        if (folderId) {
          try {
            let existingDecoration = await ctx.db.folderDecoration.findFirst({
              where: {
                OR: [{ folderId: folderId }, { folderId: folderId }],
              },
            });

            if (existingDecoration) {
              if (existingDecoration.createdBy === ctx.session.user.id) {
                await ctx.db.folderDecoration.delete({
                  where: {
                    id: existingDecoration.id,
                  },
                });
                console.log(`Deleted decoration for folder: ${folderId}`);
              }
            }
          } catch (decorationError) {
            console.log(
              "WARNING: Failed to delete folder decoration:",
              decorationError,
            );
          }
        }

        return {
          success: true,
          deletedItem: response,
          message: `Folder and associated decoration deleted successfully`,
        };
      } catch (error) {
        console.log("ERROR deleting folder", error);
        throw new Error(
          `Failed to delete folder: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  uploadFile: protectedProcedure
    .input(
      z.object({
        fileData: z.string(), // Base64 encoded file data
        fileName: z.string().min(1, "File name is required"),
        parentPath: z.string().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const {
          fileData,
          fileName,
          parentPath = "",
          mimeType = "application/octet-stream",
        } = input;

        // Convert base64 to ArrayBuffer
        const buffer = Buffer.from(fileData, "base64");
        const arrayBuffer = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength,
        );

        const response: UploadFileResponse = await ctx.fsClient.uploadFile(
          arrayBuffer,
          fileName,
          parentPath,
          mimeType,
        );

        return {
          success: true,
          file: response,
          message: `File uploaded successfully`,
        };
      } catch (error) {
        console.log("ERROR uploading file", error);
        throw new Error(
          `Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  deleteFile: protectedProcedure
    .input(
      z.object({
        filePath: z.string().min(1, "File path is required"),
        fileId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { filePath, fileId } = input;

        const response = await ctx.fsClient.deleteFile(filePath);

        // Additional cleanup if needed for file-specific data
        if (fileId) {
          try {
            // You can add file-specific cleanup here if needed
            // For example, if you have file decorations or metadata
            console.log(`File deleted: ${fileId}`);
          } catch (cleanupError) {
            console.log(
              "WARNING: Failed to cleanup file metadata:",
              cleanupError,
            );
          }
        }

        return {
          success: true,
          deletedFile: response,
          message: `File deleted successfully`,
        };
      } catch (error) {
        console.log("ERROR deleting file", error);
        throw new Error(
          `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  renameFolder: protectedProcedure
    .input(
      z.object({
        folderPath: z.string().min(1, "Folder path is required"),
        newName: z.string().min(1, "New name is required"),
        folderId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { folderPath, newName, folderId } = input;

        const response: RenameFolderResponse = await ctx.fsClient.renameFolder(
          folderPath,
          newName,
        );

        // Update folder decoration if it exists
        if (folderId) {
          try {
            const existingDecoration = await ctx.db.folderDecoration.findFirst({
              where: {
                folderId: folderId,
              },
            });

            if (
              existingDecoration &&
              existingDecoration.createdBy === ctx.session.user.id
            ) {
              await ctx.db.folderDecoration.update({
                where: {
                  id: existingDecoration.id,
                },
                data: {
                  name: newName,
                },
              });
              console.log(`Updated decoration name for folder: ${folderId}`);
            }
          } catch (decorationError) {
            console.log(
              "WARNING: Failed to update folder decoration:",
              decorationError,
            );
          }
        }
        // update the starred folder if exists
        if(folderId){
          try {
            const existingStarredFolder = await ctx.db.starredFolder.findFirst({
              where: {
                folderId: folderId,
              },
            });
            if (existingStarredFolder) {
              await ctx.db.starredFolder.update({
                where: {
                  userId_folderId:{
                    userId: ctx.session.user.id,
                    folderId: folderId,
                  }
                },
                data: {
                  folderName: newName,
                  folderPath: response.path_display
                },
              });
              console.log(`Updated starred folder name for folder: ${folderId}`);
            }
          } catch (error) {
            console.log("ERROR updating starred folder:", error);
          }
        }

        return {
          success: true,
          renamedFolder: response,
          message: `Folder renamed successfully to "${newName}"`,
        };
      } catch (error) {
        console.log("ERROR renaming folder", error);
        throw new Error(
          `Failed to rename folder: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  renameFile: protectedProcedure
    .input(
      z.object({
        filePath: z.string().min(1, "File path is required"),
        newName: z.string().min(1, "New name is required"),
        fileId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { filePath, newName, fileId } = input;

        const response: RenameFileResponse = await ctx.fsClient.renameFile(
          filePath,
          newName,
        );

        // Additional cleanup if needed for file-specific data
        if (fileId) {
          try {
            // You can add file-specific metadata updates here if needed
            console.log(`File renamed: ${fileId}`);
          } catch (cleanupError) {
            console.log(
              "WARNING: Failed to update file metadata:",
              cleanupError,
            );
          }
        }

        return {
          success: true,
          renamedFile: response,
          message: `File renamed successfully to "${newName}"`,
        };
      } catch (error) {
        console.log("ERROR renaming file", error);
        throw new Error(
          `Failed to rename file: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  moveItem: protectedProcedure
    .input(
      z.object({
        fromPath: z.string().min(1, "Source path is required"),
        toPath: z.string().min(1, "Destination path is required"),
        itemType: z.enum(["file", "folder"]),
        itemId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { fromPath, toPath, itemType, itemId } = input;

        const response = await ctx.fsClient.moveItem(
          fromPath,
          toPath,
          itemType,
        );

        // Handle folder decoration updates if moving a folder
        if (itemType === "folder" && itemId) {
          try {
            const existingDecoration = await ctx.db.folderDecoration.findFirst({
              where: {
                folderId: itemId,
              },
            });

            if (
              existingDecoration &&
              existingDecoration.createdBy === ctx.session.user.id
            ) {
              // Update the folder path in decoration if needed
              // The name might have changed if the destination path includes a new name
              const pathParts = toPath.split("/").filter(Boolean);
              const newName =
                pathParts[pathParts.length - 1] || existingDecoration.name;

              await ctx.db.folderDecoration.update({
                where: {
                  id: existingDecoration.id,
                },
                data: {
                  name: newName,
                },
              });
              console.log(`Updated decoration for moved folder: ${itemId}`);
            }
          } catch (decorationError) {
            console.log(
              "WARNING: Failed to update folder decoration after move:",
              decorationError,
            );
          }
        }

        return {
          success: true,
          movedItem: response,
          message: `${itemType === "folder" ? "Folder" : "File"} moved successfully`,
        };
      } catch (error) {
        throw new Error(
          `Failed to move ${input.itemType}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  copyItem: protectedProcedure
    .input(
      z.object({
        fromPath: z.string().min(1, "Source path is required"),
        toPath: z.string().min(1, "Destination path is required"),
        itemType: z.enum(["file", "folder"]),
        itemId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { fromPath, toPath, itemType, itemId } = input;

        // Extract destination folder and file name
        const pathParts = toPath.split("/").filter(Boolean);
        const destFolder = "/" + pathParts.slice(0, -1).join("/");
        const destFileName = pathParts[pathParts.length - 1] || "";

        // Check if destination already has item with same name
        try {
          const destFolderContents = await ctx.fsClient.listFolder({
            path: destFolder === "/" ? "" : destFolder,
          });

          const existingItem = destFolderContents.entries.find(
            (entry) => entry.name === destFileName,
          );

          if (existingItem) {
            throw new Error(
              `An item named '${destFileName}' already exists in the destination folder. Please rename the item and try again.`,
            );
          }
        } catch (checkError) {
          // If we can't check for conflicts, proceed with copy and let the API handle it
          console.log("Could not check for existing items:", checkError);
        }

        const response = await ctx.fsClient.copyItem(
          fromPath,
          toPath,
          itemType,
        );

        // Handle folder decoration creation if copying a folder
        if (itemType === "folder" && itemId) {
          try {
            const sourceDecoration = await ctx.db.folderDecoration.findFirst({
              where: {
                folderId: itemId,
              },
            });

            if (
              sourceDecoration &&
              sourceDecoration.createdBy === ctx.session.user.id
            ) {
              // Create decoration for the copied folder
              const copiedFolderId = (response as any).id;
              const pathParts = toPath.split("/").filter(Boolean);
              const newName =
                pathParts[pathParts.length - 1] || sourceDecoration.name;

              await ctx.db.folderDecoration.create({
                data: {
                  folderId: copiedFolderId,
                  name: newName,
                  color: sourceDecoration.color,
                  backgroundPattern: sourceDecoration.backgroundPattern,
                  createdBy: ctx.session.user.id,
                  isSample: false,
                  decorations: {
                    create: [],
                  },
                },
              });
              console.log(
                `Created decoration for copied folder: ${copiedFolderId}`,
              );
            }
          } catch (decorationError) {
            console.log(
              "WARNING: Failed to create folder decoration after copy:",
              decorationError,
            );
          }
        }

        return {
          success: true,
          copiedItem: response,
          message: `${itemType === "folder" ? "Folder" : "File"} copied successfully`,
        };
      } catch (error) {
        throw new Error(
          `Failed to copy ${input.itemType}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  getGDriveUploadUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        parentPath: z.string().optional(),
        mimeType: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Ensure we are using the GoogleDriveWrapper
        if (!(ctx.fsClient instanceof GoogleDriveWrapper)) {
          throw new Error("This endpoint is only available for Google Drive");
        }

        // Access the underlying gdrive client to call the new method
        // We might need to expose the gdrive client or add the method to the wrapper/interface.
        // For simplicity, let's assume we updated GoogleDriveWrapper to have this method.

        // Note: You'll need to cast or update GoogleDriveWrapper to expose getResumableUploadUrl
        // See below on how to update the Wrapper/Interface quickly if needed.

        const gdriveWrapper = ctx.fsClient as any;
        const origin = ctx.headers.get("Origin");
        const response = await gdriveWrapper.gdrive.getResumableUploadUrl(
          input.fileName,
          input.parentPath || "",
          input.mimeType || "application/octet-stream",
          origin,
        );

        return {
          success: true,
          uploadUrl: response.uploadUrl,
        };
      } catch (error) {
        console.log("ERROR generating GDrive URL", error);
        throw new Error(
          `Failed to generate upload URL: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  createShareLink: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        itemType: z.enum(["file", "folder"]),
        role: z.enum(["reader", "commenter", "writer"]).default("reader"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Use the generic fsClient
        const response = await ctx.fsClient.createShareLink(
          input.itemId,
          input.role,
        );

        return {
          success: true,
          url: response.url,
          id: response.id,
          role: input.role,
        };
      } catch (error) {
        throw new Error(
          `Failed to create share link: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  shareWithUser: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        itemType: z.enum(["file", "folder"]),
        email: z.string().email(),
        role: z.enum(["reader", "commenter", "writer"]).default("reader"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const response = await ctx.fsClient.shareWithUser(
          input.itemId,
          input.email,
          input.role,
        );

        return {
          success: true,
          permission: response,
        };
      } catch (error) {
        throw new Error(
          `Failed to share with user: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  removePermission: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        itemType: z.enum(["file", "folder"]),
        permissionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.fsClient.removePermission(
          input.itemId,
          input.permissionId,
        );

        return {
          success: true,
          message: "Permission removed successfully",
        };
      } catch (error) {
        throw new Error(
          `Failed to remove permission: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),

  listPermissions: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        itemType: z.enum(["file", "folder"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const permissions = await ctx.fsClient.listPermissions(
          input.itemId,
        );

        console.log(permissions,"permissions")

        return {
          success: true,
          permissions,
        };
      } catch (error) {
        throw new Error(
          `Failed to list permissions: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    }),
});
