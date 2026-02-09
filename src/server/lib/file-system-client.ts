import { Dropbox } from "dropbox";
import type { files } from "dropbox";
import {
  GoogleDriveClient,
  type FolderMetadata,
  type ListFolderResponse,
  type CreateFolderResponse,
  type DeleteFolderResponse,
  type DeleteFileResponse,
  type UploadFileResponse,
  type RenameFolderResponse,
  type RenameFileResponse,
} from "./google-drive";
import { number, type keyof } from "better-auth";

export const PLATFORMS = ["dropbox", "google_drive"] as const;
export type PLATFORM = (typeof PLATFORMS)[number];

export interface FileSystemClient {
  listFolder({}: { path?: string }): Promise<ListFolderResponse>;
  createFolder(
    folderName: string,
    parentPath?: string,
  ): Promise<CreateFolderResponse>;
  deleteFolder(folderPath: string): Promise<DeleteFolderResponse>;
  renameFolder(
    folderPath: string,
    newName: string,
  ): Promise<RenameFolderResponse>;
  searchFolders(query: string): Promise<FolderMetadata[]>;
  uploadFile(
    fileData: ArrayBuffer | Uint8Array,
    fileName: string,
    parentPath?: string,
    mimeType?: string,
  ): Promise<UploadFileResponse>;
  deleteFile(filePath: string): Promise<DeleteFileResponse>;
  renameFile(filePath: string, newName: string): Promise<RenameFileResponse>;
  moveItem(
    fromPath: string,
    toPath: string,
    itemType: "file" | "folder",
  ): Promise<void>;
  copyItem(
    fromPath: string,
    toPath: string,
    itemType: "file" | "folder",
  ): Promise<CreateFolderResponse | UploadFileResponse>;

  // --- Sharing Methods ---
  createShareLink(
    itemId: string,
    role: "reader" | "commenter" | "writer",
  ): Promise<{ url: string; id: string }>;
  shareWithUser(
    itemId: string,
    email: string,
    role: "reader" | "commenter" | "writer",
  ): Promise<{ id: string; email: string; role: string }>;
  removePermission(itemId: string, permissionId: string): Promise<void>;
  listPermissions(itemId: string): Promise<
    Array<{
      id: string;
      email?: string;
      role: string;
      type: string;
      displayName?: string;
    }>
  >;
}

export class DropboxWrapper implements FileSystemClient {
  constructor(private dbx: Dropbox) {}

  async listFolder({ path = "" }): Promise<ListFolderResponse> {
    const response = await this.dbx.filesListFolder({ path });

    const entries: FolderMetadata[] = [];

    for (const entry of response.result.entries) {
      if (entry[".tag"] === "deleted" || !entry.path_display) continue;

      let previewUrl = "";

      // Only fetch preview URLs for files, not folders
      if (entry[".tag"] === "file") {
        const fileExtension = entry.name.split(".").pop()?.toLowerCase();
        const isImageFile = [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "jfif",
          "bmp",
          "webp",
        ].includes(fileExtension || "");

        try {
          if (isImageFile) {
            // For image files, create a shared link for direct access
            const sharedLink = await this.createShareLink(
              entry.path_display,
              "reader",
            );
            // Convert shared link to direct URL for immediate image display
            previewUrl = sharedLink.url
              .replace("www.dropbox.com", "dl.dropboxusercontent.com")
              .replace("?dl=0", "");
          }
          // else {
          //   // For non-image files (PDF, DOC, etc.), generate thumbnail
          //   try {
          //     const thumbnail = await this.dbx.filesGetThumbnailV2({
          //       resource: { ".tag": "path", path: entry.path_display },
          //       format: { ".tag": "jpeg" },
          //       size: { ".tag": "w128h128" },
          //     });

          //     // Convert thumbnail to data URL
          //     const buffer = (thumbnail.result as any).thumbnail;
          //     if (buffer) {
          //       const base64 = Buffer.from(buffer).toString("base64");
          //       previewUrl = `data:image/jpeg;base64,${base64}`;
          //     }
          //   } catch (thumbnailError) {
          //     console.log(
          //       "Thumbnail generation failed for",
          //       entry.path_display,
          //       thumbnailError,
          //     );
          //     // Fallback: try to get shared link for non-image files
          //     try {
          //       const sharedLink = await this.createShareLink(
          //         entry.path_display,
          //         "reader",
          //       );
          //       previewUrl = sharedLink.url
          //         .replace("www.dropbox.com", "dl.dropboxusercontent.com")
          //         .replace("?dl=0", "");
          //     } catch (fallbackError) {
          //       console.log(
          //         "Fallback preview link failed for",
          //         entry.path_display,
          //         fallbackError,
          //       );
          //     }
          //   }
          // }
        } catch (error) {
          // If shared link already exists, get existing link
          try {
            const existingLinks = await this.dbx.sharingListSharedLinks({
              path: entry.path_display,
            });
            if (
              existingLinks.result.links.length > 0 &&
              existingLinks.result.links[0]
            ) {
              // Convert existing shared link to direct URL for immediate image display
              previewUrl = existingLinks.result.links[0].url
                .replace("www.dropbox.com", "dl.dropboxusercontent.com")
                .replace("?dl=0", "");
            }
          } catch (linkError) {
            console.log(
              "Error getting preview link for",
              entry.path_display,
              linkError,
            );
          }
        }
      }

      entries.push({
        id: entry.id,
        name: entry.name,
        path: entry.path_display,
        size: String((entry as any)?.size || 0),
        preview: previewUrl,
        isFolder: entry[".tag"] === "folder",
        ".tag":
          entry[".tag"] === "folder" || entry[".tag"] === "file"
            ? entry[".tag"]
            : "file",
      });
    }

    return {
      entries,
      cursor: response.result.cursor,
      has_more: response.result.has_more,
    };
  }

