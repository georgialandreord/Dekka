// import { drive_v3, drive } from "@googleapis/drive";
// import { OAuth2Client } from "google-auth-library";

// export type FolderMetadata = {
//   id: string;
//   name: string;
//   path: string;
//   path_lower?: string;
//   path_display?: string;
//   isFolder: boolean;
//   size?: string | null;
//   preview?: string;
//   ".tag": "folder" | "file";
// };

// export type ListFolderResponse = {
//   entries: FolderMetadata[];
//   cursor?: string;
//   has_more?: boolean;
// };

// export type CreateFolderResponse = {
//   id: string;
//   name: string;
//   path_display: string;
// };

// export type DeleteFolderResponse = {
//   metadata: FolderMetadata;
// };

// export type UploadFileResponse = {
//   id: string;
//   name: string;
//   path_display: string;
//   size?: string;
// };

// export type DeleteFileResponse = {
//   id: string;
//   name: string;
//   path_display: string;
// };

// export type RenameFolderResponse = {
//   id: string;
//   name: string;
//   path_display: string;
// };

// export type RenameFileResponse = {
//   id: string;
//   name: string;
//   path_display: string;
// };

// export type CopyFileResponse = {
//   id: string;
//   name: string;
//   path_display: string;
//   size?: string;
// };

// export type CopyFolderResponse = {
//   id: string;
//   name: string;
//   path_display: string;
// };

// export class GoogleDriveClient {
//   private drive: drive_v3.Drive;
//   private oauth2Client: OAuth2Client;

//   constructor(
//     accessToken: string,
//     refreshToken: string,
//     clientId: string,
//     clientSecret: string,
//   ) {
//     this.oauth2Client = new OAuth2Client(clientId, clientSecret);
//     this.oauth2Client.setCredentials({
//       access_token: accessToken,
//       refresh_token: refreshToken,
//     });

//     this.drive = drive({ version: "v3", auth: this.oauth2Client });
//   }

//   async listFolder({
//     path = "",
//   }: {
//     path: string;
//   }): Promise<ListFolderResponse> {
//     let folderId: string;

//     if (path === "" || path === "/") {
//       folderId = "root";
//     } else {
//       const folder = await this.getFolderByPath(path);
//       if (!folder) {
//         throw new Error(`Folder not found: ${path}`);
//       }
//       folderId = folder.id;
//     }

//     const response = await this.drive.files.list({
//       q: `'${folderId}' in parents and trashed=false`,
//       fields:
//         "files(id,name,mimeType,parents,size,thumbnailLink,webContentLink,webViewLink),nextPageToken",
//       pageSize: 100,
//     });

//     const entries: FolderMetadata[] = (response.data.files || []).map(
//       (file) => {
//         let previewUrl = "";

//         // Only generate preview URLs for files, not folders
//         if (file.mimeType !== "application/vnd.google-apps.folder") {
//           const fileExtension = file.name!.split(".").pop()?.toLowerCase();
//           const isImageFile = [
//             "jpg",
//             "jpeg",
//             "png",
//             "gif",
//             "jfif",
//             "bmp",
//             "webp",
//           ].includes(fileExtension || "");

//           // Use the fields already fetched from the list response
//           if (isImageFile) {
//             // For image files, prioritize thumbnailLink, then webContentLink
//             let originalUrl = file.thumbnailLink || file.webContentLink || "";

//             // If we have a file ID, try to construct a thumbnail URL
//             if (!originalUrl && file.id) {
//               originalUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w220-h220`;
//             }

//             previewUrl = originalUrl
//               ? `/api/proxy/image?url=${encodeURIComponent(originalUrl)}`
//               : "";
//           } else {
//             // For non-image files (PDF, DOC, etc.), use thumbnailLink if available
//             let originalUrl = file.thumbnailLink || "";

//             // If no thumbnail available but we have file ID, construct thumbnail URL
//             if (!originalUrl && file.id) {
//               originalUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w220-h220`;
//             }

//             // Fallback to webContentLink or webViewLink
//             if (!originalUrl) {
//               const fallbackUrl = file.webContentLink || file.webViewLink || "";
//               originalUrl = fallbackUrl;
//             }

//             previewUrl = originalUrl
//               ? `/api/proxy/image?url=${encodeURIComponent(originalUrl)}`
//               : "";
//           }
//         }

//         return {
//           id: file.id!,
//           name: file.name!,
//           path: `${path === "/" ? "" : path}/${file.name}`,
//           size: file.size,
//           preview: previewUrl,
//           isFolder: file.mimeType === "application/vnd.google-apps.folder",
//           ".tag":
//             file.mimeType === "application/vnd.google-apps.folder"
//               ? "folder"
//               : "file",
//         };
//       },
//     );

//     return {
//       entries,
//       cursor: response.data.nextPageToken || undefined,
//       has_more: !!response.data.nextPageToken,
//     };
//   }

//   async createFolder(
//     folderName: string,
//     parentPath: string = "",
//   ): Promise<CreateFolderResponse> {
//     let parentFolderId: string;

//     if (parentPath === "" || parentPath === "/") {
//       parentFolderId = "root";
//     } else {
//       const parentFolder = await this.getFolderByPath(parentPath);
//       if (!parentFolder) {
//         throw new Error(`Parent folder not found: ${parentPath}`);
//       }
//       parentFolderId = parentFolder.id;
//     }

