import { Loader, Sparkles } from "lucide-react";
import { useParams } from "react-router";
import { api } from "~/trpc/react";
import { useState } from "react";
import FolderCard from "~/components/folder-card";
import FileCard from "~/components/file-card";
import { usePlatformStore } from "~/store/platform-store";
import BatchActions from "~/components/batch-actions";

const Folder = () => {
  const params = useParams();
  const platform = usePlatformStore((s) => s.currentPlatform);

  // With wildcard routing (*), all segments are captured in params['*']
  const folderPath = params["*"] || "";
  const { data: folderContents, isLoading, isFetching: isQueryIsFetching } = api.folder.getById.useQuery({
    path: folderPath,
  });
  const { data: allDecoration } = api.folderDecoration.getAll.useQuery();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const utils = api.useUtils();

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
    // Clear all other selections and select only this folder
    setSelectedItems(new Set([folderId]));
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
  };

  const handleMoveComplete = () => {
    // Refetch data to show updated state
    utils.folder.getById.invalidate({ path: folderPath });
  };

  // Filter folders and files based on .tag property
  const folders =
    folderContents?.entries.filter((item: any) => item[".tag"] === "folder") ||
    [];

  const files =
    folderContents?.entries.filter((item: any) => item[".tag"] === "file") ||
    [];

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

export default Folder;
