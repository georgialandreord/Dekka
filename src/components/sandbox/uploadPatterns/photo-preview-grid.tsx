import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, Image } from "lucide-react";
import type { PhotoPreview } from "./photo-card";
import { Button } from "~/components/ui/button";
import PatternPhotoCard from "./photo-card";

interface PhotoPreviewGridProps {
  photos: PhotoPreview[];
  onRemovePhoto: (id: string) => void;
  onSizeChange: (id: string, size: number) => void;
  onCancel: () => void;
  onCreatePattern: () => void;
  isUploading: boolean;
  isModelLoading: boolean;
}

export default function PhotoPreviewGrid({
  photos,
  onRemovePhoto,
  onSizeChange,
  onCancel,
  isUploading,
  onCreatePattern,
}: PhotoPreviewGridProps) {
  const processingCount = photos.filter((p) => p.isProcessing).length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
            <Image className="text-primary h-5 w-5" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              Review svg
            </h2>
            <p className="text-muted-foreground text-sm">
              {photos.length} svg{photos.length !== 1 ? "s" : ""} ready to
              upload
            </p>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <AnimatePresence mode="popLayout">
          {photos.map((photo, index) => (
            <PatternPhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              onRemove={onRemovePhoto}
              onSizeChange={onSizeChange}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {photos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Image className="text-muted-foreground h-8 w-8" />
          </div>
          <p className="text-muted-foreground">No svg to preview</p>
        </motion.div>
      )}

      {/* Action buttons */}
      {photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border flex flex-col gap-3 border-t pt-4 sm:flex-row"
        >
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isUploading}
            className="flex-1 cursor-pointer sm:flex-none"
          >
            Cancel
          </Button>

          <Button
            onClick={() => onCreatePattern()}
            // onClick={onCreateStickerPack}
            disabled={isUploading || photos.length === 0 || processingCount > 0}
            className="flex-1 cursor-pointer sm:min-w-40 sm:flex-none"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
