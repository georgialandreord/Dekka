import { useState } from "react";
import { api } from "~/trpc/react";

interface FolderEntry {
  id: string;
  name: string;
  ".tag": "folder" | "file";
}

interface FolderContentData {
  entries: FolderEntry[];
}

export const useFolderContent = (
  folderContentData: FolderContentData | undefined,
  onDataRefetch: () => void
) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const folders =
    folderContentData?.entries.filter((item: any) => item[".tag"] === "folder") ||
    [];

  const files =
    folderContentData?.entries.filter((item: any) => item[".tag"] === "file") ||
    [];

  const handleSelectItem = (folderId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleSingleSelectItem = (folderId: string) => {
    setSelectedItems(new Set([folderId]));
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  const handleMoveComplete = () => {
    onDataRefetch();
  };

  return {
    selectedItems,
    folders,
    files,
    handleSelectItem,
    handleSingleSelectItem,
    handleClearSelection,
    handleMoveComplete,
  };
};
