import React, { useState } from "react";
import { useParams } from "react-router";
import { ChevronRight, Folder, FolderOpen, Home } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

interface MoveItem {
  name: string;
  path: string;
  id: string;
  type: "file" | "folder";
}

interface MoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleMoveComplete?: any;
  itemsToMove: MoveItem[];
}

const MoveDialog = ({
  open,
  onOpenChange,
  itemsToMove,
  handleMoveComplete,
}: MoveDialogProps) => {
  const params = useParams();
  const currentPath = params["*"] || "";

  const [selectedPath, setSelectedPath] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([""]),
  );

  const utils = api.useUtils();

  // Query to get folder contents for navigation
  const { data: rootContents, isLoading: isLoadingRoot } =
    api.folder.getAll.useQuery(undefined, { enabled: open });

  // Query to get current folder contents
  const { data: currentFolderContents, isLoading: isLoadingCurrentFolder } =
    api.folder.getById.useQuery({ path: selectedPath }, { enabled: open });

  const moveItemMutation = api.folder.moveItem.useMutation({
    onError: (error) => {
      toast.error(`Failed to move item: ${error.message}`);
    },
  });

  const getFolderIcon = (path: string, isExpanded: boolean) => {
    if (path === "") {
      return <Home className="h-4 w-4" />;
    }
    return isExpanded ? (
      <FolderOpen className="h-4 w-4" />
    ) : (
      <Folder className="h-4 w-4" />
    );
  };

  const handleFolderClick = (path: string) => {
    setSelectedPath(path);

    // Toggle expanded state for folder navigation
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleMove = async () => {
    if (!selectedPath && selectedPath !== "") {
      toast.error("Please select a destination folder");
      return;
    }

    try {
      const promises = itemsToMove.map(async (item) => {
        const toPath =
          selectedPath === ""
            ? `/${item?.name}`
            : `${selectedPath}/${item?.name}`;

        return moveItemMutation.mutateAsync({
          fromPath: item.path,
          toPath,
          itemType: item.type,
          itemId: item.id,
        });
      });
      await Promise.all(promises).then(() => {
        toast.success(`Moved successfully`);
      });
      console.log("Move mutation complete", selectedPath);

      // Force complete cache invalidation to ensure fresh preview URLs
      utils.folder.getAll.invalidate();

      // Invalidate all relevant paths with both forward and trailing slash variations
      const pathsToInvalidate = new Set([currentPath, selectedPath]);

      // Add parent paths
      const sourceParentPath =
        currentPath.split("/").slice(0, -1).join("/") || "/";
      const destParentPath =
        selectedPath.split("/").slice(0, -1).join("/") || "/";
      pathsToInvalidate.add(sourceParentPath);
      pathsToInvalidate.add(destParentPath);

      // Add variations with/without leading slash
      pathsToInvalidate.forEach((path) => {
        if (path.startsWith("/")) {
          pathsToInvalidate.add(path.slice(1));
        } else if (path !== "") {
          pathsToInvalidate.add("/" + path);
        }
      });

      // Invalidate all collected paths
      pathsToInvalidate.forEach((path) => {
        utils.folder.getById.invalidate({ path });
      });

      // Additional: Invalidate any paths that contain the moved items
      itemsToMove.forEach((item) => {
        const itemDir = item.path.split("/").slice(0, -1).join("/");
        if (itemDir) {
          utils.folder.getById.invalidate({ path: itemDir });
          utils.folder.getById.invalidate({ path: "/" + itemDir });
        }
      });
      if (destParentPath !== selectedPath) {
        utils.folder.getById.invalidate({ path: destParentPath });
      }

      // If moving from current location, also refresh that
      if (itemsToMove.some((item) => item.path.startsWith(currentPath))) {
        utils.folder.getById.invalidate({ path: currentPath });
      }

      // Also refresh the destination folder if different from current
      if (selectedPath !== currentPath && selectedPath !== "") {
        utils.folder.getById.invalidate({
          path: selectedPath,
        });
      }

      onOpenChange(false);
      handleMoveComplete();
      setSelectedPath("");
    } catch (error) {
      // Error is already handled by the mutation's onError
      console.error("Move operation failed:", error);
    }
  };

  const getCurrentFolderContents = () => {
    if (selectedPath === "" || !selectedPath) {
      return rootContents?.entries || [];
    }
    return currentFolderContents?.entries || [];
  };

  const isLoadingFolders = isLoadingRoot || isLoadingCurrentFolder;
  const folderContents = getCurrentFolderContents();
  const subfolders = folderContents.filter((item) => item.isFolder);

  // Check if any item would be moved to its current location
  const isSameLocation = itemsToMove.some((item) => {
    const itemParentPath = item.path.split("/").slice(0, -1).join("/");
    const normalizedCurrentPath = selectedPath === "" ? "" : selectedPath;
    return itemParentPath === normalizedCurrentPath;
  });

  const isValidDestination = () => {
    if (!selectedPath && selectedPath !== "") return false;

    // Check if not moving to same location
    if (isSameLocation) return false;

    // Check if not moving a folder into its own subfolder
    for (const item of itemsToMove) {
      if (item.type === "folder" && selectedPath.startsWith(item.path + "/")) {
        return false;
      }
    }

    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Move{" "}
            {itemsToMove.length === 1 && itemsToMove[0]
              ? itemsToMove[0].type
              : `${itemsToMove.length} items`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Items to move summary */}
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-medium">
              Items to move:
            </h4>
            <div className="bg-muted/50 max-h-24 overflow-y-auto rounded-lg p-3">
              {itemsToMove.map((item, index) => (
                <div
                  key={item.id || index}
                  className="text-foreground flex items-center gap-2 text-sm"
                >
                  {item.type === "folder" ? (
                    <Folder className="h-3 w-3" />
                  ) : (
                    <div className="h-3 w-3 border border-current" />
                  )}
                  {item.name}
                </div>
              ))}
            </div>
          </div>

          {/* Destination folder navigation */}
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-medium">
              Select destination:
            </h4>

            {/* Breadcrumb */}
            <div className="bg-muted/30 rounded-lg p-2 text-sm">
              <div className="text-muted-foreground flex items-center gap-1">
                <Home className="h-3 w-3" />
                <span>/</span>
                {selectedPath &&
                  selectedPath
                    .split("/")
                    .filter(Boolean)
                    .map((part, index, arr) => (
                      <React.Fragment key={index}>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground">{part}</span>
                      </React.Fragment>
                    ))}
              </div>
            </div>

            {/* Folder tree */}
            <ScrollArea className="h-64 w-full rounded-lg border">
              <div className="p-2">
                {/* Root folder */}
                <button
                  onClick={() => handleFolderClick("")}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                    selectedPath === ""
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-foreground",
                  )}
                >
                  {getFolderIcon("", selectedPath === "")}
                  <span>My Drive</span>
                  {rootContents && (
                    <span className="ml-auto text-xs opacity-60">
                      {
                        rootContents.entries.filter((item) => item.isFolder)
                          .length
                      }{" "}
                      folders
                    </span>
                  )}
                </button>

                {/* Subfolders of current location */}
                {isLoadingFolders ? (
                  <div className="text-muted-foreground ml-4 flex items-center gap-2 py-1.5 text-sm">
                    <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    Loading folders...
                  </div>
                ) : (
                  subfolders.map((folder) => {
                    const isCurrentLocation = selectedPath === folder.path;
                    return (
                      <button
                        key={folder.id}
                        onClick={() => handleFolderClick(folder.path)}
                        className={cn(
                          "ml-4 flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors",
                          isCurrentLocation
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-foreground",
                        )}
                      >
                        <Folder className="h-4 w-4" />
                        <span>{folder.name}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Warning messages */}
            {isSameLocation && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                Cannot move items to their current location.
              </div>
            )}

            {itemsToMove.some(
              (item) =>
                item.type === "folder" &&
                selectedPath.startsWith(item.path + "/"),
            ) && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                Cannot move a folder into its own subfolder.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={moveItemMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={
              !isValidDestination() || moveItemMutation.isPending
              // batchMoveItemsMutation.isPending
            }
            className="bg-primary text-primary-foreground hover:bg-primary"
          >
            {/* {moveItemMutation.isPending || batchMoveItemsMutation.isPending ? ( */}
            {moveItemMutation.isPending ? (
              <>
                <div className="border-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Moving {itemsToMove.length} item
                {itemsToMove.length > 1 ? "s" : ""}...
              </>
            ) : (
              `Move ${itemsToMove.length === 1 ? "Item" : "Items"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDialog;