//     const response = await this.drive.files.create({
//       requestBody: {
//         name: folderName,
//         mimeType: "application/vnd.google-apps.folder",
//         parents:
//           parentPath === "" || parentPath === "/"
//             ? undefined
//             : [parentFolderId],
//       },
//       fields: "id,name",
//     });

//     const folder = response.data;
//     const fullPath = `${parentPath === "/" ? "" : parentPath}/${folderName}`;

//     return {
//       id: folder.id!,
//       name: folder.name!,
//       path_display: fullPath,
//     };
//   }

//   async deleteFolder(folderPath: string): Promise<DeleteFolderResponse> {
//     const folder = await this.getFolderByPath(folderPath);
//     if (!folder) {
//       throw new Error(`Folder not found: ${folderPath}`);
//     }

//     await this.drive.files.delete({
//       fileId: folder.id,
//     });

//     return {
//       metadata: folder,
//     };
//   }

//   async deleteFile(filePath: string): Promise<DeleteFileResponse> {
//     const file = await this.getFileByPath(filePath);
//     if (!file) {
//       throw new Error(`File not found: ${filePath}`);
//     }

//     await this.drive.files.delete({
//       fileId: file.id,
//     });

//     return {
//       id: file.id,
//       name: file.name,
//       path_display: filePath,
//     };
//   }

//   async searchFolders(query: string): Promise<FolderMetadata[]> {
//     const response = await this.drive.files.list({
//       q: `name contains '${query}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
//       fields: "files(id,name,parents)",
//       pageSize: 20,
//     });

//     const folders: FolderMetadata[] = (response.data.files || []).map(
//       (file) => ({
//         id: file.id!,
//         name: file.name!,
//         path:
//           file.parents && file.parents.length > 0
//             ? `/${file.parents[0]}/${file.name}`
//             : `/${file.name}`,
//         isFolder: true,
//         ".tag": "folder",
//       }),
//     );

//     return folders;
//   }

//   async uploadFile(
//     fileData: ArrayBuffer | Uint8Array,
//     fileName: string,
//     parentPath: string = "",
//     mimeType: string = "application/octet-stream",
//   ): Promise<UploadFileResponse> {
//     let parentFolderId: string;

//     if (parentPath === "" || parentPath === "/") {
//       parentFolderId = "root";
//     } else {
//       const parentFolder = await this.getFolderByPath(parentPath);
//       if (!parentFolder) {
//         throw new Error(`Parent folder not found: ${parentPath}`);
//       }
//       parentFolderId = parentFolder.id;
//     }

//     // Convert ArrayBuffer/Uint8Array to Buffer for Google Drive API
//     const buffer =
//       fileData instanceof ArrayBuffer
//         ? Buffer.from(fileData)
//         : Buffer.from(
//             fileData.buffer,
//             fileData.byteOffset,
//             fileData.byteLength,
//           );

//     // Create a readable stream from the buffer
//     const { Readable } = await import("stream");
//     const stream = new Readable();
//     stream._read = () => {}; // _read is required but no-op
//     stream.push(buffer);
//     stream.push(null);

//     const response = await this.drive.files.create({
//       requestBody: {
//         name: fileName,
//         mimeType,
//         parents:
//           parentPath === "" || parentPath === "/"
//             ? undefined
//             : [parentFolderId],
//       },
//       media: {
//         mimeType,
//         body: stream, // Use readable stream instead of buffer
//       },
//       fields: "id,name,size",
//     });

//     const file = response.data;
//     const fullPath = `${parentPath === "/" ? "" : parentPath}/${fileName}`;

//     return {
//       id: file.id!,
//       name: file.name!,
//       path_display: fullPath,
//       size: file.size || undefined,
//     };
//   }

//   private async getFolderByPath(path: string): Promise<FolderMetadata | null> {
//     if (!path || path === "/" || path === "") {
//       return {
//         id: "root",
//         name: "My Drive",
//         path: "/",
//         isFolder: true,
//         ".tag": "folder",
//       };
//     }

//     const parts = path.split("/").filter(Boolean);
//     if (parts.length === 0) {
//       return {
//         id: "root",
//         name: "My Drive",
//         path: "/",
//         isFolder: true,
//         ".tag": "folder",
//       };
//     }

//     let currentId = "root";
//     let currentPath = "";

//     for (const part of parts) {
//       currentPath = `${currentPath}/${part}`;

//       const response = await this.drive.files.list({
//         q: `'${currentId}' in parents and name='${part}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
//         fields: "files(id,name)",
//         pageSize: 1,
//       });

//       const files = response.data.files;
//       if (!files || files.length === 0) {
//         return null;
//       }

//       currentId = files[0]?.id || "";
//       if (!currentId) {
//         return null;
//       }
//     }

//     return {
//       id: currentId,
//       name: parts[parts.length - 1] || "",
//       path,
//       isFolder: true,
//       ".tag": "folder",
//     };
//   }

//   async renameFolder(
//     folderPath: string,
//     newName: string,
//   ): Promise<RenameFolderResponse> {
//     const folder = await this.getFolderByPath(folderPath);
//     if (!folder) {
//       throw new Error(`Folder not found: ${folderPath}`);
//     }

//     const response = await this.drive.files.update({
//       fileId: folder.id,
//       requestBody: {
//         name: newName,
//       },
//       fields: "id,name",
//     });

//     const updatedFolder = response.data;
//     const parts = folderPath.split("/").filter(Boolean);
//     parts.pop(); // Remove old name
//     parts.push(newName); // Add new name
//     const newPath = "/" + parts.join("/");

