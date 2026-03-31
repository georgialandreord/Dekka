import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import toast from "react-hot-toast";
import JSZip from "jszip";
import {
  guessMimeFromName,
  guessSvgMimeFromName,
  hasAllowedExtension,
  hasAllowedSvgExtension,
  isAllowedMimeType,
  isAllowedSvgMimeType,
} from "~/helpers";
import { initializeModel, processImage } from "~/lib/bg-remove";
import { api } from "~/trpc/react";
import { PACK_NAME, THEMES_DATA } from "~/mockdata";
import { Switch } from "~/components/ui/switch";
import DropZone from "~/components/sandbox/uploadStickers/drop-zone";
import PatternDropZone from "~/components/sandbox/uploadPatterns/drop-zone";
import PhotoPreviewGrid from "~/components/sandbox/uploadStickers/photo-preview-grid";
import PatternPhotoPreviewGrid from "~/components/sandbox/uploadPatterns/photo-preview-grid";
import PhotoLibrary from "~/components/sandbox/uploadStickers/photo-library";
import type { PhotoPreview } from "~/components/sandbox/uploadPatterns/photo-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Upload() {
  const utils = api.useUtils();
  const UploadStickerMutation =
    api.cloudnary.getUploadStickerPresignedUrl.useMutation();
  const UploadBacgroundPatternMutation =
    api.cloudnary.getUploadBackgroundPatternPresignedUrl.useMutation();
  const createStickerMutation =
    api.sticker.createStickerWithItems.useMutation();
  const createPatternMutation =
    api.backgroundPattern.createBackgroundPattern.useMutation();
  const { data: stickers, isPending: isStickerLoading } =
    api.sticker.getAllStickers.useQuery();
  const { data: patterns, isPending: isPatternsLoading } =
    api.backgroundPattern.getAllPatterns.useQuery();

  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPatternPreview, setShowPatternPreview] = useState(false);
  const [previewPhotos, setPreviewPhotos] = useState<PhotoPreview[]>([]);
  const [previewPatternPhotos, setPreviewPatternPhotos] = useState<PhotoPreview[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [showStickerPackDialog, setShowStickerPackDialog] = useState(false);

  // Main Form Data
  const [stickerPackForm, setStickerPackForm] = useState({
    packName: "",
    theme: "",
  });

  // Temporary states for Custom Input UI
  const [newTheme, setNewTheme] = useState("");
  const [showNewThemeInput, setShowNewThemeInput] = useState(false);
  const [newPackName, setNewPackName] = useState("");
  const [showNewPackNameInput, setShowNewPackNameInput] = useState(false);

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

  const handleSvgSelected = useCallback(
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
              if (!hasAllowedSvgExtension(entry.name)) {
                invalidFiles.push(entry.name);
              } else {
                const blob = await entry.async("blob");
                const mime = guessSvgMimeFromName(entry.name);
                validFiles.push(new File([blob], entry.name, { type: mime }));
              }
            }
          } else {
            const isValid =
              isAllowedSvgMimeType(file.type) ||
              hasAllowedSvgExtension(file.name);
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
          backgroundSize: 100,
        }));

        if (photos.length === 0) {
          toast("No valid files found");
        } else {
          setPreviewPatternPhotos(photos);
          setShowPatternPreview(true);
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

  const handlePatternRemovePhoto = (id: string) => {
    setPreviewPatternPhotos((prev) => prev.filter((p) => p.id !== id));
    if (previewPatternPhotos.length <= 1) {
      setShowPatternPreview(false);
    }
  };

  const handleSizeChange = (id: string, size: number) => {
    setPreviewPatternPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, backgroundSize: size } : p)),
    );
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

    const { params, signature, uploadUrl } =
      await UploadStickerMutation.mutateAsync({
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
    };
  };

  // Pattern upload helper function
  const uploadPatternFile = async (file: File, fileName: string) => {
    const fileType = file.type || guessSvgMimeFromName(fileName);

    const { params, signature, uploadUrl } =
      await UploadBacgroundPatternMutation.mutateAsync({
        fileName,
        fileType,
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
      publicId: result?.public_id,
    };
  };

  // FIX 2: Orchestrate the uploads and then save ONCE
  const handleCreateStickerPack = async (stickerData: {
    packName: string;
    theme: string;
  }) => {
    setIsUploading(true);

    try {
      // Step A: Upload all images to Cloudinary
      const uploadPromises = previewPhotos.map((photo) => {
        const fileToUpload = photo.isBgRemoved
          ? photo.processedFile
          : photo.originalFile;
        const fileName = photo.fileName.replace(/\.[^/.]+$/, "") + ".png";

        if (!fileToUpload) {
          return Promise.reject(
            new Error(`No file to upload for ${photo.fileName}`),
          );
        }

        // Call upload helper
        return uploadFile(fileToUpload, fileName);
      });

      const uploadResults = await Promise.allSettled(uploadPromises);
      const failed = uploadResults.filter((r) => r.status === "rejected");

      if (failed.length > 0) {
        toast.error(`${failed.length} sticker(s) failed to upload`);
        setIsUploading(false);
        return;
      }

      // Step B: Collect all successful uploads into a single array
      const successfulUploads = uploadResults.filter(
        (r) => r.status === "fulfilled",
      ) as PromiseFulfilledResult<{ name: string; url: string }>[];

      const stickerItems: { name: string; url: string }[] = [];

      successfulUploads.forEach((result) => {
        if (result.value?.url && result.value?.name) {
          stickerItems.push({
            name: result.value.name,
            url: result.value.url,
          });
        }
      });

      // Step C: Create the Sticker Pack ONCE with ALL items
      await createStickerMutation.mutateAsync({
        name: stickerData.packName,
        theme: stickerData.theme,
        description: "",
        isFree: true,
        artistName: "",
        price: 0,
        stickerItems: stickerItems,
      });

      toast.success(
        `Successfully created sticker pack: ${stickerData.packName}`,
      );
      setPreviewPhotos([]);
      setShowPreview(false);
      setShowStickerPackDialog(false);

      // Invalidate sticker queries
      utils.sticker.getAllStickers.invalidate();
    } catch (error) {
      console.error("Failed to create sticker pack:", error);
      toast.error("Failed to create sticker pack");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreatePattern = async () => {
    setIsUploading(true);

    try {
      // Step A: Upload all pattern files to Cloudinary
      const uploadPromises = previewPatternPhotos.map((photo) => {
        const fileToUpload = photo.originalFile;
        const fileName = photo.fileName;

        if (!fileToUpload) {
          return Promise.reject(
            new Error(`No file to upload for ${photo.fileName}`),
          );
        }

        // Call pattern upload helper
        return uploadPatternFile(fileToUpload, fileName);
      });

      const uploadResults = await Promise.allSettled(uploadPromises);
      const failed = uploadResults.filter((r) => r.status === "rejected");

      if (failed.length > 0) {
        toast.error(`${failed.length} pattern(s) failed to upload`);
        setIsUploading(false);
        return;
      }

      // Step B: Create pattern records in database
      const successfulUploads = uploadResults.filter(
        (r) => r.status === "fulfilled",
      ) as PromiseFulfilledResult<{
        name: string;
        url: string;
        publicId?: string;
      }>[];

      const patternPromises = successfulUploads.map((result, index) => {
        if (result.value?.url && result.value?.name) {
          const photo = previewPatternPhotos[index];
          if (!photo) return Promise.reject(new Error("Photo not found"));
          return createPatternMutation.mutateAsync({
            filename: result.value.name,
            fileUrl: result.value.url,
            publicId: result.value.publicId,
            size: photo.backgroundSize || 100,
          });
        }
        return Promise.reject(new Error("Invalid upload result"));
      });

      await Promise.all(patternPromises);

      toast.success("Successfully uploaded background patterns");
      setPreviewPatternPhotos([]);
      setShowPatternPreview(false);

      // Invalidate pattern queries
      utils.backgroundPattern.getAllPatterns.invalidate();
    } catch (error) {
      console.error("Failed to create patterns:", error);
      toast.error("Failed to upload patterns");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewPhotos([]);
    setShowPreview(false);
  };

  const handlePatternCancel = () => {
    setPreviewPatternPhotos([]);
    setShowPatternPreview(false);
  };

  const handleOpenStickerPackDialog = () => {
    // Reset temp input states when opening
    setNewPackName("");
    setShowNewPackNameInput(false);
    setNewTheme("");
    setShowNewThemeInput(false);
    setShowStickerPackDialog(true);
  };

  const handleCloseStickerPackDialog = () => {
    setShowStickerPackDialog(false);
    setStickerPackForm({
      packName: "",
      theme: "",
    });
    // Reset temp input states when closing
    setNewPackName("");
    setShowNewPackNameInput(false);
    setNewTheme("");
    setShowNewThemeInput(false);
  };

  const handleSubmitStickerPack = async () => {
    await handleCreateStickerPack(stickerPackForm);
    // Dialog is now closed inside handleCreateStickerPack upon success
  };

  const handlePhotoClick = (photo: {
    id: string;
    fileName: string;
    fileUrl: string;
  }) => {
    toast(`Sticker selected: ${photo.fileName}`);
  };

  const deletePhotosMutation = api.sticker.deleteStickers.useMutation(
    {
      onSuccess: (data) => {
        toast.success("Photos deleted successfully");
        utils.sticker.getAllStickers.invalidate();
      },
      onError: (error) => {
        toast.error("Failed to delete photos");
      },
    }
  );

  const deletePatternsMutation = api.backgroundPattern.deleteBackgroundPattern.useMutation(
    {
      onSuccess: (data) => {
        toast.success("Patterns deleted successfully");
        utils.backgroundPattern.getAllPatterns.invalidate();
      },
      onError: (error) => {
        toast.error("Failed to delete patterns");
      },
    }
  );

  const handleDeletePatterns = async (ids: string[]) => {
    return await deletePatternsMutation.mutateAsync({
      ids: ids,
    });
  };

  const handleDeletePhotos = async (ids: string[]) => {
      return await deletePhotosMutation.mutateAsync({
        ids: ids,
      });
  };


  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-border/50 sticky top-4 left-3 z-10 w-fit rounded-2xl border-b bg-white">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="upload stickers">
          <TabsList className="mb-3">
            <TabsTrigger value="upload stickers" className="cursor-pointer">
              Upload Sticker
            </TabsTrigger>
            <TabsTrigger value="upload patters" className="cursor-pointer">
              Upload Patterns
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload stickers">
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
                      onCreateStickerPack={handleOpenStickerPackDialog}
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
                      stickers?.flatMap((sticker) =>
                        sticker.stickers.map((item) => ({
                          id: item.id,
                          fileName: item.name,
                          fileUrl: item.url,
                          thumbnailUrl: item.url,
                        })),
                      ) ?? []
                    }
                    isLoading={isStickerLoading}
                    onPhotoClick={handlePhotoClick}
                    isDownloadzip={true}
                    deletePhotos={handleDeletePhotos}
                    isDeleting={deletePhotosMutation.isPending}
                  />
                </motion.section>
              )}
            </div>
          </TabsContent>
          <TabsContent value="upload patters">
            <div className="space-y-8">
              {/* Upload section */}
              <AnimatePresence mode="wait">
                {!showPatternPreview ? (
                  <motion.section
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <PatternDropZone
                      onFilesSelected={handleSvgSelected}
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
                    <PatternPhotoPreviewGrid
                      photos={previewPatternPhotos}
                      onRemovePhoto={handlePatternRemovePhoto}
                      onSizeChange={handleSizeChange}
                      onCancel={handlePatternCancel}
                      onCreatePattern={handleCreatePattern}
                      isUploading={isUploading}
                      isModelLoading={isModelLoading}
                    />
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Library section */}
              {!showPatternPreview && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass border-primary/50 bg-card rounded-3xl border p-6"
                >
                  <PhotoLibrary
                    photos={
                      patterns?.map((pattern) => ({
                        id: pattern.id,
                        fileName: pattern.filename,
                        fileUrl: pattern.fileUrl,
                        thumbnailUrl: pattern.fileUrl,
                      })) ?? []
                    }
                    isLoading={isPatternsLoading}
                    onPhotoClick={(photo) =>
                      toast(`Pattern selected: ${photo.fileName}`)
                    }
                    isDownloadzip={true}
                    deletePhotos={handleDeletePatterns}
                    isDeleting={deletePatternsMutation.isPending}
                  />
                </motion.section>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Sticker Pack Dialog */}
      <Dialog
        open={showStickerPackDialog}
        onOpenChange={setShowStickerPackDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Create Sticker Pack
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Pack Name Section - Updated with Custom Input Logic */}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Pack Name *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Custom</span>
                  <Switch
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-accent-foreground/50"
                    checked={showNewPackNameInput}
                    onCheckedChange={(checked) => {
                      setShowNewPackNameInput(checked);
                      if (!checked) {
                        setNewPackName("");
                        setStickerPackForm((prev) => ({
                          ...prev,
                          packName: "",
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showNewPackNameInput ? (
                  <motion.div
                    key="custom-pack"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Input
                      placeholder="Enter custom pack name..."
                      value={newPackName}
                      onChange={(e) => {
                        setNewPackName(e.target.value);
                        setStickerPackForm((prev) => ({
                          ...prev,
                          packName: e.target.value,
                        }));
                      }}
                      className="h-11"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="select-pack"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Select
                      value={stickerPackForm.packName}
                      onValueChange={(value) =>
                        setStickerPackForm((prev) => ({
                          ...prev,
                          packName: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select pack name" />
                      </SelectTrigger>
                      <SelectContent>
                        {PACK_NAME.map((pack_name) => (
                          <SelectItem value={pack_name.id} key={pack_name.id}>
                            {pack_name.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Section - Logic remains the same */}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Theme</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">Custom</span>
                  <Switch
                    checked={showNewThemeInput}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-accent-foreground/50"
                    onCheckedChange={(checked) => {
                      setShowNewThemeInput(checked);
                      if (!checked) {
                        setNewTheme("");
                        setStickerPackForm((prev) => ({
                          ...prev,
                          theme: "",
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {showNewThemeInput ? (
                  <motion.div
                    key="custom-theme"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Input
                      placeholder="Enter custom theme..."
                      value={newTheme}
                      onChange={(e) => {
                        setNewTheme(e.target.value);
                        setStickerPackForm((prev) => ({
                          ...prev,
                          theme: e.target.value,
                        }));
                      }}
                      className="h-11"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="select-theme"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Select
                      value={stickerPackForm.theme}
                      onValueChange={(value) =>
                        setStickerPackForm((prev) => ({
                          ...prev,
                          theme: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {THEMES_DATA.map((theme) => (
                          <SelectItem value={theme.id} key={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseStickerPackDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitStickerPack}
              disabled={!stickerPackForm.packName}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Pack</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