  async createFolder(
    folderName: string,
    parentPath: string = "",
  ): Promise<CreateFolderResponse> {
    let fullPath = parentPath;
    if (fullPath && !fullPath.startsWith("/")) {
      fullPath = "/" + fullPath;
    }
    if (fullPath && !fullPath.endsWith("/")) {
      fullPath = fullPath + "/";
    }
    fullPath = fullPath + folderName;

    if (!fullPath.startsWith("/")) {
      fullPath = "/" + fullPath;
    }

    const response = await this.dbx.filesCreateFolderV2({
      path: fullPath,
      autorename: true,
    });

    const meta = response.result.metadata as { [key: string]: any };
    // const metaTag = meta[".tag"];
    // if (metaTag !== "folder") {
    //   throw new Error("Expected folder metadata");
    // }

    const folderMeta = meta as files.FolderMetadata;
    return {
      id: folderMeta.id,
      name: folderMeta.name,
      path_display: folderMeta.path_display || "",
    } as CreateFolderResponse;
  }

  async deleteFolder(folderPath: string): Promise<DeleteFolderResponse> {
    let fullFolderPath = folderPath;
    if (!fullFolderPath.startsWith("/")) {
      fullFolderPath = "/" + fullFolderPath;
    }

    const response = await this.dbx.filesDeleteV2({ path: fullFolderPath });

    const meta = response.result.metadata;
    if (meta[".tag"] === "deleted") {
      throw new Error("Cannot delete deleted metadata");
    }

    return {
      metadata: {
        id: meta.id,
        name: meta.name,
        path: meta.path_display || "",
        isFolder: meta[".tag"] === "folder",
        ".tag":
          meta[".tag"] === "folder" || meta[".tag"] === "file"
            ? meta[".tag"]
            : "file",
      },
    };
  }

  async searchFolders(query: string): Promise<FolderMetadata[]> {
    const response = await this.dbx.filesSearchV2({
      query,
      options: {
        file_extensions: [],
        path: "",
        max_results: 20,
      },
    });

    const folderResults = response.result.matches
      .filter(
        (match) =>
          match.metadata &&
          match.metadata[".tag"] === "metadata" &&
          match.metadata.metadata &&
          match.metadata.metadata[".tag"] === "folder",
      )
      .map((match) => {
        const meta = match.metadata;
        if (meta && meta[".tag"] === "metadata" && meta.metadata) {
          const folderMeta = meta.metadata;
          if (folderMeta[".tag"] === "folder") {
            return {
              id: folderMeta.id,
              name: folderMeta.name,
              path: folderMeta.path_display || "",
              isFolder: true,
              ".tag": "folder",
            };
          }
        }
        return null;
      })
      .filter((item): item is FolderMetadata => item !== null);

    return folderResults;
  }

