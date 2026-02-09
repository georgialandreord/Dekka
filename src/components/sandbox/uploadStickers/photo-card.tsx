import { motion } from "framer-motion";
import { Trash2, Wand2, Sparkles, Check, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";

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

interface PhotoCardProps {
  photo: PhotoPreview;
  index: number;
  onRemove: (id: string) => void;
  onRemoveBg: (id: string) => void;
}

export default function PhotoCard({
  photo,
  index,
  onRemove,
  onRemoveBg,
}: PhotoCardProps) {
  const displayImage =
    photo.isBgRemoved && photo.processedPreview
      ? photo.processedPreview
      : photo.originalPreview;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        layout: { duration: 0.3 },
      }}
      className="group relative"
    >
      <div className="bg-card border-border/50 relative overflow-hidden rounded-2xl border shadow-md transition-all duration-300 hover:shadow-lg">
        {/* Image container */}
        <div className="bg-muted relative aspect-square overflow-hidden">
          {/* Checkered background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(45deg, hsl(var(--muted)) 25%, transparent 25%),
                linear-gradient(-45deg, hsl(var(--muted)) 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, hsl(var(--muted)) 75%),
                linear-gradient(-45deg, transparent 75%, hsl(var(--muted)) 75%)
              `,
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
            }}
          />

          <motion.img
            src={displayImage}
            alt={photo.fileName}
            className="relative z-10 h-full w-full object-contain"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Processing overlay */}
          {photo.isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-foreground/60 absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full"
              >
                <Wand2 className="text-primary-foreground h-6 w-6" />
              </motion.div>
              <p className="text-primary-foreground mt-3 text-sm font-medium">
                Removing...
              </p>
            </motion.div>
          )}

          {/* Success badge */}
          {photo.isBgRemoved && !photo.isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-2 left-2 z-20"
            >
              <div className="bg-secondary text-secondary-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm">
                <Sparkles className="h-3 w-3" />
                <span>BG Removed</span>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => onRemove(photo.id)}
            className="bg-destructive text-destructive-foreground absolute top-2 right-2 z-30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Footer */}
        <div className="space-y-2 p-3">
          <p className="text-foreground truncate text-sm font-medium">
            {photo.fileName}
          </p>

          <Button
            onClick={() => onRemoveBg(photo.id)}
            disabled={photo.isProcessing || photo.isBgRemoved}
            size="sm"
            variant={photo.isBgRemoved ? "outline" : "default"}
            className={`h-8 w-full cursor-pointer text-xs font-medium transition-all ${
              photo.isBgRemoved
                ? "bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20"
                : ""
            }`}
          >
            {photo.isProcessing ? (
              <>
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                Processing
              </>
            ) : photo.isBgRemoved ? (
              <>
                <Check className="mr-1.5 h-3 w-3" />
                Done
              </>
            ) : (
              <>
                <Wand2 className="mr-1.5 h-3 w-3" />
                Remove BG
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
