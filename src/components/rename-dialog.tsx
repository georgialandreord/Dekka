import { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemType: "folder" | "file";
  onRename: (newName: string) => void;
  isRenaming?: boolean;
}

export function RenameDialog({
  open,
  onOpenChange,
  itemName,
  itemType,
  onRename,
  isRenaming = false,
}: RenameDialogProps) {
  const [newName, setNewName] = useState(itemName);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== itemName.trim()) {
      onRename(newName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            Rename {itemType}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              New name
            </label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enter new ${itemType} name`}
              className="w-full"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isRenaming}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={
                !newName.trim() ||
                newName.trim() === itemName.trim() ||
                isRenaming
              }
            >
              <Check className="mr-2 h-4 w-4" />
              {isRenaming ? "Renaming..." : "Rename"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