  async uploadFile(
    fileData: ArrayBuffer | Uint8Array,
    fileName: string,
    parentPath: string = "",
    mimeType: string = "application/octet-stream",
  ): Promise<UploadFileResponse> {
    let fullPath = parentPath;
    if (fullPath && !fullPath.startsWith("/")) {
      fullPath = "/" + fullPath;
    }
    if (fullPath && !fullPath.endsWith("/")) {
      fullPath = fullPath + "/";
    }
    fullPath = fullPath + fileName;

    if (!fullPath.startsWith("/")) {
      fullPath = "/" + fullPath;
    }

    const response = await this.dbx.filesUpload({
      path: fullPath,
      contents: fileData,
      mode: { ".tag": "add" },
      autorename: true,
    });

    const fileMeta = response.result;
    return {
      id: fileMeta.id,
      name: fileMeta.name,
      path_display: fileMeta.path_display || "",
      size: String(fileMeta.size || 0),
    };
  }

  async renameFolder(
    folderPath: string,
    newName: string,
  ): Promise<RenameFolderResponse> {
    let fullFolderPath = folderPath;
    if (!fullFolderPath.startsWith("/")) {
      fullFolderPath = "/" + fullFolderPath;
    }

    // Extract parent path from the folder path
    const pathParts = fullFolderPath.split("/");
    pathParts.pop(); // Remove the folder name
    const parentPath = pathParts.join("/");

    // Construct new path with new name
    const newPath = parentPath ? `${parentPath}/${newName}` : `/${newName}`;

    const response = await this.dbx.filesMoveV2({
      from_path: fullFolderPath,
      to_path: newPath,
    });

    const meta = response.result.metadata;
    if (meta[".tag"] !== "folder") {
      throw new Error("Expected folder metadata after rename");
    }

    const folderMeta = meta as files.FolderMetadata;
    return {
      id: folderMeta.id,
      name: folderMeta.name,
      path_display: folderMeta.path_display || "",
    };
  }

  async renameFile(
    filePath: string,
    newName: string,
  ): Promise<RenameFileResponse> {
    let fullFilePath = filePath;
    if (!fullFilePath.startsWith("/")) {
      fullFilePath = "/" + fullFilePath;
    }

    // Extract parent path from the file path
    const pathParts = fullFilePath.split("/");
    pathParts.pop(); // Remove the file name
    const parentPath = pathParts.join("/");

    // Construct new path with new name
    const newPath = parentPath ? `${parentPath}/${newName}` : `/${newName}`;

    const response = await this.dbx.filesMoveV2({
      from_path: fullFilePath,
      to_path: newPath,
    });

    const meta = response.result.metadata;
    if (meta[".tag"] === "folder") {
      throw new Error("Expected file metadata after rename");
    }

    const fileMeta = meta as files.FileMetadata;
    return {
      id: fileMeta.id,
      name: fileMeta.name,
      path_display: fileMeta.path_display || "",
    };
  }

  async deleteFile(filePath: string): Promise<DeleteFileResponse> {
    let fullFilePath = filePath;
    if (!fullFilePath.startsWith("/")) {
      fullFilePath = "/" + fullFilePath;
    }

    const response = await this.dbx.filesDeleteV2({ path: fullFilePath });

    const meta = response.result.metadata;
    if (meta[".tag"] === "deleted") {
      throw new Error("Cannot delete deleted metadata");
    }

    return {
      id: meta.id,
      name: meta.name,
      path_display: meta.path_display || "",
    };
  }

  async moveItem(
    fromPath: string,
    toPath: string,
    itemType: "file" | "folder",
  ): Promise<void> {
    let fullFromPath = fromPath;
    if (!fullFromPath.startsWith("/")) {
      fullFromPath = "/" + fullFromPath;
    }

    let fullToPath = toPath;
    if (!fullToPath.startsWith("/")) {
      fullToPath = "/" + fullToPath;
    }

    await this.dbx.filesMoveBatchV2({
      entries: [
        {
          from_path: fullFromPath,
          to_path: fullToPath,
        },
      ],
    });
  }

