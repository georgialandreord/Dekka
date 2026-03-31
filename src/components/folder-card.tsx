import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  FolderOpen,
  Trash2,
  Check,
  Edit,
  Eye,
  MoreVertical,
  Edit3,
  Move,
  Copy,
  Share2,
  Star,
} from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { parseAsString, useQueryState } from "nuqs";
import { motion } from "framer-motion";
import { BACKGROUND_PATTERN } from "~/mockdata";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { getActionColor } from "~/lib/colors";
import { RenameDialog } from "./rename-dialog";
import MoveDialog from "./modal/move-dialog";
import PasteDialog from "./modal/paste-dialog";
import { usePlatformStore } from "~/store/platform-store";
import { useClipboardStore } from "~/store/clipboard-store";
import ShareDialog from "./modal/share-dialog";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;

const FolderCard = ({
  folder,
  onSelect,
  onSingleSelect,
  onClearSelection,
  isSelected,
  decorationData,
  index,
  selectedItems,
  folders,
  files,
  isStarredView = false,
}: any) => {
  const navigate = useNavigate();
  const params = useParams();
  const currentPath = params["*"] || "";
  const [_foldername, setFolderName] = useQueryState("name", parseAsString);
  const [_folderid, setFolderId] = useQueryState("id", parseAsString);
  const platform = usePlatformStore((s) => s.currentPlatform);
  const utils = api.useUtils();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isCheckingStarStatus, setIsCheckingStarStatus] = useState(true);

  const folderDecoration = decorationData?.find(
    (decoration: any) => decoration.folderId === folder.id,
  );

  const handleDoubleClick = () => {
    navigate(`/dashboard/folders${folder.path}`);
  };

  const handleFolderClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    if (onSingleSelect) {
      onSingleSelect(folder.name);
    }
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(folder.name);
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

  const handleEdit = () => {
    setShowDropdown(false);
    setFolderName(folder.name);
    setFolderId(folder.id);
    navigate(`/folder-editor?id=${folder.id}&name=${folder.name}`);
  };

  // const handleView = () => {
  //   setShowDropdown(false);
  //   navigate(`/dashboard/folders${folder.path_display}`);
  // };

  const deleteFolderMutation = api.folder.deleteFolder.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.folder.getById.invalidate({ path: currentPath });
      utils.folder.getAll.invalidate();
      utils.folderDecoration.getAll.invalidate();
      onClearSelection();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const renameFolderMutation = api.folder.renameFolder.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.folder.getById.invalidate({ path: currentPath });
      utils.starredFolder.getAll.invalidate({platform: platform || "dropbox"},{
        exact: false
      });
      utils.folder.getAll.invalidate();
      setShowRenameDialog(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const moveItemMutation = api.folder.moveItem.useMutation({
    onSuccess: () => {
      toast.success(`Moved successfully`);
      utils.folder.getById.invalidate({ path: currentPath });
      utils.folder.getAll.invalidate();
      onClearSelection();
    },
    onError: (error) => {
      toast.error(`Failed to move item: ${error.message}`);
      // Revert optimistic update by refetching
      utils.folder.getById.invalidate({ path: currentPath });
      utils.folder.getAll.invalidate();
    },
  });

  const { addToClipboard } = useClipboardStore();

  // Check if folder is starred on mount (skip if in starred view)
  const { data: starStatusData, isLoading: isCheckingStatus } = api.starredFolder.isStarred.useQuery(
    {
      folderId: folder.id,
    },
    {
      enabled: !isStarredView,
    }
  );

  useEffect(() => {
    if (isStarredView) {
      // In starred view, folder is always starred
      setIsStarred(true);
      setIsCheckingStarStatus(false);
    } else if (starStatusData !== undefined) {
      setIsStarred(starStatusData);
      setIsCheckingStarStatus(false);
    }
  }, [starStatusData, isStarredView]);

  const starFolderMutation = api.starredFolder.add.useMutation({
    onSuccess: () => {
      setIsStarred(true);
      toast.success("Folder starred!");
      utils.starredFolder.getAll.invalidate({platform: platform || "dropbox"},{
        exact: false
      });
    },
    onError: (error) => {
      toast.error(error.message);
      setIsStarred(false);
    },
  });

  const unstarFolderMutation = api.starredFolder.remove.useMutation({
    onSuccess: () => {
      setIsStarred(false);
      toast.success("Folder unstarred!");
      utils.starredFolder.getAll.invalidate({platform: platform || "dropbox"},{
        exact: false
      });
    },
    onError: (error) => {
      toast.error(error.message);
      setIsStarred(true);
    },
  });

  const handleHoverStart = () => {
    utils.folder.getById.prefetch({
      path: folder.path,
    });
  }

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic update
    const wasStarred = isStarred;
    setIsStarred(!wasStarred);
    setShowDropdown(false);

    try {
      if (wasStarred) {
        await unstarFolderMutation.mutateAsync({
          folderId: folder.id,
        });
      } else {
        await starFolderMutation.mutateAsync({
          folderId: folder.id,
          folderName: folder.name,
          folderPath: folder.path,
          folderDecorationId: folderDecoration?.id,
          platform: platform || "dropbox",
        });
      }
    } catch (error) {
      // Error handling is in mutation onError, but we can revert optimistic update
      setIsStarred(wasStarred);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    // Ignore drop if this folder is in the selectedItems
    if (selectedItems && selectedItems.has(folder.name)) {
      return;
    }

    let itemsToMove: any[] = [];

    // If selectedItems exist and have items, use them for batch move
    if (selectedItems && selectedItems.size > 0) {
      // Use selected items for batch move
      itemsToMove = [
        ...folders.filter((f: any) => selectedItems.has(f.name)).map((f: any) => ({
          name: f.name,
          path: f.path,
          id: f.id,
          type: "folder",
        })),
        ...files.filter((f: any) => selectedItems.has(f.name)).map((f: any) => ({
          name: f.name,
          path: f.path || `/${f.name}`,
          id: f.id,
          type: "file",
        })),
      ];
    } else {
      // Fallback: read from dataTransfer if no items are selected
      const draggedData = e.dataTransfer.getData("application/json");
      if (draggedData) {
        try {
          itemsToMove = JSON.parse(draggedData);
        } catch (error) {
          console.error("Failed to parse dragged data:", error);
        }
      }
    }

    if (itemsToMove.length > 0) {
      const toPath = folder.path;
      handleBatchMove(itemsToMove, toPath);
    }
  };

  const handleBatchMove = async (itemsToMove: any[], destinationPath: string) => {
    try {
      // Optimistic update: immediately remove items from current view
      const itemNames = itemsToMove.map((item) => item.name);
      utils.folder.getById.setData(
        { path: currentPath },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            entries: oldData.entries.filter(
              (item: any) => !itemNames.includes(item.name)
            ),
          };
        }
      );
      onClearSelection();

      const promises = itemsToMove.map(async (item) => {
        const toPath = `${destinationPath}/${item.name}`;
        return moveItemMutation.mutateAsync({
          fromPath: item.path,
          toPath,
          itemType: item.type,
          itemId: item.id,
        });
      });

      await Promise.all(promises);
      
      // Invalidate destination path so it reflects the moved items
      const normalizedDestPath = destinationPath.startsWith("/") 
        ? destinationPath.slice(1) 
        : destinationPath;
      utils.folder.getById.invalidate({ path: normalizedDestPath });
      // Also invalidate getAll since it includes all root folders
      utils.folder.getAll.invalidate();
    } catch (error) {
      console.error("Failed to move items:", error);
      toast.error("Failed to move items");
    }
  };

  const handleDelete = () => {
    setShowDropdown(false);
    deleteFolderMutation.mutate({
      folderPath: folder.path,
      folderId: folder.id,
    });
  };

  const handleRename = (newName: string) => {
    renameFolderMutation.mutate({
      folderPath: folder.path,
      newName,
      folderId: folder.id,
    });
  };

  const handleMove = () => {
    setShowDropdown(false);
    setShowMoveDialog(true);
  };

  const handleCopy = () => {
    setShowDropdown(false);
    // Add folder to clipboard and immediately show paste dialog
    addToClipboard([
      {
        name: folder.name,
        path: folder.path,
        id: folder.id,
        type: "folder",
        platform: platform || "dropbox",
      },
    ]);
    toast.success(`${folder.name} copied to clipboard`);

    // Immediately show paste dialog
    setShowPasteDialog(true);
  };

  const handleShare = () => {
    setShowDropdown(false);
    setShowShareDialog(true);
  };

  const sortedDecorations = [...(folderDecoration?.decorations || [])].sort(
    (a, b) => (a.zIndex || 0) - (b.zIndex || 0),
  );

  if (deleteFolderMutation.isSuccess) {
    return null;
  }

  return (
    <motion.div
      onHoverStart={handleHoverStart}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${deleteFolderMutation.isPending ? "opacity-30!" : deleteFolderMutation.isSuccess ? "opacity-0!" : ""}`}
      style={{ userSelect: "none" }}
      draggable
      onDragStart={(e: any) => {
        let itemsToMove: any[] = [];

        if (isSelected && selectedItems && selectedItems.size > 0) {
          // If this item is selected, drag all selected items
          itemsToMove = [
            ...folders.filter((f: any) => selectedItems.has(f.name)).map((f: any) => ({
              name: f.name,
              path: f.path,
              id: f.id,
              type: "folder",
            })),
            ...files.filter((f: any) => selectedItems.has(f.name)).map((f: any) => ({
              name: f.name,
              path: f.path || `/${f.name}`,
              id: f.id,
              type: "file",
            })),
          ];
        } else {
          // If this item is not selected, drag only this folder
          itemsToMove = [{ name: folder.name, path: folder.path, id: folder.id, type: "folder" }];
        }

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("application/json", JSON.stringify(itemsToMove));

        // FIX: Custom drag image for multiple items
        if (itemsToMove.length > 1) {
          // Create a container for the custom drag image
          const dragImageContainer = document.createElement("div");
          dragImageContainer.style.position = "absolute";
          dragImageContainer.style.top = "-1000px";
          dragImageContainer.style.left = "-1000px";
          dragImageContainer.style.pointerEvents = "none";
          dragImageContainer.style.zIndex = "9999";
          
          // Clone the current card to use as the base visual
          const clone = e.currentTarget.cloneNode(true) as HTMLElement;
          clone.style.transform = "none"; // Reset any transform animations
          clone.style.opacity = "1";
          // Remove specific hover/selection states from the clone if desired, 
          // or keep them to show it's the selected one being dragged.
          
          // Create a badge to show the count
          const badge = document.createElement("div");
          badge.innerText = `${itemsToMove.length}`;
          badge.style.position = "absolute";
          badge.style.bottom = "-10px";
          badge.style.right = "-10px";
          badge.style.backgroundColor = "#ef4444"; // Red badge
          badge.style.color = "white";
          badge.style.borderRadius = "9999px";
          badge.style.width = "24px";
          badge.style.height = "24px";
          badge.style.display = "flex";
          badge.style.alignItems = "center";
          badge.style.justifyContent = "center";
          badge.style.fontWeight = "bold";
          badge.style.fontSize = "12px";
          badge.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

          dragImageContainer.appendChild(clone);
          dragImageContainer.appendChild(badge);

          document.body.appendChild(dragImageContainer);
          
          // Set the custom drag image
          e.dataTransfer.setDragImage(dragImageContainer, 0, 0);

          // Clean up the element after the browser captures the image
          requestAnimationFrame(() => {
            if (document.body.contains(dragImageContainer)) {
              document.body.removeChild(dragImageContainer);
            }
          });
        }
      }}
    >
      <Card
        className={`group cursor-pointer overflow-hidden bg-white/80 py-0 backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
          isSelected
            ? "border-primary ring-primary/20 border-2 shadow-lg ring-2"
            : "border-border hover:border-primary/50 border hover:shadow-md"
        } ${isDragOver ? "border-primary border-2 shadow-lg ring-2 ring-primary/20 bg-primary/5" : ""}`}
        onClick={handleFolderClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        title="Double-click to open folder"
      >
        <button
          onClick={handleSelectClick}
          className={`border-primary hover:bg-accent absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded border-2 bg-white shadow-md transition-all duration-200 ease-in-out ${
            isHovered || isSelected
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          }`}
        >
          {isSelected && (
            <Check className="text-primary h-4 w-4 transition-transform duration-200 ease-in-out" />
          )}
        </button>

        <div className="absolute top-3 right-3 z-100" ref={dropdownRef}>
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
            <MoreVertical className="text-muted-foreground h-4 w-4" />
          </button>

          {showDropdown && (
            <div className="border-border bg-popover absolute top-full right-0 z-100 mt-1 w-32 overflow-hidden rounded-lg border shadow-lg">
              <button
                onClick={handleToggleStar}
                disabled={isCheckingStatus}
                className="text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors disabled:opacity-50"
              >
                <Star
                  className="h-3 w-3"
                  fill={isStarred ? "currentColor" : "none"}
                />
                {isStarred ? "Unstar" : "Star"}
              </button>
              <button
                onClick={handleShare}
                className="text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
              >
                <Share2 className="h-3 w-3" />
                Share
              </button>
              <button
                onClick={handleCopy}
                className="text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
              <button
                onClick={handleMove}
                className="text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
              >
                <Move className="h-3 w-3" />
                Move
              </button>
              <button
                onClick={handleEdit}
                className="text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
              >
                <Edit className="h-3 w-3" />
                Decorate
              </button>
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowRenameDialog(true);
                }}
                className="text-popover-foreground hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
              >
                <Edit3 className="h-3 w-3" />
                Rename
              </button>
              {/* <button
                onClick={handleView}
                className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                <Eye className="h-3 w-3" />
                View
              </button> */}
              <button
                onClick={handleDelete}
                className="text-destructive hover:bg-destructive-foreground flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors"
                disabled={deleteFolderMutation.isPending}
              >
                <Trash2 className="h-3 w-3" />
                {deleteFolderMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`,
            backgroundColor: folderDecoration?.color || "#FFB6C1",
            backgroundImage:
              BACKGROUND_PATTERN[
                (folderDecoration?.backgroundPattern as keyof typeof BACKGROUND_PATTERN) ||
                  (folder.background_pattern as keyof typeof BACKGROUND_PATTERN)
              ] || `url(${folderDecoration?.backgroundPattern})`,
            backgroundSize:
              folderDecoration?.backgroundPattern === "dots" ||
              folder.background_pattern === "dots"
                ? "30px 30px"
                : folderDecoration?.backgroundPattern === "hearts" ||
                    folder.background_pattern === "hearts"
                  ? "80px 80px"
                  : folderDecoration?.backgroundPattern === "palm_trees" ||
                      folder.background_pattern === "palm_trees"
                    ? "100px 120px"
                    : folderDecoration?.backgroundPattern === "wavy_zebra" ||
                        folder.background_pattern === "wavy_zebra"
                      ? "150px 150px"
                      : folderDecoration?.backgroundPattern ===
                            "purple_flames" ||
                          folder.background_pattern === "purple_flames"
                        ? "200px 350px"
                        : folderDecoration?.backgroundPattern === "cherries" ||
                            folder.background_pattern === "cherries"
                          ? "150px 150px"
                          : folderDecoration?.backgroundPattern === "leopard" ||
                              folder.background_pattern === "leopard"
                            ? "120px 120px"
                            : folderDecoration?.backgroundPattern === "tiger" ||
                                folder.background_pattern === "tiger"
                              ? "80px 80px"
                              : folderDecoration?.backgroundPattern ===
                                    "zebra" ||
                                  folder.background_pattern === "zebra"
                                ? "100px 100px"
                                : folderDecoration?.backgroundPattern ===
                                      "stars" ||
                                    folder.background_pattern === "stars"
                                  ? "100px 100px"
                                  : `${folderDecoration?.backgroundPatternSize ? folderDecoration?.backgroundPatternSize : '100px'}px`,
          }}
        >
          {sortedDecorations.length > 0 && (
            <div className="absolute inset-0">
              {sortedDecorations.map((decoration) => {
                const scaleX = 100 / CANVAS_WIDTH;
                const scaleY = 100 / CANVAS_HEIGHT;
                const widthPercent = decoration.width * scaleX;

                return (
                  <div
                    key={decoration.id}
                    className="absolute"
                    style={{
                      left: `${decoration.x * scaleX}%`,
                      top: `${decoration.y * scaleY}%`,
                      width: `${widthPercent}%`,
                      height: `${decoration.height * scaleY}%`,
                      transform: `rotate(${decoration.rotation || 0}deg)`,
                      zIndex: decoration.zIndex || 0,
                    }}
                  >
                    {/* START: ADDED EFFECTS LOGIC */}
                    {/* Sparkles Effect */}
                    {/* {decoration.effects?.includes("sparkles") && (
                      <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={`sparkle-${i}`}
                            className="absolute animate-ping"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: "2s",
                            }}
                          >
                            <div
                              className="bg-warning h-3 w-3 rounded-full shadow-lg"
                              style={{
                                boxShadow: "0 0 10px #fbbf24",
                                color: folderDecoration.sparkleColor || "#fbbf24"
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )} */}

                    {decoration.effects?.includes("sparkles") && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "2s",
                }}
              >
                {/* Replaced the circle div with an SVG Star */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: `${decoration?.sparkleColor}`,
                    filter: `drop-shadow(0 0 6px ${decoration?.sparkleColor})`,
                  }}
                >
                  <path
                    d="M12 2L14.09 8.26L20.18 8.64L15.54 12.74L16.91 19.36L12 15.77L7.09 19.36L8.46 12.74L3.82 8.64L9.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            ))}
          </div>
        )}

                    {/* Glitter Effect */}
                    {decoration.effects?.includes("glitter") && (
                      <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
                        {[...Array(15)].map((_, i) => (
                          <div
                            key={`glitter-${i}`}
                            className="absolute animate-pulse"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.15}s`,
                              animationDuration: "1.5s",
                            }}
                          >
                            <div
                              className="h-2 w-2 rounded-full shadow-lg"
                              style={{
                                backgroundColor: `${decoration?.glitterColor}`,
                                boxShadow: "0 0 8px #ec4899",
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Wrapper for other effects (shadow, neon, holographic, retro) */}
                    <div
                      className={`h-full w-full ${
                        decoration.effects?.includes("retro_sticker")
                          ? "p-[8%]"
                          : ""
                      }`}
                      style={{
                        filter: [
                          decoration.effects?.includes("shadow")
                            ? "drop-shadow(0 10px 15px rgba(0,0,0,0.3))"
                            : "",
                          decoration.effects?.includes("neon_glow")
                            ? "drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" "),
                        animation: decoration.effects?.includes("holographic")
                          ? "rainbow 3s linear infinite"
                          : "none",
                      }}
                    >
                      {/* Retro Sticker Effect Background */}
                      {decoration.effects?.includes("retro_sticker") && (
                        <div
                          className="absolute inset-0 rounded-lg bg-white"
                          style={{
                            boxShadow:
                              "0 4px 6px rgba(0,0,0,0.2), inset 0 0 0 6px white",
                          }}
                        />
                      )}
                      {/* END: ADDED EFFECTS LOGIC */}

                      {decoration.type === "sticker" && (
                        <img
                          src={decoration.content}
                          alt=""
                          className={`pointer-events-none relative z-10 h-full w-full object-contain ${
                            decoration.effects?.includes("retro_sticker")
                              ? "drop-shadow-md"
                              : ""
                          }`}
                        />
                      )}

                      {decoration.type === "photo" && (
                        <div className="relative z-10 h-full w-full">
                          <img
                            src={decoration.content}
                            alt=""
                            className={`pointer-events-none h-full w-full rounded-lg object-cover ${
                              decoration.effects?.includes("retro_sticker")
                                ? "drop-shadow-md"
                                : ""
                            }`}
                          />
                        </div>
                      )}

                      {decoration.type === "frame" && (
                        <div className="relative h-full w-full">
                          {decoration.frame_style === "star" && (
                            <div className="relative h-full w-full">
                              <img
                                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/80c6feb75_image.png"
                                alt="star frame"
                                className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                                draggable={false}
                                style={{
                                  zIndex: 1,
                                  filter:
                                    decoration.frame_color &&
                                    decoration.frame_color !== "#000000" &&
                                    decoration.frame_color !== "#ffffff"
                                      ? `brightness(0) saturate(100%) invert(0%) sepia(100%) hue-rotate(${getHueRotation(decoration.frame_color)}deg) brightness(1.2) contrast(1.2)`
                                      : decoration.frame_color === "#ffffff"
                                        ? `brightness(0) saturate(100%) invert(100%) sepia(0%) hue-rotate(0deg) brightness(1.2) contrast(1.2)`
                                        : decoration.frame_color === "#000000"
                                          ? "brightness(0)"
                                          : "none",
                                }}
                              />
                              <div
                                className="absolute inset-[15%] overflow-hidden"
                                style={{ zIndex: 0 }}
                              >
                                <img
                                  src={
                                    decoration?.frame_content ||
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
                                  }
                                  style={{
                                    transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                                    cursor: "grab",
                                  }}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          {decoration.content === "heart" && (
                            <div className="relative h-full w-full">
                              <svg
                                viewBox="0 0 100 100"
                                className="absolute inset-0 h-full w-full"
                                preserveAspectRatio="none"
                                style={{ zIndex: 1 }}
                              >
                                <path
                                  d="M50,90 C50,90 10,65 10,40 C10,25 20,15 32.5,15 C40,15 45,20 50,27.5 C55,20 60,15 67.5,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z"
                                  fill="none"
                                  stroke={decoration.frame_color || "#ec4899"}
                                  strokeWidth="3"
                                />
                              </svg>
                              <div
                                className="absolute inset-[8%]"
                                style={{
                                  clipPath:
                                    "polygon(50% 15%, 65% 18%, 78% 18%, 88% 28%, 88% 42%, 78% 58%, 68% 72%, 50% 88%, 32% 72%, 22% 58%, 12% 42%, 12% 28%, 22% 18%, 35% 18%)",
                                  zIndex: 0,
                                  // backgroundColor: "#fff",
                                }}
                              >
                                <img
                                  src={
                                    decoration.frame_content ||
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
                                  }
                                  alt=""
                                  className="h-full w-full object-cover"
                                  style={{
                                    transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                                    cursor: "grab",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {decoration.content === "polaroid" && (
                            <div
                              className="relative h-full w-full shadow-lg"
                              style={{
                                backgroundColor:
                                  decoration.frame_color || "#ffffff",
                                border: `8px solid ${decoration.frame_color || "#ffffff"}`,
                              }}
                            >
                              <div
                                className="absolute flex items-center justify-center overflow-hidden bg-white"
                                style={{
                                  top: `2px`,
                                  left: `2px`,
                                  right: `2px`,
                                  bottom: `8px`,
                                }}
                              >
                                <img
                                  src={
                                    decoration?.frame_content ||
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
                                  }
                                  style={{
                                    transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                                    cursor: "grab",
                                  }}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          {decoration?.content === "circle" && (
                            <div
                              className="h-full w-full overflow-hidden rounded-full shadow-lg"
                              style={{
                                border: `8px solid ${decoration.frame_color || "#ffffff"}`,
                                padding: "3%",
                              }}
                            >
                              <div className="h-full w-full overflow-hidden rounded-full bg-white">
                                <img
                                  src={
                                    decoration?.frame_content ||
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
                                  }
                                  style={{
                                    transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                                    cursor: "grab",
                                  }}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          {(decoration.content === "rectangle" ||
                            decoration.content === "square" ||
                            !decoration.content) && (
                            <div
                              className="h-full w-full overflow-hidden rounded-lg shadow-lg"
                              style={{
                                border: `8px solid ${decoration?.frame_color || "#ffffff"}`,
                                padding: "3%",
                              }}
                            >
                              {decoration.frame_content ? (
                                <img
                                  src={decoration.frame_content}
                                  alt="Frame content"
                                  className="h-full w-full origin-center object-cover"
                                  style={{
                                    transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                                    cursor: "grab",
                                  }}
                                />
                              ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center rounded bg-linear-to-br from-purple-50 to-pink-50 p-2 text-center">
                                  <span className="block text-xs font-medium text-gray-400">
                                    Drop Image Here
                                  </span>
                                  <span className="text-[10px] text-gray-300">
                                    Drag sticker or photo
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor:
                  folderDecoration?.color || folder.color || "#FFB6C1",
              }}
            >
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground truncate font-semibold">
                {folder.name}
              </h3>
              {/* <p className="text-muted-foreground text-sm">
                {folderDecoration?.decorations?.length || 0} decoration
                {(folderDecoration?.decorations?.length || 0) !== 1 ? "s" : ""}
              </p> */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* START: ADDED RAINBOW ANIMATION STYLE */}
      <style jsx>{`
        @keyframes rainbow {
          0% {
            filter: hue-rotate(0deg) saturate(1.5) brightness(1.1);
          }
          33% {
            filter: hue-rotate(120deg) saturate(1.5) brightness(1.1);
          }
          66% {
            filter: hue-rotate(240deg) saturate(1.5) brightness(1.1);
          }
          100% {
            filter: hue-rotate(360deg) saturate(1.5) brightness(1.1);
          }
        }
      `}</style>
      {/* END: ADDED RAINBOW ANIMATION STYLE */}

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        itemName={folder.name}
        itemType="folder"
        onRename={handleRename}
        isRenaming={renameFolderMutation.isPending}
      />

      <MoveDialog
        open={showMoveDialog}
        handleMoveComplete={onClearSelection}
        onOpenChange={setShowMoveDialog}
        itemsToMove={[
          {
            name: folder.name,
            path: folder.path,
            id: folder.id,
            type: "folder",
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
        itemName={folder.name}
        itemType="folder"
        // itemId={folder.id}
        itemId={platform === "dropbox" ? folder.path : folder.id}
        platform={platform || "dropbox"}
      />
    </motion.div>
  );
};

export default FolderCard;

function getHueRotation(color: string | number) {
  const colorMap: Record<string, number> = {
    "#ec4899": 320,
    "#8b5cf6": 260,
    "#3b82f6": 220,
    "#10b981": 140,
    "#f59e0b": 40,
    "#ef4444": 0,
    "#a855f7": 270,
    "#eab308": 50,
    "#22c55e": 120,
    "#0ea5e9": 195,
  };
  return colorMap[color as keyof typeof colorMap] || 0;
}


// // ... existing imports

// const FolderCard = ({
//   folder,
//   onSelect,
//   onSingleSelect,
//   onClearSelection,
//   isSelected,
//   decorationData,
//   index,
//   selectedItems,
//   folders,
//   files,
// }: any) => {
//   // ... existing hooks and state logic (useState, useEffect, mutations, etc.)

//   // ... existing handlers (handleDoubleClick, handleFolderClick, etc.)

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.05 }}
//       onDoubleClick={handleDoubleClick}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       className={`relative ${deleteFolderMutation.isPending ? "opacity-30!" : deleteFolderMutation.isSuccess ? "opacity-0!" : ""}`}
//       style={{ userSelect: "none" }}
//       draggable
//       onDragStart={(e: any) => {
//         let itemsToMove: any[] = [];

//         if (isSelected && selectedItems && selectedItems.size > 0) {
//           // If this item is selected, drag all selected items
//           itemsToMove = [
//             ...folders.filter((f: any) => selectedItems.has(f.name)).map((f: any) => ({
//               name: f.name,
//               path: f.path,
//               id: f.id,
//               type: "folder",
//             })),
//             ...files.filter((f: any) => selectedItems.has(f.name)).map((f: any) => ({
//               name: f.name,
//               path: f.path || `/${f.name}`,
//               id: f.id,
//               type: "file",
//             })),
//           ];
//         } else {
//           // If this item is not selected, drag only this folder
//           itemsToMove = [{ name: folder.name, path: folder.path, id: folder.id, type: "folder" }];
//         }

//         e.dataTransfer.effectAllowed = "move";
//         e.dataTransfer.setData("application/json", JSON.stringify(itemsToMove));

//         // FIX: Custom drag image for multiple items
//         if (itemsToMove.length > 1) {
//           // Create a container for the custom drag image
//           const dragImageContainer = document.createElement("div");
//           dragImageContainer.style.position = "absolute";
//           dragImageContainer.style.top = "-1000px";
//           dragImageContainer.style.left = "-1000px";
//           dragImageContainer.style.pointerEvents = "none";
//           dragImageContainer.style.zIndex = "9999";
          
//           // Clone the current card to use as the base visual
//           const clone = e.currentTarget.cloneNode(true) as HTMLElement;
//           clone.style.transform = "none"; // Reset any transform animations
//           clone.style.opacity = "1";
//           // Remove specific hover/selection states from the clone if desired, 
//           // or keep them to show it's the selected one being dragged.
          
//           // Create a badge to show the count
//           const badge = document.createElement("div");
//           badge.innerText = `${itemsToMove.length}`;
//           badge.style.position = "absolute";
//           badge.style.bottom = "-10px";
//           badge.style.right = "-10px";
//           badge.style.backgroundColor = "#ef4444"; // Red badge
//           badge.style.color = "white";
//           badge.style.borderRadius = "9999px";
//           badge.style.width = "24px";
//           badge.style.height = "24px";
//           badge.style.display = "flex";
//           badge.style.alignItems = "center";
//           badge.style.justifyContent = "center";
//           badge.style.fontWeight = "bold";
//           badge.style.fontSize = "12px";
//           badge.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

//           dragImageContainer.appendChild(clone);
//           dragImageContainer.appendChild(badge);

//           document.body.appendChild(dragImageContainer);
          
//           // Set the custom drag image
//           e.dataTransfer.setDragImage(dragImageContainer, 0, 0);

//           // Clean up the element after the browser captures the image
//           requestAnimationFrame(() => {
//             if (document.body.contains(dragImageContainer)) {
//               document.body.removeChild(dragImageContainer);
//             }
//           });
//         }
//       }}
//     >
//       {/* ... existing Card and CardContent JSX ... */}
      
//       <Card
//         className={`group cursor-pointer overflow-hidden bg-white/80 py-0 backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
//           isSelected
//             ? "border-primary ring-primary/20 border-2 shadow-lg ring-2"
//             : "border-border hover:border-primary/50 border hover:shadow-md"
//         } ${isDragOver ? "border-primary border-2 shadow-lg ring-2 ring-primary/20 bg-primary/5" : ""}`}
//         onClick={handleFolderClick}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         title="Double-click to open folder"
//       >
//         {/* ... rest of the component ... */}
//       </Card>

//       {/* ... Dialogs ... */}
//     </motion.div>
//   );
// };

// export default FolderCard;