//     return {
//       id: updatedFolder.id!,
//       name: updatedFolder.name!,
//       path_display: newPath,
//     };
//   }

//   async renameFile(
//     filePath: string,
//     newName: string,
//   ): Promise<RenameFileResponse> {
//     const file = await this.getFileByPath(filePath);
//     if (!file) {
//       throw new Error(`File not found: ${filePath}`);
//     }

//     const response = await this.drive.files.update({
//       fileId: file.id,
//       requestBody: {
//         name: newName,
//       },
//       fields: "id,name",
//     });

//     const updatedFile = response.data;
//     const parts = filePath.split("/").filter(Boolean);
//     parts.pop(); // Remove old name
//     parts.push(newName); // Add new name
//     const newPath = "/" + parts.join("/");

//     return {
//       id: updatedFile.id!,
//       name: updatedFile.name!,
//       path_display: newPath,
//     };
//   }

//   async moveItem(
//     fromPath: string,
//     toPath: string,
//     itemType: "file" | "folder",
//   ): Promise<void> {
//     // Get the source item (file or folder)
//     const sourceItem =
//       itemType === "folder"
//         ? await this.getFolderByPath(fromPath)
//         : await this.getFileByPath(fromPath);

//     if (!sourceItem) {
//       throw new Error(`${itemType} not found: ${fromPath}`);
//     }

//     // Get the destination folder
//     const toPathParts = toPath.split("/").filter(Boolean);
//     const itemName = toPathParts.pop() || sourceItem.name; // Get new name if specified, otherwise keep original
//     const destinationFolderPath = "/" + toPathParts.join("/");

//     let destinationFolderId = "root";
//     if (destinationFolderPath !== "/" && destinationFolderPath !== "") {
//       const destinationFolder = await this.getFolderByPath(
//         destinationFolderPath,
//       );
//       if (!destinationFolder) {
//         throw new Error(
//           `Destination folder not found: ${destinationFolderPath}`,
//         );
//       }
//       destinationFolderId = destinationFolder.id;
//     }

//     // Extract current parent folders
//     const fromPathParts = fromPath.split("/").filter(Boolean);
//     const sourceName = fromPathParts.pop() || sourceItem.name;
//     const sourceParentPath = "/" + fromPathParts.join("/");

//     let sourceParentId = "root";
//     if (sourceParentPath !== "/" && sourceParentPath !== "") {
//       const sourceParentFolder = await this.getFolderByPath(sourceParentPath);
//       if (!sourceParentFolder) {
//         throw new Error(`Source parent folder not found: ${sourceParentPath}`);
//       }
//       sourceParentId = sourceParentFolder.id;
//     }

//     // Move the item by updating parents and optionally the name
//     const updateParams: any = {
//       fileId: sourceItem.id,
//       fields: "id,name,parents",
//     };

//     if (itemName !== sourceItem.name) {
//       updateParams.requestBody = { name: itemName };
//     }

//     if (destinationFolderId !== "root") {
//       updateParams.addParents = [destinationFolderId];
//     }

//     if (sourceParentId !== "root") {
//       updateParams.removeParents = [sourceParentId];
//     }

//     await this.drive.files.update(updateParams);
//   }

//   private async getFileByPath(path: string): Promise<FolderMetadata | null> {
//     if (!path || path === "/" || path === "") {
//       throw new Error("Invalid file path");
//     }

//     const parts = path.split("/").filter(Boolean);
//     if (parts.length === 0) {
//       throw new Error("Invalid file path");
//     }

//     const fileName = parts[parts.length - 1];
//     const parentPath = "/" + parts.slice(0, -1).join("/");

//     let parentFolderId = "root";

//     // Get parent folder ID if not root
//     if (parts.length > 1) {
//       const parentFolder = await this.getFolderByPath(parentPath);
//       if (!parentFolder) {
//         return null;
//       }
//       parentFolderId = parentFolder.id;
//     }

//     // Search for file in parent folder
//     const response = await this.drive.files.list({
//       q: `'${parentFolderId}' in parents and name='${fileName}' and mimeType!='application/vnd.google-apps.folder' and trashed=false`,
//       fields: "files(id,name,size)",
//       pageSize: 1,
//     });

//     const files = response.data.files;
//     if (!files || files.length === 0) {
//       return null;
//     }

//     const file = files[0];
//     if (!file) {
//       return null;
//     }

//     return {
//       id: file.id!,
//       name: file.name!,
//       path,
//       size: file.size?.toString() || null,
//       isFolder: false,
//       ".tag": "file",
//     };
//   }

//   async copyItem(
//     fromPath: string,
//     toPath: string,
//     itemType: "file" | "folder",
//   ): Promise<CreateFolderResponse | UploadFileResponse> {
//     // Get the source item (file or folder)
//     const sourceItem =
//       itemType === "folder"
//         ? await this.getFolderByPath(fromPath)
//         : await this.getFileByPath(fromPath);

//     if (!sourceItem) {
//       throw new Error(`${itemType} not found: ${fromPath}`);
//     }

//     // Extract destination folder path and new name
//     const pathParts = toPath.split("/").filter(Boolean);
//     const newName = pathParts.pop() || sourceItem.name;
//     const destPath = "/" + pathParts.join("/");

