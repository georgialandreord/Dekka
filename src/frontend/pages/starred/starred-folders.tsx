import { api } from "~/trpc/react";
import { usePlatformStore } from "~/store/platform-store";
import FolderGrid from "~/components/folder-grid";
import { Sparkles } from "lucide-react";
import { useState } from "react";

const StarredFolders = () => {
  const platform = usePlatformStore((s) => s.currentPlatform);
  const utils = api.useUtils();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const {
    data: starredFolders,
    isLoading,
    isFetching: isQueryIsFetching,
  } = api.starredFolder.getAll.useQuery({platform: platform || "dropbox"});


  const folders = starredFolders?.map((starred) => ({
    id: starred.folderId,
    name: starred.folderName,
    path: starred.folderPath,
    ".tag": "folder" as const,
  })) || [];

  const { data: allDecoration } = api.folderDecoration.getAll.useQuery();

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

  return (
    <>
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

      {!isLoading && folders.length === 0 && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-purple-100 to-pink-100">
            <Sparkles className="h-16 w-16 text-purple-400" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            No starred folders yet
          </h2>
          <p className="mx-auto mb-6 max-w-md text-gray-600">
            Star your favorite folders to access them quickly!
          </p>
        </div>
      )}

      {!isLoading && folders.length > 0 && (
        <FolderGrid
          folders={folders}
          files={[]}
          isLoading={false}
          isQueryFetching={isQueryIsFetching}
          selectedItems={selectedItems}
          decorationData={allDecoration}
          onSelectItem={handleSelectItem}
          onSingleSelectItem={handleSingleSelectItem}
          onMoveComplete={() => utils.starredFolder.getAll.invalidate({platform: platform || "dropbox"},{
            exact: false
          })}
          platform={platform || "dropbox"}
          isStarredView={true}
          onClearSelection={handleClearSelection}
        />
      )}
    </>
  );
};

export default StarredFolders;