  async copyItem(
    fromPath: string,
    toPath: string,
    itemType: "file" | "folder",
  ): Promise<CreateFolderResponse | UploadFileResponse> {
    let fullFromPath = fromPath;
    if (!fullFromPath.startsWith("/")) {
      fullFromPath = "/" + fullFromPath;
    }

    let fullToPath = toPath;
    if (!fullToPath.startsWith("/")) {
      fullToPath = "/" + fullToPath;
    }

    try {
      const response = await this.dbx.filesCopyV2({
        from_path: fullFromPath,
        to_path: fullToPath,
      });

      const metadata = response.result.metadata;

      if (metadata[".tag"] === "folder") {
        const folderMeta = metadata as files.FolderMetadata;
        return {
          id: folderMeta.id,
          name: folderMeta.name,
          path_display: folderMeta.path_display || "",
        } as CreateFolderResponse;
      } else {
        const fileMeta = metadata as files.FileMetadata;
        return {
          id: fileMeta.id,
          name: fileMeta.name,
          path_display: fileMeta.path_display || "",
          size: String(fileMeta.size || 0),
        } as UploadFileResponse;
      }
    } catch (error) {
      console.error("Dropbox copy error:", error);
      throw new Error(
        `Failed to copy ${itemType}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // --- DROPBOX SHARING IMPLEMENTATION ---

  async createShareLink(
    itemId: string,
    role: "reader" | "commenter" | "writer",
  ): Promise<{ url: string; id: string }> {
    try {
      // First, check if a link already exists
      const existingLinks = await this.dbx.sharingListSharedLinks({
        path: itemId,
      });
      if (existingLinks.result.links.length > 0) {
        return {
          url: existingLinks.result.links[0]?.url || "",
          id: existingLinks.result.links[0]?.id || "",
        };
      }

      // Create new shared link
      const response = await this.dbx.sharingCreateSharedLinkWithSettings({
        path: itemId,
        settings: {
          requested_visibility: { ".tag": "public" },
          allow_download: true,
        },
      });

      return {
        url: response.result.url,
        id: response.result.url, // Use URL as ID for links
      };
    } catch (error: any) {
      console.error("Dropbox createShareLink error:", error);
      // Handle specific case where link exists but list failed or race condition
      if (
        error.status === 409 &&
        error.error?.error_tag === "shared_link_already_exists"
      ) {
        // Fallback: try to list again or return a generic link message
        // For simplicity in this demo, we re-throw, but in prod you might list again.
      }
      throw new Error(`Failed to create share link: ${error.message}`);
    }
  }

  async shareWithUser(
    path: string,
    email: string,
    role: "reader" | "commenter" | "writer",
  ): Promise<{ id: string; email: string; role: string }> {
    try {
      // Dropbox: "Sharing with user" (Invite to folder) only works for Folders.
      // For files, we essentially create a link, but "Inviting" a specific user to a file isn't a standard API flow like Drive.
      // We will implement folder sharing here.

      // Map roles: reader -> viewer, writer -> editor
      const dbRole = role === "writer" ? "editor" : "viewer";

      // 1. Get folder metadata to check if it is already a shared folder
      const metadata = await this.dbx.filesGetMetadata({ path });

      let sharedFolderId: string | undefined;

      if (metadata.result[".tag"] === "folder") {
        const folderMeta = metadata.result as files.FolderMetadata;

        if (folderMeta.sharing_info) {
          sharedFolderId = folderMeta.sharing_info.shared_folder_id;
        } else {
          // Folder not shared yet. Share it first.
          const shareRes = await this.dbx.sharingShareFolder({
            path,
            acl_update_policy: { ".tag": "owner" }, // Owner manages ACLs
            force_async: false,
          });

          if (shareRes.result[".tag"] === "complete") {
            // It is immediately a shared folder
            if (
              shareRes.result[".tag"] === "complete" &&
              shareRes.result.shared_folder_id
            ) {
              sharedFolderId = shareRes.result.shared_folder_id;
            }
          } else if (shareRes.result[".tag"] === "async_job_id") {
            // In a real app, you'd poll here. For this snippet, we'll assume success or fail.
            // To keep this implementation simple and synchronous for the user request:
            throw new Error(
              "Folder is being processed. Please try again in a moment.",
            );
          }
        }

        if (sharedFolderId) {
          await this.dbx.sharingAddFolderMember({
            shared_folder_id: sharedFolderId,
            members: [
              {
                member: { ".tag": "email", email },
                access_level: { ".tag": dbRole },
              },
            ],
          });
          return { id: email, email, role: dbRole };
        }
      } else {
        // It's a file. Dropbox doesn't support "Invite User" for files like Google Drive.
        // Fallback: Create a shared link.
        await this.createShareLink(path, role);
        // Return a dummy permission indicating it's a link share
        return { id: "link", email, role: "viewer_via_link" };
      }

      throw new Error("Failed to share folder");
    } catch (error: any) {
      console.error("Dropbox shareWithUser error:", error);
      throw new Error(`Failed to share with user: ${error.message}`);
    }
  }

  // async removePermission(itemId: string, permissionId: string): Promise<void> {
  //   try {
  //     // Dropbox uses email to remove members usually, or shared_folder_id
  //     // This is complex as we don't have the shared_folder_id stored in the listPermissions easily
  //     // For this simplified implementation, we will focus on the Link logic.

  //     // If permissionId is "link" or a URL, we revoke the link
  //     if (permissionId.includes("dropbox.com")) {
  //       await this.dbx.sharingRevokeSharedLink({ url: permissionId });
  //     } else {
  //       // Removing a user member requires the shared_folder_id and the member ID (email or dropbox_id)
  //       // Since we don't implement full member ID mapping in this snippet, we throw or handle gracefully
  //       throw new Error(
  //         "Removing specific user members is not fully implemented for Dropbox in this demo.",
  //       );
  //     }
  //   } catch (error: any) {
  //     throw new Error(`Failed to remove permission: ${error.message}`);
  //   }
  // }

  async removePermission(itemId: string, permissionId: string): Promise<void> {
    try {
      // Case 1: Shared link (URL or link ID)
      if (permissionId.includes("dropbox.com") || permissionId === "link") {
        await this.dbx.sharingRevokeSharedLink({ url: permissionId });
        return;
      }

      // Case 2: User permission (email or dropbox_id)
      // Get folder metadata to find shared_folder_id
      const metadata = await this.dbx.filesGetMetadata({ path: itemId });

      if (
        metadata.result[".tag"] === "folder" &&
        metadata.result.sharing_info?.shared_folder_id
      ) {
        const sharedFolderId = metadata.result.sharing_info.shared_folder_id;

        // Try removing by email first
        try {
          await this.dbx.sharingRemoveFolderMember({
            shared_folder_id: sharedFolderId,
            member: { ".tag": "email", email: permissionId },
            leave_a_copy: false, // REQUIRED parameter - set to false to remove completely
          });
          return;
        } catch (emailError: any) {
          // If email fails, try by dropbox_id
          if (emailError.error?.error_summary?.includes("no_explicit_access")) {
            // Member not found by email, try dropbox_id
            try {
              await this.dbx.sharingRemoveFolderMember({
                shared_folder_id: sharedFolderId,
                member: { ".tag": "dropbox_id", dropbox_id: permissionId },
                leave_a_copy: false, // REQUIRED parameter
              });
              return;
            } catch (idError: any) {
              throw new Error(
                `Failed to remove member ${permissionId}: ${idError.error_summary || "not found"}`,
              );
            }
          }
          throw emailError;
        }
      }

      throw new Error("Item is not a shared folder or permission not found");
    } catch (error: any) {
      console.error("Dropbox removePermission error:", error);
      throw new Error(
        `Failed to remove permission: ${error.error_summary || error.message}`,
      );
    }
  }

  async listPermissions(path: string): Promise<
    Array<{
      id: string;
      email?: string;
      role: string;
      type: string;
      displayName?: string;
    }>
  > {
    try {
      const permissions = [];

      // 1. Check for Shared Link
      try {
        const links = await this.dbx.sharingListSharedLinks({ path });
        if (links.result.links.length > 0) {
          permissions.push({
            id: links.result.links[0]?.url || "link",
            role: "reader",
            type: "anyone",
            displayName: "Anyone with the link",
          });
        }
      } catch (err) {
        // Ignore errors if no links exist
      }

      // 2. Check for Folder Members (if applicable)
      const metadata = await this.dbx.filesGetMetadata({ path });
      if (metadata.result[".tag"] === "folder") {
        const folderMeta = metadata.result as files.FolderMetadata;
        if (folderMeta.sharing_info?.shared_folder_id) {
          try {
            const members = await this.dbx.sharingListFolderMembers({
              shared_folder_id: folderMeta.sharing_info.shared_folder_id,
            });

            // FIX: Access .users instead of .members
            const users = members.result.users || [];

            for (const member of users) {
              // FIX: Access .user instead of .profile
              const userInfo = member.user;

              if (userInfo) {
                permissions.push({
                  id: userInfo.team_member_id || userInfo.email,
                  email: userInfo.email,
                  role: member.access_type[".tag"], // viewer, editor, owner
                  type: "user",
                  displayName: userInfo.display_name || userInfo.email,
                });
              }
            }
          } catch (err) {
            // Sometimes listing members fails if permissions are odd, ignore to keep UI usable
            console.error("Error listing folder members:", err);
          }
        }
      }

      return permissions;
    } catch (error: any) {
      console.error("Dropbox listPermissions error:", error);
      return [];
    }
  }
}

export class GoogleDriveWrapper implements FileSystemClient {
  constructor(private gdrive: GoogleDriveClient) {}

  async listFolder({
    path = "",
  }: {
    path?: string;
  }): Promise<ListFolderResponse> {
    return this.gdrive.listFolder({ path });
  }

  async createFolder(
    folderName: string,
    parentPath?: string,
  ): Promise<CreateFolderResponse> {
    return this.gdrive.createFolder(folderName, parentPath || "");
  }

  async deleteFolder(folderPath: string): Promise<DeleteFolderResponse> {
    return this.gdrive.deleteFolder(folderPath);
  }

  async searchFolders(query: string): Promise<FolderMetadata[]> {
    return this.gdrive.searchFolders(query);
  }

  async uploadFile(
    fileData: ArrayBuffer | Uint8Array,
    fileName: string,
    parentPath: string = "",
    mimeType: string = "application/octet-stream",
  ): Promise<UploadFileResponse> {
    return this.gdrive.uploadFile(fileData, fileName, parentPath, mimeType);
  }

  async renameFolder(
    folderPath: string,
    newName: string,
  ): Promise<RenameFolderResponse> {
    return this.gdrive.renameFolder(folderPath, newName);
  }

  async renameFile(
    filePath: string,
    newName: string,
  ): Promise<RenameFileResponse> {
    return this.gdrive.renameFile(filePath, newName);
  }

  async deleteFile(filePath: string): Promise<DeleteFileResponse> {
    return this.gdrive.deleteFile(filePath);
  }

  async moveItem(
    fromPath: string,
    toPath: string,
    itemType: "file" | "folder",
  ): Promise<void> {
    return this.gdrive.moveItem(fromPath, toPath, itemType);
  }

  async copyItem(
    fromPath: string,
    toPath: string,
    itemType: "file" | "folder",
  ): Promise<CreateFolderResponse | UploadFileResponse> {
    return this.gdrive.copyItem(fromPath, toPath, itemType);
  }

  async getResumableUploadUrl(
    fileName: string,
    parentPath: string,
    mimeType: string,
    origin?: string,
  ) {
    return this.gdrive.getResumableUploadUrl(
      fileName,
      parentPath,
      mimeType,
      origin,
    );
  }

  // --- GOOGLE DRIVE SHARING IMPLEMENTATION ---
  async createShareLink(
    itemId: string,
    role: "reader" | "commenter" | "writer",
  ): Promise<{ url: string; id: string }> {
    return this.gdrive.createShareLink(itemId, role);
  }
  async shareWithUser(
    itemId: string,
    email: string,
    role: "reader" | "commenter" | "writer",
  ): Promise<{ id: string; email: string; role: string }> {
    return this.gdrive.shareWithUser(itemId, email, role);
  }
  async removePermission(itemId: string, permissionId: string): Promise<void> {
    return this.gdrive.removePermission(itemId, permissionId);
  }
  async listPermissions(itemId: string): Promise<
    Array<{
      id: string;
      email?: string;
      role: string;
      type: string;
      displayName?: string;
    }>
  > {
    return this.gdrive.listPermissions(itemId);
  }
}

export function createFileSystemClient(
  platform: PLATFORM,
  dropboxClient?: Dropbox,
  googleDriveClient?: GoogleDriveClient,
): FileSystemClient {
  switch (platform) {
    case "dropbox":
      if (!dropboxClient) {
        throw new Error("Dropbox client not provided for Dropbox platform");
      }
      return new DropboxWrapper(dropboxClient);

    case "google_drive":
      if (!googleDriveClient) {
        throw new Error(
          "Google Drive client not provided for Google Drive platform",
        );
      }
      return new GoogleDriveWrapper(googleDriveClient);

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
