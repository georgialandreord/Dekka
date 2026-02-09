import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import PatternSizeSlider from "./pattern-size-slider";

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
  onSizeChange: (id: string, size: number) => void;
}

export default function PhotoCard({
  photo,
  index,
  onRemove,
  onSizeChange,
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

          {/* Repeating background preview (animated) */}
          <motion.div
            className="relative z-10 h-full w-full"
            animate={{
              backgroundSize: `${photo.backgroundSize || 100}px`,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            style={{
              backgroundImage: `url(${displayImage})`,
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
          />

          {/* Remove button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => onRemove(photo.id)}
            className="bg-destructive text-destructive-foreground absolute top-2 right-2 z-30 flex h-8 w-8 items-center justify-center rounded-full opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Footer */}
        <div className="space-y-3 p-3">
          <p className="text-foreground truncate text-sm font-medium">
            {photo.fileName}
          </p>
          <PatternSizeSlider
            size={photo.backgroundSize || 100}
            onSizeChange={(size) => onSizeChange(photo.id, size)}
            fileName={photo.fileName}
          />
        </div>
      </div>
    </motion.div>
  );
}
