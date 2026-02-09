import { useState } from "react";
import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";

const PRESET_COLORS = [
  "#FFB6C1",
  "#E6A8D7",
  "#C8B6FF",
  "#B6D7FF",
  "#B6FFD7",
  "#FFE6B6",
  "#FFB6B6",
  "#D7B6FF",
  "#B6FFE6",
  "#E6B6FF",
];

const CreateFolderDialog = ({ open, onClose }: any) => {
  const [folderName, setFolderName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  // Get current path from URL params
  const params = useParams();
  const currentPath = params["*"] || "";

  const utils = api.useUtils();
  const createFolderMutation = api.folder.createFolder.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);

      // Invalidate and refetch the current folder's data
      utils.folder.getById.invalidate({ path: currentPath });
      utils.folder.getAll.invalidate();
      utils.folderDecoration.getAll.invalidate();

      // Reset form and close dialog
      setFolderName("");
      setSelectedColor(PRESET_COLORS[0]);
      onClose();
    },
    onError: (error) => {
      toast.error(`Failed to create folder: ${error.message}`);
    },
  });

  const handleCreate = () => {
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    createFolderMutation.mutate({
      folderName: folderName.trim(),
      parentPath: currentPath,
      color: selectedColor,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl font-bold">
            Create New Folder
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <div className="bg-background border-border focus-within:border-primary/80 focus-within:ring-primary/10 focus-within:bg-background flex items-center rounded-lg border px-3 py-2.5 transition-all duration-200 ease-out focus-within:ring-[3px]">
              <input
                id="folder-name"
                placeholder="My Awesome Folder"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreate()}
                className="w-full text-foreground placeholder-muted-foreground text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Folder Color</Label>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`aspect-square w-full rounded-xl transition-all duration-200 ${
                    selectedColor === color
                      ? "scale-110 ring-4 ring-purple-600 ring-offset-2"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!folderName.trim() || createFolderMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary cursor-pointer"
          >
            {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CreateFolderDialog;
