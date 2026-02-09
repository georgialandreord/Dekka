import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, FileImage } from "lucide-react";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isUploading: boolean;
}

export default function DropZone({
  onFilesSelected,
  isUploading,
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        onFilesSelected(files);
      }
    },
    [onFilesSelected],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      e.target.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full"
    >
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-primary group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 md:min-h-80 ${
          isDragActive
            ? "border-primary bg-accent shadow-glow scale-[1.02]"
            : "border-border bg-card hover:border-primary hover:bg-accent/50"
        } ${isUploading ? "pointer-events-none opacity-70" : ""} `}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*,.heic,.zip"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />

        {/* Animated background elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: isDragActive ? 180 : 0,
              scale: isDragActive ? 1.2 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="bg-primary/5 absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: isDragActive ? -180 : 0,
              scale: isDragActive ? 1.3 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="bg-secondary/5 absolute -bottom-20 -left-20 h-48 w-48 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <motion.div
            animate={{
              y: isDragActive ? -8 : 0,
              scale: isDragActive ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-colors duration-300 ${isDragActive ? "bg-primary text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"} `}
          >
            <Upload className="h-8 w-8" />
          </motion.div>

          <AnimatePresence mode="wait">
            {isDragActive ? (
              <motion.div
                key="drop"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                <h3 className="text-primary text-xl font-semibold">
                  Drop your files here
                </h3>
                <p className="text-muted-foreground text-sm">
                  Release to start uploading
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <h3 className="text-foreground text-xl font-semibold">
                  Drop your stickers here
                </h3>
                <p className="text-muted-foreground max-w-xs text-sm">
                  or click to browse from your device
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Supported formats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            {["JPG", "PNG", "WEBP", "HEIC", "ZIP"].map((format, i) => (
              <span
                key={format}
                className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
              >
                {format}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4">
          <FileImage className="text-primary h-6 w-6" />
        </div>
        <div className="absolute right-4 bottom-4 opacity-20">
          <Sparkles className="text-secondary h-6 w-6" />
        </div>
      </label>
    </motion.div>
  );
}
