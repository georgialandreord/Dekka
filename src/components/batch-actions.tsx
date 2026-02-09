import { useEffect, useState } from "react";
import { X, Move, Copy } from "lucide-react";
import { Button } from "~/components/ui/button";
import MoveDialog from "./modal/move-dialog";
import PasteDialog from "./modal/paste-dialog";
import { useLocation } from "react-router";
import { useClipboardStore } from "~/store/clipboard-store";
import toast from "react-hot-toast";

interface BatchActionsProps {
  selectedItems: Set<string>;
  folders: any[];
  files: any[];
  onClearSelection: () => void;
  onMoveComplete?: () => void;
  platform?: "dropbox" | "google_drive";
}

const BatchActions = ({
  selectedItems,
  folders,
  files,
  onClearSelection,
  onMoveComplete,
  platform,
}: BatchActionsProps) => {
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const { addToClipboard } = useClipboardStore();

  const location = useLocation();

  useEffect(() => {
    onClearSelection();
  }, [location.pathname]);

  const getSelectedItems = () => {
    const items: any[] = [];

    selectedItems.forEach((itemName) => {
      const folder = folders.find((f) => f.name === itemName);
      const file = files.find((f) => f.name === itemName);

      if (folder) {
        items.push({
          name: folder.name,
          path: folder.path,
          id: folder.id,
          type: "folder" as const,
        });
      } else if (file) {
        items.push({
          name: file.name,
          path: file.path || `/${file.name}`,
          id: file.id,
          type: "file" as const,
        });
      }
    });

    return items;
  };

  const handleBatchMove = () => {
    setShowMoveDialog(true);
  };

  const handleBatchCopy = () => {
    const itemsToCopy = Array.from(selectedItems)
      .map((itemName) => {
        const folder = folders.find((f) => f.name === itemName);
        const file = files.find((f) => f.name === itemName);

        if (folder) {
          return {
            name: folder.name,
            path: folder.path,
            id: folder.id,
            type: "folder" as const,
            platform: platform || ("dropbox" as const),
          };
        } else if (file) {
          return {
            name: file.name,
            path: file.path || `/${file.name}`,
            id: file.id,
            type: "file" as const,
            platform: platform || ("dropbox" as const),
          };
        }
        return null;
      })
      .filter((item): item is Exclude<typeof item, null> => item !== null);

    addToClipboard(itemsToCopy);
    toast.success(`${itemsToCopy.length} item(s) copied to clipboard`);
    // onClearSelection();

    // Immediately show paste dialog
    setShowPasteDialog(true);
  };

  const handleMoveComplete = () => {
    setShowMoveDialog(false);
    onClearSelection();
    onMoveComplete?.();
  };

  const handlePasteComplete = () => {
    setShowPasteDialog(false);
    onClearSelection();
    onMoveComplete?.();
  };

  if (selectedItems.size === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-primary/10 border-primary/20 mb-6 flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <span className="text-foreground font-medium">
            {selectedItems.size} item{selectedItems.size > 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="text-muted-foreground text-sm">
            {(() => {
              const selectedFolders = folders.filter((f) =>
                selectedItems.has(f.name),
              ).length;
              const selectedFiles = files.filter((f) =>
                selectedItems.has(f.name),
              ).length;
              const parts = [];
              if (selectedFolders > 0)
                parts.push(
                  `${selectedFolders} folder${selectedFolders > 1 ? "s" : ""}`,
                );
              if (selectedFiles > 0)
                parts.push(
                  `${selectedFiles} file${selectedFiles > 1 ? "s" : ""}`,
                );
              return parts.join(", ");
            })()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleBatchCopy}
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleBatchMove}
            className="flex items-center gap-2"
          >
            <Move className="h-4 w-4" />
            Move
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>

      <MoveDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        itemsToMove={getSelectedItems()}
        handleMoveComplete={handleMoveComplete}
      />

      <PasteDialog
        open={showPasteDialog}
        onOpenChange={setShowPasteDialog}
        handlePasteComplete={handlePasteComplete}
      />
    </>
  );
};

export default BatchActions;
