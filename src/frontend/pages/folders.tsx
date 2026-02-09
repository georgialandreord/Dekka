import { useEffect, useState } from "react";
import { Loader, Sparkles } from "lucide-react";
import { api } from "~/trpc/react";
import { usePlatformStore } from "~/store/platform-store";
import FolderCard from "~/components/folder-card";
import FileCard from "~/components/file-card";
import BatchActions from "~/components/batch-actions";

const Folders = () => {
  const platform = usePlatformStore((s) => s.currentPlatform);
  const {
    data: folderContents,
    isLoading,
    isFetching: isQueryIsFetching,
  } = api.folder.getAll.useQuery();
  const { data: allDecoration } = api.folderDecoration.getAll.useQuery();
  const { isFetching: platformIsFetching, endPlatformSwitch } =
    usePlatformStore();
  const utils = api.useUtils();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const folders =
    folderContents?.entries.filter((item: any) => item[".tag"] === "folder") ||
    [];

  const files =
    folderContents?.entries.filter((item: any) => item[".tag"] === "file") ||
    [];

  useEffect(() => {
    if (folders.length > 0) {
      folders.slice(0, 5).forEach((folder) => {
        utils.folder.getById.prefetch({
          path: folder.name,
        });
      });
    }
  }, [folders, utils, platform]);

  useEffect(() => {
    if (!isQueryIsFetching) {
      endPlatformSwitch();
    }
  }, [isQueryIsFetching]);

  // Show loading when either platform is switching or query is fetching
  const showLoading = isLoading || platformIsFetching;

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
    // Refetch data to show updated state
    utils.folder.getAll.invalidate();
  };

  return (
    <>
      <BatchActions
        selectedItems={selectedItems}
        folders={folders}
        files={files}
        onClearSelection={handleClearSelection}
        onMoveComplete={handleMoveComplete}
        platform={platform || "dropbox"}
      />

      {showLoading && (
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

      {!showLoading && folders.length === 0 && files.length === 0 && (
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

      {!showLoading && (folders.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 relative">
          {isQueryIsFetching ? <div className="absolute z-10 right-0 -top-8">
              <Loader className="animate-spin text-primary size-6" />
            </div> : null}
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onSelect={handleSelectItem}
              onSingleSelect={handleSingleSelectItem}
              isSelected={selectedItems.has(folder.name)}
              decorationData={allDecoration}
              onClearSelection={handleClearSelection}
            />
          ))}

          {files.map((file, index) => (
            <FileCard
              key={file.id}
              file={file}
              index={index}
              onSelect={handleSelectItem}
              onSingleSelect={handleSingleSelectItem}
              isSelected={selectedItems.has(file.name)}
              onClearSelection={handleClearSelection}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Folders;
