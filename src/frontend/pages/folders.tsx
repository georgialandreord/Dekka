import { useEffect } from "react";
import { api } from "~/trpc/react";
import { usePlatformStore } from "~/store/platform-store";
import { useFolderContent } from "~/hooks/use-folder-content";
import FolderGrid from "~/components/folder-grid";

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

  const {
    selectedItems,
    folders,
    files,
    handleSelectItem,
    handleSingleSelectItem,
    handleClearSelection,
    handleMoveComplete,
  } = useFolderContent(folderContents, () => utils.folder.getAll.invalidate());

  useEffect(() => {
    if (folders.length > 0) {
      folders.slice(0, 10).forEach((folder) => {
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
  }, [isQueryIsFetching, endPlatformSwitch]);

  const showLoading = isLoading || platformIsFetching;

  return (
    <FolderGrid
      folders={folders}
      files={files}
      isLoading={showLoading}
      isQueryFetching={isQueryIsFetching}
      selectedItems={selectedItems}
      decorationData={allDecoration}
      onSelectItem={handleSelectItem}
      onSingleSelectItem={handleSingleSelectItem}
      onClearSelection={handleClearSelection}
      onMoveComplete={handleMoveComplete}
      platform={platform || "dropbox"}
    />
  );
};

export default Folders;