//     // Get destination folder ID
//     let destFolderId = "root";
//     if (pathParts.length > 0) {
//       const destFolder = await this.getFolderByPath(destPath);
//       if (!destFolder) {
//         throw new Error(`Destination folder not found: ${destPath}`);
//       }
//       destFolderId = destFolder.id;
//     }

//     try {
//       // Use Google Drive files.copy API
//       const response = await this.drive.files.copy({
//         fileId: sourceItem.id,
//         requestBody: {
//           name: newName,
//           parents: destFolderId === "root" ? undefined : [destFolderId],
//         },
//         fields: "id,name,size,mimeType",
//       });

//       const copiedFile = response.data;
//       if (!copiedFile.id) {
//         throw new Error("Failed to copy item: No ID returned");
//       }

//       const fullPath = `${destPath === "/" ? "" : destPath}/${newName}`;

//       if (copiedFile.mimeType === "application/vnd.google-apps.folder") {
//         return {
//           id: copiedFile.id,
//           name: copiedFile.name!,
//           path_display: fullPath,
//         } as CreateFolderResponse;
//       } else {
//         return {
//           id: copiedFile.id,
//           name: copiedFile.name!,
//           path_display: fullPath,
//           size: copiedFile.size?.toString() || "0",
//         } as UploadFileResponse;
//       }
//     } catch (error) {
//       console.error("Google Drive copy error:", error);
//       throw new Error(
//         `Failed to copy ${itemType}: ${error instanceof Error ? error.message : "Unknown error"}`,
//       );
//     }
//   }

//   // test

//   async getResumableUploadUrl(
//     fileName: string,
//     parentPath: string = "",
//     mimeType: string = "application/octet-stream",
//     origin?: string,
//   ): Promise<{ uploadUrl: string; fileId: string }> {
//     let parentFolderId: string;

//     if (parentPath === "" || parentPath === "/") {
//       parentFolderId = "root";
//     } else {
//       const parentFolder = await this.getFolderByPath(parentPath);
//       if (!parentFolder) {
//         throw new Error(`Parent folder not found: ${parentPath}`);
//       }
//       parentFolderId = parentFolder.id;
//     }

//     // Get the access token to authorize the request
//     const { token } = await this.oauth2Client.getAccessToken();
//     if (!token) {
//       throw new Error("Failed to retrieve access token");
//     }

//     // Build headers object
//     const headers: Record<string, string> = {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json; charset=UTF-8",
//     };

//     // Include Origin header if provided
//     if (origin) {
//       headers["Origin"] = origin;
//     }

//     // We use fetch directly here to get the 'Location' header which contains the resumable URL.
//     // The googleapis client library abstracts this away when doing full uploads, but we need the URL for the frontend.
//     const initiateResponse = await fetch(
//       `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable`,
//       {
//         method: "POST",
//         headers,
//         body: JSON.stringify({
//           name: fileName,
//           mimeType: mimeType,
//           parents: [parentFolderId],
//         }),
//       },
//     );

//     if (!initiateResponse.ok) {
//       const errorText = await initiateResponse.text();
//       throw new Error(
//         `Failed to initiate upload: ${initiateResponse.status} ${errorText}`,
//       );
//     }

//     const uploadUrl = initiateResponse.headers.get("Location");
//     if (!uploadUrl) {
//       throw new Error("Upload URL not found in response headers");
//     }

//     // Note: Google Drive resumable uploads generate an ID immediately,
//     // but we often just return the URL. We will return the URL to the frontend.
//     return { uploadUrl, fileId: "" }; // fileId is usually generated upon completion or can be extracted if needed
//   }
// }

import { drive_v3, drive } from "@googleapis/drive";
import { OAuth2Client } from "google-auth-library";

export type FolderMetadata = {
  id: string;
  name: string;
  path: string;
  path_lower?: string;
  path_display?: string;
  isFolder: boolean;
  size?: string | null;
  preview?: string;
  ".tag": "folder" | "file";
};

export type ListFolderResponse = {
  entries: FolderMetadata[];
  cursor?: string;
  has_more?: boolean;
};

export type CreateFolderResponse = {
  id: string;
  name: string;
  path_display: string;
};

export type DeleteFolderResponse = {
  metadata: FolderMetadata;
};

export type UploadFileResponse = {
  id: string;
  name: string;
  path_display: string;
  size?: string;
};

export type DeleteFileResponse = {
  id: string;
  name: string;
  path_display: string;
};

export type RenameFolderResponse = {
  id: string;
  name: string;
  path_display: string;
};

export type RenameFileResponse = {
  id: string;
  name: string;
  path_display: string;
};

export type CopyFileResponse = {
  id: string;
  name: string;
  path_display: string;
  size?: string;
};

export type CopyFolderResponse = {
  id: string;
  name: string;
  path_display: string;
};

export class GoogleDriveClient {
  private drive: drive_v3.Drive;
  private oauth2Client: OAuth2Client;

  constructor(
    accessToken: string,
    refreshToken: string,
    clientId: string,
    clientSecret: string,
  ) {
    this.oauth2Client = new OAuth2Client(clientId, clientSecret);
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    this.drive = drive({ version: "v3", auth: this.oauth2Client });
  }

