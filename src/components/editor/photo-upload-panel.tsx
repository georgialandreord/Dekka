import { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon, ArrowUpFromLine } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { DecorationInput } from "~/frontend/pages/foldereditor/folder-editor";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import JSZip from "jszip";
import {
  guessMimeFromName,
  hasAllowedExtension,
  isAllowedMimeType,
} from "~/helpers";
import PhotoPreviewDialog, { type PhotoPreview } from "./photo-preview-dialog";
import { initializeModel } from "~/lib/bg-remove";

type PhotoUploadPanelProps = {
  onAddPhoto: (decoration: DecorationInput) => void;
};

export default function PhotoUploadPanel({
  onAddPhoto,
}: PhotoUploadPanelProps) {
  const utils = api.useUtils();
  const userUploadStickerMutation =
    api.cloudnary.getUserUploadStickerPresignedUrl.useMutation();
  const saveUserUploadStickerMutation =
    api.user.saveUserUploadSticker.useMutation();
  const { data: uploadedPhotos, isPending } =
    api.user.getUserUploadStickers.useQuery();
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewPhotos, setPreviewPhotos] = useState<PhotoPreview[]>([]);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  // Preload background removal model on component mount
  useEffect(() => {
    const preloadModel = async () => {
      if (isModelReady) return;

      setIsLoadingModel(true);
      try {
        await initializeModel();
        setIsModelReady(true);
        console.log("Background removal model preloaded successfully");
      } catch (error) {
        console.error("Failed to preload model:", error);
      } finally {
        setIsLoadingModel(false);
      }
    };

    preloadModel();
  }, [isModelReady]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setIsUploading(true);

    try {
      // Validate all files and ZIP contents upfront
      const invalidFiles: string[] = [];
      const validFiles: File[] = [];

      for (const file of files) {
        if (!file) continue;

        const isZip =
          file.type === "application/zip" ||
          file.name.toLowerCase().endsWith(".zip");

        if (isZip) {
          const arrayBuffer = await file.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);
          const entries = Object.values(zip.files);

          for (const entry of entries) {
            if (entry.dir) continue;
            if (!hasAllowedExtension(entry.name)) {
              invalidFiles.push(entry.name);
            } else {
              const blob = await entry.async("blob");
              const mime = guessMimeFromName(entry.name);
              validFiles.push(new File([blob], entry.name, { type: mime }));
            }
          }
        } else {
          const isValid =
            isAllowedMimeType(file.type) || hasAllowedExtension(file.name);
          if (!isValid) {
            invalidFiles.push(file.name);
          } else {
            validFiles.push(file);
          }
        }
      }

      // If any file is invalid, show error and stop
      if (invalidFiles.length > 0) {
        toast.error(`Invalid file format: ${invalidFiles.join(", ")}`);
        setIsUploading(false);
        e.target.value = "";
        return;
      }

      // Create preview objects for valid files
      const photos: PhotoPreview[] = validFiles.map((file) => ({
        id: crypto.randomUUID(),
        originalFile: file,
        originalPreview: URL.createObjectURL(file),
        processedFile: null,
        processedPreview: null,
        isBgRemoved: false,
        isProcessing: false,
        fileName: file.name,
      }));

      setPreviewPhotos(photos);
      setShowPreviewDialog(true);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error processing files");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Clear input
    }
  };

  const handleConfirmUpload = async (photos: PhotoPreview[]) => {
    const uploadPromises = photos.map((photo) => {
      const fileToUpload = photo.isBgRemoved
        ? photo.processedFile
        : photo.originalFile;
      const fileName = photo.fileName.replace(/\.[^/.]+$/, "") + ".png";

      if (!fileToUpload) {
        return Promise.reject(
          new Error(`No file to upload for ${photo.fileName}`),
        );
      }

      return uploadFile(fileToUpload, fileName);
    });

    const results = await Promise.allSettled(uploadPromises);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      toast.error(`${failed.length} photo(s) failed to upload`);
    } else {
      toast.success(`Successfully uploaded ${results.length} photo(s)`);
    }
  };

  const uploadFile = async (file: File, fileName: string) => {
    const fileType = file.type || guessMimeFromName(fileName);

    const { params, signature, uploadUrl, publicId } =
      await userUploadStickerMutation.mutateAsync({
        fileName,
        fileType,
        isSample: false,
      });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", params.api_key);
    formData.append("folder", params.folder);
    formData.append("timestamp", params.timestamp.toString());
    formData.append("public_id", params.public_id);
    formData.append("signature", signature);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    await saveUserUploadStickerMutation.mutateAsync({
      fileUrl: result.secure_url,
      fileName,
      thumbnailUrl: result.thumbnail_url || result.secure_url,
      publicId: publicId,
      isSample: false,
    });

    utils.user.getUserUploadStickers.invalidate();
  };

  return (
    <div className="border-border bg-background/90 flex w-80 flex-col border-l backdrop-blur-lg">
      <div className="border-border border-b p-6">
        <h3 className="bg-primary flex items-center gap-2 bg-clip-text text-xl font-bold text-transparent">
          <ImageIcon className="text-primary h-5 w-5" />
          Photo Library
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          {uploadedPhotos?.length} photo
          {uploadedPhotos?.length !== 1 ? "s" : ""} in library
        </p>
      </div>

      <div className="border-border border-b p-6">
        <input
          type="file"
          multiple
          accept="image/*,.heic,.zip"
          onChange={handleFileUpload}
          className="hidden"
          id="photo-upload"
          disabled={isUploading}
        />
        <label htmlFor="photo-upload">
          <Button
            asChild
            disabled={isUploading}
            className="bg-primary text-primary-foreground hover:bg-primary-hover w-full cursor-pointer"
          >
            <div>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="mr-2 h-4 w-4" />
                  Upload to Library
                </>
              )}
            </div>
          </Button>
        </label>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Supports JPG, JPEG, PNG, WEBP, HEIC, ZIP
        </p>
        <p className="text-primary mt-1 text-center text-xs font-medium">
          Remove backgrounds before uploading!
        </p>
      </div>

      <ScrollArea className="flex-1 px-4">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : uploadedPhotos?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-accent mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <ImageIcon className="text-muted-foreground h-8 w-8" />
            </div>
            <p className="text-muted-foreground px-4 text-sm">
              Your photo library is empty. Upload photos to use across all your
              folders!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-6">
            {uploadedPhotos?.map((photo) => (
              <div
                key={photo.id}
                className="group bg-accent hover:ring-primary relative aspect-square overflow-hidden rounded-lg transition-all duration-200 hover:ring-2"
              >
                <img
                  src={photo.fileUrl}
                  alt={photo.fileName}
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.setData("imageUrl", photo.fileUrl);
                    e.dataTransfer.effectAllowed = "copy";
                  }}
                  onClick={() =>
                    onAddPhoto({
                      type: "photo",
                      content: photo.fileUrl,
                      width: 120,
                      height: 120,
                    })
                  }
                  className="h-full w-full cursor-grab object-cover transition-transform hover:scale-105 active:cursor-grabbing"
                />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <PhotoPreviewDialog
        open={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        photos={previewPhotos}
        onConfirm={handleConfirmUpload}
        isModelReady={isModelReady}
        isLoadingModel={isLoadingModel}
      />
    </div>
  );
}
