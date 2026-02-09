import React, { useState, useRef } from "react";
import { useParams } from "react-router";
import { Upload, X, File as FileIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { Dropbox } from "dropbox";
import { authClient } from "~/server/better-auth/client";
import axios from "axios";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  name: string;
  size: number;
  type: string;
  progress?: number;
}

interface UploadFileDialogProps {
  open: boolean;
  onClose: () => void;
}

const UploadFileDialog = ({ open, onClose }: UploadFileDialogProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadingFileId, setCurrentUploadingFileId] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current path from URL params
  const params = useParams();
  const currentPath = params["*"] || "";

  const utils = api.useUtils();
  const getGDriveUrlMutation = api.folder.getGDriveUploadUrl.useMutation();
  const { data: activePlatform, isPending: activeLoading } =
    api.settings.getActivePlatform.useQuery();
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newFiles: UploadedFile[] = files.map((file) => {
      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;

      return {
        id: crypto.randomUUID(),
        file,
        preview,
        name: file.name,
        size: file.size,
        type: file.type,
      };
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const uploadToDropbox = async (uploadedFile: UploadedFile) => {
  const token = authClient.getAccessToken({ providerId: "dropbox" });
  const accessToken = (await token).data?.accessToken;
  if (!accessToken) {
    throw new Error("Dropbox Access Token not found in session");
  }

  const dbx = new Dropbox({ accessToken });

  let fullPath = currentPath;
  if (!fullPath.startsWith("/")) {
    fullPath = "/" + fullPath;
  }
  if (fullPath !== "/" && !fullPath.endsWith("/")) {
    fullPath = fullPath + "/";
  }
  fullPath = fullPath + uploadedFile.name;

  setCurrentUploadingFileId(uploadedFile.id);

  const updateProgress = (progress: number) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === uploadedFile.id ? { ...f, progress } : f)),
    );
  };

  const MAX_SIMPLE_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB
  const chunkSize = 4 * 1024 * 1024; // 4MB exactly

  try {
    if (uploadedFile.file.size <= MAX_SIMPLE_UPLOAD_SIZE) {
      // Simple upload for small files
      await dbx.filesUpload({
        path: fullPath,
        contents: uploadedFile.file,
        mode: { ".tag": "add" },
      });
      updateProgress(100);
      console.log("Dropbox simple upload successful");
      return;
    }

    // Session upload for large files (existing logic with fixed chunkSize)
    let offset = 0;
    const sessionStart = await dbx.filesUploadSessionStart({
      contents: uploadedFile.file.slice(0, chunkSize),
      close: false,
    });

    const sessionId = sessionStart.result.session_id;
    offset += chunkSize;
    updateProgress((offset / uploadedFile.file.size) * 100);

    while (offset < uploadedFile.file.size) {
      const chunk = uploadedFile.file.slice(offset, offset + chunkSize);
      const isLastChunk = offset + chunk.size >= uploadedFile.file.size;

      if (isLastChunk) {
        await dbx.filesUploadSessionFinish({
          cursor: { session_id: sessionId, offset },
          commit: { path: fullPath, mode: { ".tag": "add" } },
          contents: chunk,
        });
      } else {
        await dbx.filesUploadSessionAppendV2({
          cursor: { session_id: sessionId, offset },
          contents: chunk,
        });
      }

      offset += chunk.size;
      updateProgress((offset / uploadedFile.file.size) * 100);
    }

    console.log("Dropbox session upload successful");
  } catch (error) {
    console.error("Dropbox API Error:", error);
    throw error;
  } finally {
    setCurrentUploadingFileId(null);
  }
};


  const uploadToGDrive = async (uploadedFile: UploadedFile) => {
    try {
      
      
      // 1. Get the Resumable URL from backend
      const { uploadUrl } = await getGDriveUrlMutation.mutateAsync({
        fileName: uploadedFile.name,
        parentPath: currentPath,
        mimeType: uploadedFile.type || "application/octet-stream",
      });
      
      const updateProgress = (progress: number) => {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === uploadedFile.id ? { ...f, progress } : f)),
      );
    };
    
    // 2. Upload directly to Google Drive using the URL
    
    await axios.put(uploadUrl, uploadedFile.file, {
      headers:{
        "Content-Type": uploadedFile.type || "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || uploadedFile.file.size));
        updateProgress(progress);
      },
    })
    
    console.log("Google Drive upload successful");
  } catch (error) {
    console.log("Google Drive upload error:", error);
    throw error;
  } finally {
    setCurrentUploadingFileId(null);
  }
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsUploading(true);

    try {
      for (const uploadedFile of uploadedFiles) {
        if (activePlatform === "google_drive") {
          await uploadToGDrive(uploadedFile);
        } else {
          await uploadToDropbox(uploadedFile);
        }

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id ? { ...f, progress: undefined } : f,
          ),
        );
        toast.success(`${uploadedFile.name} uploaded successfully`);
      }

      // Refresh folder content
      utils.folder.getById.invalidate({ path: currentPath });
      utils.folder.getAll.invalidate();

      setUploadedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        `Failed to upload: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleClose = () => {
    // Clean up object URLs
    uploadedFiles.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });

    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl font-bold">
            Upload Files
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select Files</Label>
            <div className="border-border hover:border-primary rounded-lg border-2 border-dashed p-6 text-center transition-colors">
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
              <p className="text-muted-foreground mt-2 text-sm">
                or drag and drop files here
              </p>
            </div>
          </div>

          {/* Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Files to Upload ({uploadedFiles.length})</Label>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {uploadedFiles.map((uploadedFile) => (
                  <div
                    key={uploadedFile.id}
                    className="bg-muted flex flex-col gap-2 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex min-w-0 flex-1 items-center space-x-3">
                        {uploadedFile.preview ? (
                          <img
                            src={uploadedFile.preview}
                            alt={uploadedFile.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <FileIcon className="text-muted-foreground h-10 w-10" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {uploadedFile.name.slice(0, 30)}...
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadedFile.id)}
                        className="text-muted-foreground hover:text-destructive"
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {isUploading && uploadedFile.progress !== undefined && (
                      <div className="space-y-1">
                        <div className="bg-primary/20 h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="bg-primary h-full transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>
                        <p className="text-muted-foreground text-right text-xs">
                          {Math.round(uploadedFile.progress)}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || isUploading}
            className="bg-primary text-primary-foreground hover:bg-primary cursor-pointer"
          >
            {isUploading
              ? "Uploading..."
              : `Upload ${uploadedFiles.length} File${uploadedFiles.length !== 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileDialog;
