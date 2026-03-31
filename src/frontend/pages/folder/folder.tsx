import { useParams } from "react-router";
import { api } from "~/trpc/react";
import { usePlatformStore } from "~/store/platform-store";
import { useFolderContent } from "~/hooks/use-folder-content";
import FolderGrid from "~/components/folder-grid";

const Folder = () => {
  const params = useParams();
  const platform = usePlatformStore((s) => s.currentPlatform);

  // With wildcard routing (*), all segments are captured in params['*']
  const folderPath = params["*"] || "";
  const {
    data: folderContents,
    isLoading,
    isFetching: isQueryIsFetching,
  } = api.folder.getById.useQuery({
    path: folderPath,
  });
  const { data: allDecoration } = api.folderDecoration.getAll.useQuery();

  const utils = api.useUtils();

  const {
    selectedItems,
    folders,
    files,
    handleSelectItem,
    handleSingleSelectItem,
    handleClearSelection,
    handleMoveComplete,
  } = useFolderContent(folderContents, () =>
    utils.folder.getById.invalidate({ path: folderPath })
  );

  return (
    <FolderGrid
      folders={folders}
      files={files}
      isLoading={isLoading}
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

export default Folder;
