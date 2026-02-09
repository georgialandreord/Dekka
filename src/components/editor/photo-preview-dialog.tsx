import { useState, useEffect } from "react";
import { Trash2, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import toast from "react-hot-toast";
import { initializeModel, processImage } from "~/lib/bg-remove";

export interface PhotoPreview {
  id: string;
  originalFile: File;
  originalPreview: string;
  processedFile: File | null;
  processedPreview: string | null;
  isBgRemoved: boolean;
  isProcessing: boolean;
  fileName: string;
  backgroundSize?: number;
}

type PhotoPreviewDialogProps = {
  open: boolean;
  onClose: () => void;
  photos: PhotoPreview[];
  onConfirm: (processedPhotos: PhotoPreview[]) => Promise<void>;
  isModelReady: boolean;
  isLoadingModel: boolean;
};

export default function PhotoPreviewDialog({
  open,
  onClose,
  photos,
  onConfirm,
  isModelReady,
  isLoadingModel,
}: PhotoPreviewDialogProps) {
  const [localPhotos, setLocalPhotos] = useState<PhotoPreview[]>(photos);
  const [isUploading, setIsUploading] = useState(false);

  // Sync localPhotos with photos prop when it changes
  useEffect(() => {
    setLocalPhotos(photos);
  }, [photos]);

  const initializeBgRemoval = async () => {
    if (isModelReady) return;

    try {
      await initializeModel();
    } catch (error) {
      console.error("Failed to initialize model:", error);
      toast.error("Failed to load background removal model");
    }
  };

  const handleRemoveBg = async (id: string) => {
    if (!isModelReady) {
      await initializeBgRemoval();
      if (!isModelReady) return;
    }

    setLocalPhotos((prev) =>
      prev.map((photo) =>
        photo.id === id
          ? { ...photo, isProcessing: true, isBgRemoved: true }
          : photo,
      ),
    );

    try {
      const photo = localPhotos.find((p) => p.id === id);
      if (!photo) return;

      const processedFile = await processImage(photo.originalFile);
      const processedPreview = URL.createObjectURL(processedFile);

      setLocalPhotos((prev) =>
        prev.map((photo) =>
          photo.id === id
            ? {
                ...photo,
                processedFile,
                processedPreview,
                isProcessing: false,
                isBgRemoved: true,
              }
            : photo,
        ),
      );
    } catch (error) {
      console.error("Failed to process image:", error);
      toast.error(
        `Failed to process ${localPhotos.find((p) => p.id === id)?.fileName}`,
      );
      setLocalPhotos((prev) =>
        prev.map((photo) =>
          photo.id === id
            ? { ...photo, isProcessing: false, isBgRemoved: false }
            : photo,
        ),
      );
    }
  };

  const handleRemovePhoto = (id: string) => {
    setLocalPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const handleConfirm = async () => {
    const photosToUpload = localPhotos.filter((photo) => !photo.isProcessing);

    if (photosToUpload.length === 0) {
      toast.error("No photos to upload");
      return;
    }

    setIsUploading(true);
    try {
      await onConfirm(photosToUpload);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAllBg = async () => {
    if (!isModelReady) {
      await initializeBgRemoval();
      if (!isModelReady) return;
    }

    for (const photo of localPhotos) {
      if (!photo.isBgRemoved && !photo.isProcessing) {
        await handleRemoveBg(photo.id);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Review Photos Before Upload</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-1 py-4">
          {localPhotos.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-center">
              <p className="text-gray-500">No photos to upload</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {localPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group bg-card relative overflow-hidden rounded-lg border"
                >
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/80 absolute top-2 right-2 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="relative aspect-square">
                    <img
                      src={
                        photo.isBgRemoved && photo.processedPreview
                          ? photo.processedPreview
                          : photo.originalPreview
                      }
                      alt={photo.fileName}
                      className="h-full w-full object-cover"
                    />
                    {photo.isProcessing && (
                      <div className="bg-foreground/60 absolute inset-0 flex flex-col items-center justify-center gap-3 backdrop-blur-xs">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full" />
                          <div className="shadow-glow magic-glow relative flex h-12 w-12 items-center justify-center rounded-full">
                            <Wand2 className="magic-wand h-6 w-6 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    {photo.isBgRemoved && !photo.isProcessing && (
                      <div className="bg-primary text-primary-foreground absolute bottom-2 left-2 flex gap-1 rounded-full px-2 py-1 text-[10px]">
                        <Sparkles className="h-3 w-3" />
                        Removed
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="truncate text-sm font-medium">
                      {photo.fileName}
                    </p>
                    <Button
                      onClick={() => handleRemoveBg(photo.id)}
                      disabled={photo.isProcessing || photo.isBgRemoved}
                      className={`hover:bg-primary/80 mt-2 h-8 cursor-pointer text-xs ${photo.isBgRemoved ? "" : "bg-primary"}`}
                    >
                      {photo.isProcessing ? (
                        <>Processing...</>
                      ) : photo.isBgRemoved ? (
                        <>
                          <Sparkles className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <Wand2 />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {localPhotos.some((p) => !p.isBgRemoved && !p.isProcessing) && (
            <Button
              onClick={handleRemoveAllBg}
              disabled={isLoadingModel}
              variant="outline"
              className="w-full cursor-pointer sm:w-auto"
            >
              {isLoadingModel ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading Model...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Remove All Backgrounds
                </>
              )}
            </Button>
          )}
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 cursor-pointer sm:flex-none"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isUploading || localPhotos.length === 0}
              className="bg-primary hover:bg-primary/80 flex-1 cursor-pointer sm:flex-none"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${localPhotos.length} Photo${localPhotos.length !== 1 ? "s" : ""}`
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
