import { useState, useRef, useEffect } from "react";
import {
  FileText,
  Check,
  MoreVertical,
  Trash2,
  Archive,
  Edit3,
  Move,
  Copy,
  Share2,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { parseAsString, useQueryState } from "nuqs";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { usePlatformStore } from "~/store/platform-store";
import { RenameDialog } from "./rename-dialog";
import { ImageWithFallback } from "./image-with-fallback";
import MoveDialog from "./modal/move-dialog";
import PasteDialog from "./modal/paste-dialog";
import { useClipboardStore } from "~/store/clipboard-store";
import ShareDialog from "./modal/share-dialog";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;

const FileCard = ({
  file,
  onSelect,
  onSingleSelect,
  isSelected,
  onClearSelection,
  index,
}: any) => {
  const IMAGE = file.name.split(".").pop()?.toLowerCase();
  const [_filename] = useQueryState("name", parseAsString);
  const [_fileid] = useQueryState("id", parseAsString);
  const params = useParams();
  const currentPath = params["*"] || "";
  const platform = usePlatformStore((s) => s.currentPlatform);
  const utils = api.useUtils();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleDoubleClick = () => {
    // Handle file open logic
    console.log("Opening file:", file.name);
  };

  const handleFileClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    if (onSingleSelect) {
      onSingleSelect(file.name);
    }
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(file.name);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //   const handleDownload = () => {
  //     setShowDropdown(false);
  //     // Implement download logic
  //     console.log("Downloading file:", file.name);
  //   };

  const deleteFileMutation = api.folder.deleteFile.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.folder.getById.invalidate({ path: currentPath });
      utils.folder.getAll.invalidate();
      onClearSelection();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const renameFileMutation = api.folder.renameFile.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.folder.getById.invalidate({ path: currentPath });
      utils.folder.getAll.invalidate();
      setShowRenameDialog(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { addToClipboard } = useClipboardStore();

  const handleDelete = () => {
    setShowDropdown(false);
    deleteFileMutation.mutate({
      filePath: file.path || `/${file.name}`,
      fileId: file.id,
    });
  };

  const handleRename = (newName: string) => {
    renameFileMutation.mutate({
      filePath: file.path || `/${file.name}`,
      newName,
      fileId: file.id,
    });
  };

  const handleMove = () => {
    setShowDropdown(false);
    setShowMoveDialog(true);
  };

  const handleCopy = () => {
    setShowDropdown(false);
    // Add file to clipboard and immediately show paste dialog
    addToClipboard([
      {
        name: file.name,
        path: file.path || `/${file.name}`,
        id: file.id,
        type: "file",
        platform: platform || "dropbox",
      },
    ]);
    toast.success(`${file.name} copied to clipboard`);

    // Immediately show paste dialog
    setShowPasteDialog(true);
  };

  const handleShare = () => {
    setShowDropdown(false);
    setShowShareDialog(true);
  };

  // Preview URLs are now already in direct format from the server
  const getDirectImageUrl = (previewUrl: string) => {
    return previewUrl || "";
  };

  // Get file icon based on extension
  const getFileIcon = () => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "jfif":
        return (
          <img
            src={`https://placehold.co/40x40/FFB6C1/FFFFFF?text=${extension}`}
            alt="Image file"
            className="h-10 w-10 rounded-lg"
          />
        );
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-8 w-8 text-blue-500" />;
      case "zip":
      case "rar":
      case "7z":
        // Use the Archive icon for zip files
        return <Archive className="h-8 w-8 text-yellow-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${deleteFileMutation.isPending ? "opacity-30" : ""}`}
      style={{ userSelect: "none" }}
    >
      <Card
        className={`group cursor-pointer overflow-hidden bg-white/80 py-0 backdrop-blur-sm hover:shadow-xl ${
          isSelected
            ? "border-primary border-2 shadow-lg"
            : "hover:border-primary/50 border border-purple-100"
        }`}
        onClick={handleFileClick}
        title="Double-click to open file"
      >
        <button
          onClick={handleSelectClick}
          className={`border-primary absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded border-2 bg-white shadow-md transition-all duration-200 ease-in-out hover:bg-purple-50 ${
            isHovered || isSelected
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          }`}
        >
          {isSelected && (
            <Check className="text-primary h-4 w-4 transition-transform duration-200 ease-in-out" />
          )}
        </button>

        <div className="absolute top-3 right-3 z-10" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-white/90 shadow-md backdrop-blur-sm transition-all duration-200 ease-in-out hover:bg-white ${
              isHovered || showDropdown || isSelected
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-75 opacity-0"
            }`}
          >
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </button>

          {showDropdown && (
            <div className="absolute top-full right-0 z-20 mt-1 w-32 overflow-hidden rounded-lg border border-purple-100 bg-white shadow-lg">
              <button
                onClick={handleShare}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-[#A51080]"
              >
                <Share2 className="h-3 w-3" />
                Share
              </button>
              <button
                onClick={handleCopy}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-[#A51080]"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
              <button
                onClick={handleMove}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-[#A51080]"
              >
                <Move className="h-3 w-3" />
                Move
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowRenameDialog(true);
                }}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-[#A51080]"
              >
                <Edit3 className="h-3 w-3" />
                Rename
              </button>
              {/* <button
                onClick={handleDownload}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-[#A51080]"
              >
                <Download className="h-3 w-3" />
                Download
              </button> */}
              <button
                onClick={handleDelete}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-[#D81E58] transition-colors hover:bg-red-50 hover:text-[#D81E58]"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`,
          }}
        >
          <div className="flex h-full items-center justify-center bg-linear-to-br from-purple-100 to-pink-100">
            <ImageWithFallback
              src={getDirectImageUrl(file?.preview)}
              fallbackSrc={`https://placehold.co/40x40/FFB6C1/FFFFFF?text=${IMAGE}`}
            />
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-purple-100 to-pink-100"
              style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
            >
              {getFileIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {Math.round(file.size / 1024)} KB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        itemName={file.name}
        itemType="file"
        onRename={handleRename}
        isRenaming={renameFileMutation.isPending}
      />

      <MoveDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        handleMoveComplete={onClearSelection}
        itemsToMove={[
          {
            name: file.name,
            path: file.path || `/${file.name}`,
            id: file.id,
            type: "file",
          },
        ]}
      />

      <PasteDialog
        open={showPasteDialog}
        onOpenChange={setShowPasteDialog}
        handlePasteComplete={() => {
          setShowPasteDialog(false);
          onClearSelection();
        }}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        itemName={file.name}
        itemType="file"
        // itemId={file.id}
        itemId={platform === "dropbox" ? file.path : file.id}
        platform={platform || "dropbox"}
      />
    </motion.div>
  );
};

export default FileCard;
