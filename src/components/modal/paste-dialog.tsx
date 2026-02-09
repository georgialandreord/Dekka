import React, { useState } from "react";
import { useParams } from "react-router";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  Home,
  Clipboard,
} from "lucide-react";
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
import { useClipboardStore } from "~/store/clipboard-store";
interface PasteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handlePasteComplete?: any;
}

const PasteDialog = ({
  open,
  onOpenChange,
  handlePasteComplete,
}: PasteDialogProps) => {
  const params = useParams();
  const currentPath = params["*"] || "";

  const [selectedPath, setSelectedPath] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([""]),
  );
  const [isPasting, setIsPasting] = useState(false);

  const {
    items: clipboardItems,
    clearClipboard,
  } = useClipboardStore();
  const utils = api.useUtils();

  // Queries for navigation (matching MoveDialog logic)
  const { data: rootContents, isLoading: isLoadingRoot } = api.folder.getAll.useQuery(
    undefined,
    { enabled: open },
  );

  const { data: currentFolderContents, isLoading: isLoadingCurrentFolder } = api.folder.getById.useQuery(
    { path: selectedPath },
    { enabled: open },
  );

  const pasteItemsMutation = api.folder.copyItem.useMutation({
    onError: (error) => {
      // Errors are handled in the handlePaste loop
      console.error("Mutation error:", error);
    },
  });

  // Helper functions matching MoveDialog
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

  const getCurrentFolderContents = () => {
    if (selectedPath === "" || !selectedPath) {
      return rootContents?.entries || [];
    }
    return currentFolderContents?.entries || [];
  };

  const isLoadingFolders = isLoadingRoot || isLoadingCurrentFolder;
  const folderContents = getCurrentFolderContents();
  const subfolders = folderContents.filter((item) => item.isFolder);

  const handlePaste = async () => {
    if (clipboardItems.length === 0) return;

    setIsPasting(true);
    let successCount = 0;
    const errors: string[] = [];

    try {
      // Get existing items in destination to check for conflicts initially
      const destinationData = await utils.folder.getById.fetch({
        path: selectedPath,
      });
      
      // Create a local mutable list of existing items to track what we've pasted in this loop
      // This prevents the race condition where Item B checks the DB before Item A is finished
      let knownExistingItems = destinationData?.entries || [];

      // Process items sequentially (one by one) instead of in parallel
      for (const clipboardItem of clipboardItems) {
        try {
          // Generate unique name based on the *current* known state
          let uniqueName = clipboardItem.name;
          let suffix = 1;

          while (knownExistingItems.some((item) => item.name === uniqueName)) {
            const lastDot = uniqueName.lastIndexOf(".");
            if (lastDot > -1) {
              uniqueName =
                uniqueName.substring(0, lastDot) +
                ` (${suffix})` +
                uniqueName.substring(lastDot);
            } else {
              uniqueName = uniqueName + ` (${suffix})`;
            }
            suffix++;
          }

          // Construct destination path
          const destPath =
            selectedPath === ""
              ? `/${uniqueName}`
              : `${selectedPath}/${uniqueName}`;

          // Await the mutation to ensure this file finishes before the next starts
          const result = await pasteItemsMutation.mutateAsync({
            fromPath: clipboardItem.path,
            toPath: destPath,
            itemType: clipboardItem.type,
            itemId: clipboardItem.id,
          });

          // If successful, add this new item to our local known list so the next loop iteration handles duplicates correctly
          if (result?.success) {
            knownExistingItems.push({
              name: uniqueName,
              path: destPath,
              id: result.copiedItem?.id || "temp",
              isFolder: clipboardItem.type === "folder",
              ".tag": "file"
            });
            successCount++;
          } else {
            errors.push(
              `Failed to paste ${clipboardItem.name}: ${result?.message || "Unknown error"}`,
            );
          }
        } catch (err: any) {
          console.error(`Error pasting ${clipboardItem.name}:`, err);
          errors.push(
            `Failed to paste ${clipboardItem.name}: ${err.message || "Unknown error"}`,
          );
        }
      }

      // Final summary
      if (successCount > 0) {
        toast.success(`${successCount} item(s) pasted successfully`);
        
        // Invalidate queries to refresh UI
        utils.folder.getById.invalidate({ path: currentPath });
        utils.folder.getById.invalidate({ path: selectedPath });
        utils.folder.getAll.invalidate();
        utils.folderDecoration.getAll.invalidate();

        clearClipboard();
        onOpenChange(false);
        handlePasteComplete?.();
      }

      // Show errors if any occurred
      if (errors.length > 0) {
        errors.forEach((msg) => toast.error(msg));
      }
    } catch (error) {
      console.error("Paste operation failed:", error);
      toast.error("Paste operation failed. Please try again.");
    } finally {
      setIsPasting(false);
    }
  };

  // Check if trying to paste folder into its own subfolder
  const isRecursivePaste = clipboardItems.some((item) => {
    return (
      item.type === "folder" && selectedPath.startsWith(item.path + "/")
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clipboard className="h-5 w-5" />
            Paste Items
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Items to paste summary (Similar to MoveDialog's summary) */}
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-medium">
              Items to paste:
            </h4>
            <div className="bg-muted/50 max-h-24 overflow-y-auto rounded-lg p-3">
              {clipboardItems.map((item, index) => (
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

          {/* Destination folder navigation (Mirroring MoveDialog structure) */}
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
             {isRecursivePaste && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                Cannot paste a folder into its own subfolder.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPasting}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePaste}
            disabled={isPasting || clipboardItems.length === 0 || isRecursivePaste}
            className="bg-primary text-primary-foreground hover:bg-primary"
          >
            {isPasting ? (
              <>
                <div className="border-primary-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Pasting...
              </>
            ) : (
              `Paste ${clipboardItems.length} item${clipboardItems.length > 1 ? "s" : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasteDialog;