  async listFolder({
    path = "",
  }: {
    path: string;
  }): Promise<ListFolderResponse> {
    let folderId: string;

    if (path === "" || path === "/") {
      folderId = "root";
    } else {
      const folder = await this.getFolderByPath(path);
      if (!folder) {
        throw new Error(`Folder not found: ${path}`);
      }
      folderId = folder.id;
    }

    const response = await this.drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields:
        "files(id,name,mimeType,parents,size,thumbnailLink,webContentLink,webViewLink),nextPageToken",
      pageSize: 100,
    });

    const entries: FolderMetadata[] = (response.data.files || []).map(
      (file) => {
        let previewUrl = "";

        // Only generate preview URLs for files, not folders
        if (file.mimeType !== "application/vnd.google-apps.folder") {
          const fileExtension = file.name!.split(".").pop()?.toLowerCase();
          const isImageFile = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "jfif",
            "bmp",
            "webp",
          ].includes(fileExtension || "");

          // Use the fields already fetched from the list response
          if (isImageFile) {
            // For image files, prioritize thumbnailLink, then webContentLink
            let originalUrl = file.thumbnailLink || file.webContentLink || "";

            // If we have a file ID, try to construct a thumbnail URL
            if (!originalUrl && file.id) {
              originalUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w220-h220`;
            }

            previewUrl = originalUrl
              ? `/api/proxy/image?url=${encodeURIComponent(originalUrl)}`
              : "";
          } else {
            // For non-image files (PDF, DOC, etc.), use thumbnailLink if available
            let originalUrl = file.thumbnailLink || "";

            // If no thumbnail available but we have file ID, construct thumbnail URL
            if (!originalUrl && file.id) {
              originalUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w220-h220`;
            }

            // Fallback to webContentLink or webViewLink
            if (!originalUrl) {
              const fallbackUrl = file.webContentLink || file.webViewLink || "";
              originalUrl = fallbackUrl;
            }

            previewUrl = originalUrl
              ? `/api/proxy/image?url=${encodeURIComponent(originalUrl)}`
              : "";
          }
        }

        return {
          id: file.id!,
          name: file.name!,
          path: `${path === "/" ? "" : path}/${file.name}`,
          size: file.size,
          preview: previewUrl,
          isFolder: file.mimeType === "application/vnd.google-apps.folder",
          ".tag":
            file.mimeType === "application/vnd.google-apps.folder"
              ? "folder"
              : "file",
        };
      },
    );

    return {
      entries,
      cursor: response.data.nextPageToken || undefined,
      has_more: !!response.data.nextPageToken,
    };
  }

  async createFolder(
    folderName: string,
    parentPath: string = "",
  ): Promise<CreateFolderResponse> {
    let parentFolderId: string;

    if (parentPath === "" || parentPath === "/") {
      parentFolderId = "root";
    } else {
      const parentFolder = await this.getFolderByPath(parentPath);
      if (!parentFolder) {
        throw new Error(`Parent folder not found: ${parentPath}`);
      }
      parentFolderId = parentFolder.id;
    }

    const response = await this.drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        // If parentPath is root, we omit parents. Google API defaults to root.
        parents:
          parentPath === "" || parentPath === "/"
            ? undefined
            : [parentFolderId],
      },
      fields: "id,name",
    });

    const folder = response.data;
    const fullPath = `${parentPath === "/" ? "" : parentPath}/${folderName}`;

    return {
      id: folder.id!,
      name: folder.name!,
      path_display: fullPath,
    };
  }

  async deleteFolder(folderPath: string): Promise<DeleteFolderResponse> {
    const folder = await this.getFolderByPath(folderPath);
    if (!folder) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    await this.drive.files.delete({
      fileId: folder.id,
    });

    return {
      metadata: folder,
    };
  }

  async deleteFile(filePath: string): Promise<DeleteFileResponse> {
    const file = await this.getFileByPath(filePath);
    if (!file) {
      throw new Error(`File not found: ${filePath}`);
    }

    await this.drive.files.delete({
      fileId: file.id,
    });

    return {
      id: file.id,
      name: file.name,
      path_display: filePath,
    };
  }

  // async searchFolders(query: string): Promise<FolderMetadata[]> {
  //   const response = await this.drive.files.list({
  //     q: `name contains '${query}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
  //     fields: "files(id,name,parents)",
  //     pageSize: 20,
  //   });

  //   const folders: FolderMetadata[] = (response.data.files || []).map(
  //     (file) => ({
  //       id: file.id!,
  //       name: file.name!,
  //       path:
  //         file.parents && file.parents.length > 0
  //           ? `/${file.parents[0]}/${file.name}`
  //           : `/${file.name}`,
  //       isFolder: true,
  //       ".tag": "folder",
  //     }),
  //   );

  //   return folders;
  // }

  async searchFolders(query: string): Promise<FolderMetadata[]> {
    // 1. Search for folders by name
    const response = await this.drive.files.list({
      q: `name contains '${query}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id,name,parents)",
      pageSize: 20,
    });

    // 2. Map results, resolving the path for each folder individually
    const foldersPromises = (response.data.files || []).map(async (file) => {
      // Call our new helper to get the full "Name/Path" instead of "ID/Path"
      const fullPath = await this.getPathById(file.id!);

      return {
        id: file.id!,
        name: file.name!,
        path: fullPath,
        isFolder: true,
        ".tag": "folder",
      } as FolderMetadata;
    });

    return Promise.all(foldersPromises);
  }

  async uploadFile(
    fileData: ArrayBuffer | Uint8Array,
    fileName: string,
    parentPath: string = "",
    mimeType: string = "application/octet-stream",
  ): Promise<UploadFileResponse> {
    let parentFolderId: string;

    if (parentPath === "" || parentPath === "/") {
      parentFolderId = "root";
    } else {
      const parentFolder = await this.getFolderByPath(parentPath);
      if (!parentFolder) {
        throw new Error(`Parent folder not found: ${parentPath}`);
      }
      parentFolderId = parentFolder.id;
    }

    // Convert ArrayBuffer/Uint8Array to Buffer for Google Drive API
    const buffer =
      fileData instanceof ArrayBuffer
        ? Buffer.from(fileData)
        : Buffer.from(
            fileData.buffer,
            fileData.byteOffset,
            fileData.byteLength,
          );

    // Create a readable stream from the buffer
    const { Readable } = await import("stream");
    const stream = new Readable();
    stream._read = () => {}; // _read is required but no-op
    stream.push(buffer);
    stream.push(null);

    const response = await this.drive.files.create({
      requestBody: {
        name: fileName,
        mimeType,
        parents:
          parentPath === "" || parentPath === "/"
            ? undefined
            : [parentFolderId],
      },
      media: {
        mimeType,
        body: stream, // Use readable stream instead of buffer
      },
      fields: "id,name,size",
    });

    const file = response.data;
    const fullPath = `${parentPath === "/" ? "" : parentPath}/${fileName}`;

    return {
      id: file.id!,
      name: file.name!,
      path_display: fullPath,
      size: file.size || undefined,
    };
  }

  private async getFolderByPath(path: string): Promise<FolderMetadata | null> {
    if (!path || path === "/" || path === "") {
      return {
        id: "root",
        name: "My Drive",
        path: "/",
        isFolder: true,
        ".tag": "folder",
      };
    }

    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) {
      return {
        id: "root",
        name: "My Drive",
        path: "/",
        isFolder: true,
        ".tag": "folder",
      };
    }

    let currentId = "root";
    let currentPath = "";

    for (const part of parts) {
      currentPath = `${currentPath}/${part}`;

      const response = await this.drive.files.list({
        q: `'${currentId}' in parents and name='${part}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id,name)",
        pageSize: 1,
      });

      const files = response.data.files;
      if (!files || files.length === 0) {
        return null;
      }

      currentId = files[0]?.id || "";
      if (!currentId) {
        return null;
      }
    }

    return {
      id: currentId,
      name: parts[parts.length - 1] || "",
      path,
      isFolder: true,
      ".tag": "folder",
    };
  }

  async renameFolder(
    folderPath: string,
    newName: string,
  ): Promise<RenameFolderResponse> {
    const folder = await this.getFolderByPath(folderPath);
    if (!folder) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    const response = await this.drive.files.update({
      fileId: folder.id,
      requestBody: {
        name: newName,
      },
      fields: "id,name",
    });

    const updatedFolder = response.data;
    const parts = folderPath.split("/").filter(Boolean);
    parts.pop(); // Remove old name
    parts.push(newName); // Add new name
    const newPath = "/" + parts.join("/");

    return {
      id: updatedFolder.id!,
      name: updatedFolder.name!,
      path_display: newPath,
    };
  }

  async renameFile(
    filePath: string,
    newName: string,
  ): Promise<RenameFileResponse> {
    const file = await this.getFileByPath(filePath);
    if (!file) {
      throw new Error(`File not found: ${filePath}`);
    }

    const response = await this.drive.files.update({
      fileId: file.id,
      requestBody: {
        name: newName,
      },
      fields: "id,name",
    });

    const updatedFile = response.data;
    const parts = filePath.split("/").filter(Boolean);
    parts.pop(); // Remove old name
    parts.push(newName); // Add new name
    const newPath = "/" + parts.join("/");

    return {
      id: updatedFile.id!,
      name: updatedFile.name!,
      path_display: newPath,
    };
  }

  async moveItem(
    fromPath: string,
    toPath: string,
    itemType: "file" | "folder",
  ): Promise<void> {
    // Get the source item (file or folder)
    const sourceItem =
      itemType === "folder"
        ? await this.getFolderByPath(fromPath)
        : await this.getFileByPath(fromPath);

    if (!sourceItem) {
      throw new Error(`${itemType} not found: ${fromPath}`);
    }

    // Get the destination folder
    const toPathParts = toPath.split("/").filter(Boolean);
    const itemName = toPathParts.pop() || sourceItem.name; // Get new name if specified, otherwise keep original
    const destinationFolderPath = "/" + toPathParts.join("/");

    let destinationFolderId = "root";
    if (destinationFolderPath !== "/" && destinationFolderPath !== "") {
      const destinationFolder = await this.getFolderByPath(
        destinationFolderPath,
      );
      if (!destinationFolder) {
        throw new Error(
          `Destination folder not found: ${destinationFolderPath}`,
        );
      }
      destinationFolderId = destinationFolder.id;
    }

    // Extract current parent folders
    const fromPathParts = fromPath.split("/").filter(Boolean);
    const sourceName = fromPathParts.pop() || sourceItem.name;
    const sourceParentPath = "/" + fromPathParts.join("/");

    let sourceParentId = "root";
    if (sourceParentPath !== "/" && sourceParentPath !== "") {
      const sourceParentFolder = await this.getFolderByPath(sourceParentPath);
      if (!sourceParentFolder) {
        throw new Error(`Source parent folder not found: ${sourceParentPath}`);
      }
      sourceParentId = sourceParentFolder.id;
    }

    // Move the item by updating parents and optionally the name
    const updateParams: any = {
      fileId: sourceItem.id,
      fields: "id,name,parents",
    };

    if (itemName !== sourceItem.name) {
      updateParams.requestBody = { name: itemName };
    }

    if (destinationFolderId !== "root") {
      updateParams.addParents = [destinationFolderId];
    }

    if (sourceParentId !== "root") {
      updateParams.removeParents = [sourceParentId];
    }

    await this.drive.files.update(updateParams);
  }

  private async getFileByPath(path: string): Promise<FolderMetadata | null> {
    if (!path || path === "/" || path === "") {
      throw new Error("Invalid file path");
    }

    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) {
      throw new Error("Invalid file path");
    }

    const fileName = parts[parts.length - 1];
    const parentPath = "/" + parts.slice(0, -1).join("/");

    let parentFolderId = "root";

    // Get parent folder ID if not root
    if (parts.length > 1) {
      const parentFolder = await this.getFolderByPath(parentPath);
      if (!parentFolder) {
        return null;
      }
      parentFolderId = parentFolder.id;
    }

    // Search for file in parent folder
    const response = await this.drive.files.list({
      q: `'${parentFolderId}' in parents and name='${fileName}' and mimeType!='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id,name,size)",
      pageSize: 1,
    });

    const files = response.data.files;
    if (!files || files.length === 0) {
      return null;
    }

    const file = files[0];
    if (!file) {
      return null;
    }

    return {
      id: file.id!,
      name: file.name!,
      path,
      size: file.size?.toString() || null,
      isFolder: false,
      ".tag": "file",
    };
  }

  // Helper to recursively copy folder contents
  private async copyFolderRecursively(
    sourceFolderId: string,
    targetParentId: string,
  ): Promise<void> {
    const response = await this.drive.files.list({
      q: `'${sourceFolderId}' in parents and trashed=false`,
      fields: "files(id,name,mimeType)",
      pageSize: 1000, // Large page size for efficiency
    });

    const files = response.data.files || [];

    for (const file of files) {
      if (!file.id || !file.name) continue;

      if (file.mimeType === "application/vnd.google-apps.folder") {
        // Create new subfolder
        const newFolder = await this.drive.files.create({
          requestBody: {
            name: file.name,
            mimeType: file.mimeType,
            parents: [targetParentId],
          },
          fields: "id",
        });

        // Recursively copy contents
        if (newFolder.data.id) {
          await this.copyFolderRecursively(file.id, newFolder.data.id);
        }
      } else {
        // Copy file
        // FIX: Parents must be inside requestBody
        try {
          await this.drive.files.copy({
            fileId: file.id,
            requestBody: {
              parents: [targetParentId],
            },
          });
        } catch (error) {
          console.error(`Failed to copy file ${file.name}:`, error);
          throw error;
        }
      }
    }
  }

  // Add this private helper method to GoogleDriveClient class
  private async getPathById(fileId: string): Promise<string> {
    if (fileId === "root") return "/";

    const pathSegments: string[] = [];
    let currentId = fileId;
    let safetyCounter = 0;

    while (safetyCounter < 50) {
      try {
        // 1. Fetch the file details
        const file = await this.drive.files.get({
          fileId: currentId,
          fields: "id, name, parents",
        });

        if (!file.data.name) break;

        // 2. STOP CONDITIONS:
        // Stop if:
        // a) The ID is explicitly "root"
        // b) The folder has no parents (it is the top-most folder)
        // c) The name is "My Drive" (this catches cases where the ID isn't "root")
        if (
          currentId === "root" ||
          !file.data.parents ||
          file.data.parents.length === 0 ||
          file.data.name.toLowerCase() === "my drive"
        ) {
          break; // Stop loop immediately without adding this name
        }

        // 3. Add the folder name (since we didn't stop above)
        pathSegments.unshift(file.data.name);

        // 4. Move up to parent
        currentId = file.data.parents[0]!;
      } catch (error) {
        console.error(`Error resolving path for ID ${currentId}:`, error);
        break;
      }

      safetyCounter++;
    }

    // Construct the final path
    return pathSegments.length > 0 ? "/" + pathSegments.join("/") : "/";
  }
  async copyItem(
    fromPath: string,
    toPath: string,
    itemType: "file" | "folder",
  ): Promise<CreateFolderResponse | UploadFileResponse> {
    // Get the source item (file or folder)
    const sourceItem =
      itemType === "folder"
        ? await this.getFolderByPath(fromPath)
        : await this.getFileByPath(fromPath);

    if (!sourceItem) {
      throw new Error(`${itemType} not found: ${fromPath}`);
    }

    // Extract destination folder path and new name
    const pathParts = toPath.split("/").filter(Boolean);
    const newName = pathParts.pop() || sourceItem.name;
    const destPath = "/" + pathParts.join("/");

    // Get destination folder ID
    let destFolderId = "root";
    if (pathParts.length > 0) {
      const destFolder = await this.getFolderByPath(destPath);
      if (!destFolder) {
        throw new Error(`Destination folder not found: ${destPath}`);
      }
      destFolderId = destFolder.id;
    }

    const fullPath = `${destPath === "/" ? "" : destPath}/${newName}`;

    try {
      if (itemType === "folder") {
        // Google Drive API does not support copying folders directly.
        // We must create a new folder and recursively copy its contents.

        // 1. Create the new folder
        const response = await this.drive.files.create({
          requestBody: {
            name: newName,
            mimeType: "application/vnd.google-apps.folder",
            // Note: For create(), omitting parents defaults to root.
            parents: destFolderId === "root" ? undefined : [destFolderId],
          },
          fields: "id,name",
        });

        const newFolderId = response.data.id;
        if (!newFolderId) {
          throw new Error("Failed to create new folder");
        }

        // 2. Recursively copy contents
        await this.copyFolderRecursively(sourceItem.id, newFolderId);

        return {
          id: newFolderId,
          name: newName,
          path_display: fullPath,
        } as CreateFolderResponse;
      } else {
        // Use Google Drive files.copy API for files
        const response = await this.drive.files.copy({
          fileId: sourceItem.id,
          requestBody: {
            name: newName,
            // Note: For copy(), omitting parents keeps it in the SOURCE folder.
            // We must explicitly set empty array [] to move to root.
            parents: destFolderId === "root" ? [] : [destFolderId],
          },
          fields: "id,name,size",
        });

        const copiedFile = response.data;
        if (!copiedFile.id) {
          throw new Error("Failed to copy file: No ID returned");
        }

        return {
          id: copiedFile.id,
          name: copiedFile.name!,
          path_display: fullPath,
          size: copiedFile.size?.toString() || "0",
        } as UploadFileResponse;
      }
    } catch (error) {
      console.error("Google Drive copy error:", error);
      throw new Error(
        `Failed to copy ${itemType}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  // Google Drive sharing functionality
  async createShareLink(
    fileId: string,
    role: "reader" | "commenter" | "writer" = "reader",
  ): Promise<{ url: string; id: string }> {
    try {
      // First create permission for anyone with the link
      const permissionResponse = await this.drive.permissions.create({
        fileId,
        requestBody: {
          role: role,
          type: "anyone",
        },
        fields: "id",
      });

      const permissionId = permissionResponse.data.id;
      if (!permissionId) {
        throw new Error("Failed to create permission");
      }

      // Get the file to generate the shareable link
      const fileResponse = await this.drive.files.get({
        fileId,
        fields: "webViewLink",
      });

      const webViewLink = fileResponse.data.webViewLink;
      if (!webViewLink) {
        throw new Error("Failed to get web view link");
      }

      return {
        url: webViewLink,
        id: permissionId,
      };
    } catch (error) {
      console.error("Error creating share link:", error);
      throw new Error(
        `Failed to create share link: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async shareWithUser(
    fileId: string,
    email: string,
    role: "reader" | "commenter" | "writer" = "reader",
  ): Promise<{ id: string; email: string; role: string }> {
    try {
      const permissionResponse = await this.drive.permissions.create({
        fileId,
        requestBody: {
          type: "user",
          role: role,
          emailAddress: email,
        },
        fields: "id,emailAddress,role",
      });

      const permission = permissionResponse.data;
      if (!permission.id) {
        throw new Error("Failed to share with user");
      }

      return {
        id: permission.id,
        email: permission.emailAddress || email,
        role: permission.role || role,
      };
    } catch (error) {
      console.error("Error sharing with user:", error);
      throw new Error(
        `Failed to share with user: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async removePermission(fileId: string, permissionId: string): Promise<void> {
    try {
      await this.drive.permissions.delete({
        fileId,
        permissionId,
      });
    } catch (error) {
      console.error("Error removing permission:", error);
      throw new Error(
        `Failed to remove permission: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async listPermissions(
    fileId: string,
  ): Promise<
    Array<{
      id: string;
      email?: string;
      role: string;
      type: string;
      displayName?: string;
    }>
  > {
    try {
      const response = await this.drive.permissions.list({
        fileId,
        fields: "permissions(id,emailAddress,role,type,displayName)",
      });

      return (response.data.permissions || []).map((permission) => ({
        id: permission.id!,
        email: permission.emailAddress || undefined,
        role: permission.role || "reader",
        type: permission.type || "user",
        displayName: permission.displayName || undefined,
      }));
    } catch (error) {
      console.error("Error listing permissions:", error);
      throw new Error(
        `Failed to list permissions: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async getResumableUploadUrl(
    fileName: string,
    parentPath: string = "",
    mimeType: string = "application/octet-stream",
    origin?: string,
  ): Promise<{ uploadUrl: string; fileId: string }> {
    let parentFolderId: string;

    if (parentPath === "" || parentPath === "/") {
      parentFolderId = "root";
    } else {
      const parentFolder = await this.getFolderByPath(parentPath);
      if (!parentFolder) {
        throw new Error(`Parent folder not found: ${parentPath}`);
      }
      parentFolderId = parentFolder.id;
    }

    // Get the access token to authorize the request
    const { token } = await this.oauth2Client.getAccessToken();
    if (!token) {
      throw new Error("Failed to retrieve access token");
    }

    // Build headers object
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
    };

    // Include Origin header if provided
    if (origin) {
      headers["Origin"] = origin;
    }

    // We use fetch directly here to get the 'Location' header which contains the resumable URL.
    const initiateResponse = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: fileName,
          mimeType: mimeType,
          parents: [parentFolderId],
        }),
      },
    );

    if (!initiateResponse.ok) {
      const errorText = await initiateResponse.text();
      throw new Error(
        `Failed to initiate upload: ${initiateResponse.status} ${errorText}`,
      );
    }

    const uploadUrl = initiateResponse.headers.get("Location");
    if (!uploadUrl) {
      throw new Error("Upload URL not found in response headers");
    }

    return { uploadUrl, fileId: "" };
  }
}
