import { AnimatePresence, motion } from "framer-motion";
import JSZip from "jszip";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { PhotoPreview } from "~/components/editor/photo-preview-dialog";
import DropZone from "~/components/sandbox/uploadStickers/drop-zone";
import PhotoLibrary from "~/components/sandbox/uploadStickers/photo-library";
import PhotoPreviewGrid from "~/components/sandbox/uploadStickers/photo-preview-grid";
import {
  guessMimeFromName,
  hasAllowedExtension,
  isAllowedMimeType,
} from "~/helpers";
import { initializeModel, processImage } from "~/lib/bg-remove";
import { api } from "~/trpc/react";

const ArtistDashboard = () => {
  const utils = api.useUtils();
  const userUploadStickerMutation =
    api.cloudnary.getUserUploadStickerPresignedUrl.useMutation();
  const saveUserUploadStickerMutation =
    api.user.saveUserUploadSticker.useMutation();

  const { data: userUplaodImages, isLoading: isImagesLoading } =
    api.user.getUserUploadStickers.useQuery();

    const deletePhotosMutation = api.user.deleteStickers.useMutation({
      onSuccess: (data) => {
        toast.success("Photos deleted successfully");
        utils.user.getUserUploadStickers.invalidate();
      },
      onError: (error) => {
        toast.error("Failed to delete photos");
      },
    });

  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPhotos, setPreviewPhotos] = useState<PhotoPreview[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  // Preload background removal model on component mount
  useEffect(() => {
    const preloadModel = async () => {
      if (isModelReady) return;

      setIsModelLoading(true);
      try {
        await initializeModel();
        setIsModelReady(true);
        console.log("Background removal model preloaded successfully");
      } catch (error) {
        console.error("Failed to preload model:", error);
      } finally {
        setIsModelLoading(false);
      }
    };

    preloadModel();
  }, [isModelReady]);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
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

        if (photos.length === 0) {
          toast("No valid files found");
        } else {
          setPreviewPhotos(photos);
          setShowPreview(true);
        }
      } catch (error) {
        console.error("Error processing files:", error);
        toast.error("Error processing files");
      } finally {
        setIsUploading(false);
      }
    },
    [toast],
  );

  const handleRemovePhoto = (id: string) => {
    setPreviewPhotos((prev) => prev.filter((p) => p.id !== id));
    if (previewPhotos.length <= 1) {
      setShowPreview(false);
    }
  };

  const handleRemoveBg = async (id: string) => {
    if (!isModelReady) {
      toast.error("Background removal model not ready");
      return;
    }

    setPreviewPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isProcessing: true } : p)),
    );

    try {
      const photo = previewPhotos.find((p) => p.id === id);
      if (!photo) return;

      const processedFile = await processImage(photo.originalFile);
      const processedPreview = URL.createObjectURL(processedFile);

      setPreviewPhotos((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                processedFile,
                processedPreview,
                isProcessing: false,
                isBgRemoved: true,
              }
            : p,
        ),
      );
    } catch (error) {
      console.error("Failed to process image:", error);
      toast.error(
        `Failed to process ${previewPhotos.find((p) => p.id === id)?.fileName}`,
      );
      // Reset processing state
      setPreviewPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isProcessing: false } : p)),
      );
    }
  };

  const handleRemoveAllBg = async () => {
    if (!isModelReady) {
      toast.error("Background removal model not ready");
      return;
    }

    const photosToProcess = previewPhotos.filter(
      (photo) => !photo.isBgRemoved && !photo.isProcessing,
    );

    for (const photo of photosToProcess) {
      await handleRemoveBg(photo.id);
    }
  };

  // FIX 1: Modify uploadFile to ONLY upload to Cloudinary and return the data
  const uploadFile = async (file: File, fileName: string) => {
    const fileType = file.type || guessMimeFromName(fileName);

    const { params, signature, uploadUrl,publicId } =
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

    // Return the URL and filename to be collected later
    return {
      url: result?.secure_url,
      name: result?.original_filename || fileName,
      publicId: result?.public_id
    };
  };

  // Handle individual image uploads for artist dashboard
  const handleUploadImages = async () => {
    setIsUploading(true);

    try {
      // Upload all images to Cloudinary individually
      const uploadPromises = previewPhotos.map(async (photo) => {
        const fileToUpload = photo.isBgRemoved
          ? photo.processedFile
          : photo.originalFile;
        const fileName = photo.fileName.replace(/\.[^/.]+$/, "") + ".png";

        if (!fileToUpload) {
          throw new Error(`No file to upload for ${photo.fileName}`);
        }

        // Upload to Cloudinary
        const uploadResult = await uploadFile(fileToUpload, fileName);

        // Save to database
        await saveUserUploadStickerMutation.mutateAsync({
          fileUrl: uploadResult.url,
          fileName: uploadResult.name,
          thumbnailUrl: uploadResult.url,
          publicId: uploadResult.publicId,
          isSample: false,
        });

        return uploadResult;
      });

      const results = await Promise.allSettled(uploadPromises);
      const failed = results.filter((r) => r.status === "rejected");

      if (failed.length > 0) {
        toast.error(`${failed.length} image(s) failed to upload`);
      } else {
        toast.success(`Successfully uploaded ${results.length} image(s)`);
      }

      setPreviewPhotos([]);
      setShowPreview(false);

      // Invalidate user upload queries
      utils.user.getUserUploadStickers.invalidate();
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewPhotos([]);
    setShowPreview(false);
  };

  const handlePhotoClick = (photo: {
    id: string;
    fileName: string;
    fileUrl: string;
  }) => {
    toast(`Sticker selected: ${photo.fileName}`);
  };

  const handleDeletePhotos = async (ids: string[]) => {
    return await deletePhotosMutation.mutateAsync({
      ids: ids,
    });
};

  return (
    <>
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="bg-primary mb-2 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Artist Dashboard
          </h1>
        </div>
      </div>

      <div className="min-h-screen">
        {/* Main content */}
        <main>
          <div className="space-y-8">
            {/* Upload section */}
            <AnimatePresence mode="wait">
              {!showPreview ? (
                <motion.section
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <DropZone
                    onFilesSelected={handleFilesSelected}
                    isUploading={isUploading}
                  />
                </motion.section>
              ) : (
                <motion.section
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass border-primary rounded-3xl border p-6"
                >
                  <PhotoPreviewGrid
                    photos={previewPhotos}
                    onRemovePhoto={handleRemovePhoto}
                    onRemoveBg={handleRemoveBg}
                    onRemoveAllBg={handleRemoveAllBg}
                    onCancel={handleCancel}
                    onCreateStickerPack={handleUploadImages}
                    isUploading={isUploading}
                    isModelLoading={isModelLoading}
                  />
                </motion.section>
              )}
            </AnimatePresence>

            {/* Library section */}
            {!showPreview && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass border-primary/50 bg-card rounded-3xl border p-6"
              >
                <PhotoLibrary
                  photos={
                    userUplaodImages?.map((sticker) => ({
                      id: sticker.id,
                      fileName: sticker.fileName,
                      fileUrl: sticker.fileUrl,
                      thumbnailUrl: sticker.thumbnailUrl || sticker.fileUrl,
                    })) ?? []
                  }
                  isLoading={isImagesLoading}
                  onPhotoClick={handlePhotoClick}
                  isDownloadzip={true}
                  deletePhotos={handleDeletePhotos}
                  isDeleting={deletePhotosMutation.isPending}
                />
              </motion.section>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ArtistDashboard;
