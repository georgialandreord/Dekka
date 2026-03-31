import { Loader, Sparkles } from "lucide-react";
import FolderCard from "~/components/folder-card";
import FileCard from "~/components/file-card";
import BatchActions from "~/components/batch-actions";
import type { PLATFORM } from "~/server/lib/file-system-client";

interface FolderEntry {
  id: string;
  name: string;
  ".tag": "folder" | "file";
}

interface FolderGridProps {
  folders: FolderEntry[];
  files: FolderEntry[];
  isLoading: boolean;
  isQueryFetching: boolean;
  selectedItems: Set<string>;
  decorationData: any;
  onSelectItem: (folderId: string) => void;
  onSingleSelectItem: (folderId: string) => void;
  onClearSelection: () => void;
  onMoveComplete: () => void;
  platform: PLATFORM;
  isStarredView?: boolean;
}

const FolderGrid = ({
  folders,
  files,
  isLoading,
  isQueryFetching,
  selectedItems,
  decorationData,
  onSelectItem,
  onSingleSelectItem,
  onClearSelection,
  onMoveComplete,
  platform,
  isStarredView = false,
}: FolderGridProps) => {
  return (
    <>
      <BatchActions
        selectedItems={selectedItems}
        folders={folders}
        files={files}
        onClearSelection={onClearSelection}
        onMoveComplete={onMoveComplete}
        platform={platform}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
        </div>
      )}

      {!isLoading && folders.length === 0 && files.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-purple-100 to-pink-100">
            <Sparkles className="h-16 w-16 text-purple-400" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            No folders yet
          </h2>
          <p className="mx-auto mb-6 max-w-md text-gray-600">
            Create your first decorated folder and start personalizing!
          </p>
        </div>
      )}

      {!isLoading && (folders.length > 0 || files.length > 0) && (
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isQueryFetching && (
            <div className="absolute right-0 -top-8 z-10">
              <Loader className="size-6 animate-spin text-primary" />
            </div>
          )}
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onSelect={onSelectItem}
              onSingleSelect={onSingleSelectItem}
              isSelected={selectedItems.has(folder.name)}
              decorationData={decorationData}
              onClearSelection={onClearSelection}
              selectedItems={selectedItems}
              folders={folders}
              files={files}
              isStarredView={isStarredView}
            />
          ))}

          {files.map((file, index) => (
            <FileCard
              key={file.id}
              file={file}
              index={index}
              onSelect={onSelectItem}
              onSingleSelect={onSingleSelectItem}
              isSelected={selectedItems.has(file.name)}
              onClearSelection={onClearSelection}
              selectedItems={selectedItems}
              folders={folders}
              files={files}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default FolderGrid;
