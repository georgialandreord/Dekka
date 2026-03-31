import { motion } from "framer-motion";
import { Check, Download, Image, Loader2, Square, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import JSZip from "jszip";
import { api } from "~/trpc/react";

interface Photo {
  id: string;
  fileName: string;
  fileUrl: string;
  thumbnailUrl: string;
}

interface PhotoLibraryProps {
  photos: Photo[];
  isLoading: boolean;
  onPhotoClick?: (photo: Photo) => void;
  allowSelection?: boolean;
  isDownloadzip?: boolean;
  deletePhotos?: (ids: string[]) => Promise<{ count: number }>;
  isDeleting?: boolean;
}

export default function PhotoLibrary({
  photos,
  isLoading,
  onPhotoClick,
  allowSelection = true,
  isDownloadzip,
  deletePhotos,
  isDeleting
}: PhotoLibraryProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  const utils = api.useUtils();

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedPhotos(new Set(photos.map((photo) => photo.id)));
  };

  const clearSelection = () => {
    setSelectedPhotos(new Set());
  };

  const downloadSelectedPhotos = async () => {
    if (selectedPhotos.size === 0) {
      toast.error("No photos selected");
      return;
    }

    setIsDownloading(true);
    try {
      // 1. Find the photo objects that match the selected IDs
      // This ensures we use the latest data from the 'photos' prop
      const selectedPhotosData = photos.filter((photo) =>
        selectedPhotos.has(photo.id),
      );

      if (selectedPhotosData.length === 0) {
        toast.error("Selected photos not found in current list");
        setIsDownloading(false);
        return;
      }

      // Helper to ensure unique filenames in ZIP
      const getUniqueFilename = (fileName: string, existingNames: Set<string>) => {
        let name = fileName;
        let counter = 1;
        while (existingNames.has(name)) {
          const dotIndex = fileName.lastIndexOf('.');
          const baseName = dotIndex !== -1 ? fileName.substring(0, dotIndex) : fileName;
          const ext = dotIndex !== -1 ? fileName.substring(dotIndex) : '';
          name = `${baseName} (${counter})${ext}`;
          counter++;
        }
        existingNames.add(name);
        return name;
      };

      if (selectedPhotosData.length === 1) {
        // Download single photo directly
        const photo = selectedPhotosData[0];
        if (!photo) return
        try {
          const response = await fetch(photo.fileUrl);
          if (!response.ok) throw new Error("Failed to download");
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = photo.fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success(`Downloaded ${photo.fileName}`);
        } catch (err) {
          console.error(err);
          toast.error(`Failed to download ${photo.fileName}`);
        }
      } else {
        // Create ZIP for multiple photos
        const zip = new JSZip();
        const usedFilenames = new Set<string>();

        for (const photo of selectedPhotosData) {
          try {
            const response = await fetch(photo.fileUrl);
            if (!response.ok) throw new Error("Network response was not ok");
            const blob = await response.blob();

            // Handle filename collisions to prevent overwriting files inside the ZIP
            const uniqueFileName = getUniqueFilename(photo.fileName, usedFilenames);

            zip.file(uniqueFileName, blob);
          } catch (error) {
            console.error(`Failed to fetch ${photo.fileName}:`, error);
            toast.error(`Failed to include ${photo.fileName} in zip`);
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = zipUrl;
        a.download = `selected-photos-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(zipUrl);

        toast.success(`Downloaded ${selectedPhotosData.length} photos as ZIP`);
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download photos");
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteSelectedPhotos = async () => {
    const ids = Array.from(selectedPhotos);
    await deletePhotos?.(ids);
    setSelectedPhotos(new Set());
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-20"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your library...
          </p>
        </div>
      </motion.div>
    );
  }

  if (photos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
          <Image className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">
          Your library is empty
        </h3>
        <p className="text-muted-foreground max-w-sm text-sm">
          Upload your first stickers above to start building your collection.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Image className="text-secondary h-4 w-4" />
          </div>
          <div>
            <h3 className="text-foreground text-sm font-semibold">
              Your Library
            </h3>
            <p className="text-muted-foreground text-xs">
              {photos.length} sticker{photos.length !== 1 ? "s" : ""}
              {allowSelection && isDownloadzip && selectedPhotos.size > 0 && (
                <span className="text-primary ml-1">
                  ({selectedPhotos.size} selected)
                </span>
              )}
            </p>
          </div>
        </div>
        {allowSelection && isDownloadzip && (
          <div className="flex items-center gap-2">
            {selectedPhotos.size > 0 && (
              <>
                <button
                  onClick={clearSelection}
                  className="text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={downloadSelectedPhotos}
                  disabled={isDownloading}
                  className="bg-primary hover:bg-primary/90 cursor-pointer disabled:bg-muted disabled:text-muted-foreground text-secondary flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  {isDownloading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                  Download{" "}
                  {selectedPhotos.size > 1 ? `(${selectedPhotos.size})` : ""}
                </button>
                <button
                  onClick={deleteSelectedPhotos}
                  disabled={isDeleting}
                  className="bg-primary hover:bg-primary/90 cursor-pointer disabled:bg-muted disabled:text-muted-foreground text-secondary flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                  Delete{" "}
                  {selectedPhotos.size > 1 ? `(${selectedPhotos.size})` : ""}
                </button>
              </>
            )}
            {selectedPhotos.size === 0 && photos.length > 0 && (
              <button
                onClick={selectAll}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
              >
                Select All
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
        {photos.map((photo, index) => {
          const isSelected = selectedPhotos.has(photo.id);

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group bg-muted border-border/50 hover:border-primary/50 relative aspect-square cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-md ${isSelected && isDownloadzip ? "border-primary ring-primary/20 ring-2" : ""
                }`}
              onClick={() => {
                if (allowSelection && isDownloadzip) {
                  togglePhotoSelection(photo.id);
                } else if (onPhotoClick) {
                  // onPhotoClick(photo);
                }
              }}
            >
              {/* Checkerboard background for transparency indication */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%),
                    linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%),
                    linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)
                  `,
                  backgroundSize: "12px 12px",
                  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
                }}
              />

              <img
                src={photo.fileUrl}
                alt={photo.fileName}
                className="bg-muted hover:bg-accent aspect-square cursor-grab rounded-lg object-contain p-2 transition-colors duration-200 hover:scale-105 active:cursor-grabbing"
                loading="lazy"
              />

              {/* Selection checkbox overlay */}
              {allowSelection && isDownloadzip && (
                <div className="absolute top-2 right-2 z-30">
                  <div
                    className={`bg-background/90 rounded-md border-2 p-1 transition-all ${isSelected
                      ? "border-primary bg-primary"
                      : "border-border/70 hover:border-primary/50"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                     isDownloadzip && togglePhotoSelection(photo.id);
                    }}
                  >
                    {isSelected && isDownloadzip ? (
                      <Check className="text-secondary h-3 w-3" />
                    ) : (
                      <Square className="text-muted-foreground h-3 w-3" />
                    )}
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              <div className="bg-primary/0 group-hover:bg-primary/5 absolute inset-0 z-20 transition-colors pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}