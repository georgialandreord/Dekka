import { ArrowLeft, Loader2, Save } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import BackgroundPanel from "~/components/editor/background-panel";
import DecorationCanvas from "~/components/editor/decoration-canvas";
import EditorToolbar from "~/components/editor/edit-toolbar";
import EffectsPanel from "~/components/editor/effect-panel";
import FramesPanel from "~/components/editor/frames-panel";
import PhotoUploadPanel from "~/components/editor/photo-upload-panel";
import StickerPanel from "~/components/editor/sticker-panel";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

// Type definitions
interface Decoration {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  effects: string[];
  sparkleColor?: string;
  glitterColor?: string;
  zIndex: number;
  type: string;
  content: string;
  frame_style?: string;
  frame_color?: string;
  frame_content?: string;
  frame_content_offset_x?: number;
  frame_content_offset_y?: number;
  frame_content_scale?: number;
}

export interface FolderData {
  id?: string;
  name?: string;
  color?: string;
  background_pattern?: string;
  size?: number;
  backgroundPattern?: string;
  decorations: Decoration[];
  thumbnail?: string;
  created_date?: string;
  updated_date?: string;
  isSample?: boolean;
  dropboxFolderId?: string;
  createdBy?: string;
}

export interface DecorationInput {
  type: string;
  content: string;
  width?: number;
  height?: number;
  frame_style?: string;
  frame_color?: string;
  frame_content?: string;
  frame_content_offset_x?: number;
  frame_content_offset_y?: number;
  frame_content_scale?: number;
}

const FolderEditor = () => {
  const navigate = useNavigate();
  const [foldername] = useQueryState("name", parseAsString);
  const [folderId] = useQueryState("id", parseAsString);
  const utils = api.useUtils();

  const [folder, setFolder] = useState<FolderData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activePanel, setActivePanel] = useState<string | null>("stickers");
  const [selectedDecorationId, setSelectedDecorationId] = useState<
    string | null | undefined
  >(null);

  // Query for existing decoration - must be before useEffect
  const { data: existingDecoration, isLoading: isLoadingDecoration } =
    api.folderDecoration.getByDropboxFolderId.useQuery({
      dropboxFolderId: folderId || "",
    });

  const selectedDecoration = folder?.decorations?.find(
    (d: Decoration) => d.id === selectedDecorationId,
  );

  useEffect(() => {
    // Load existing decoration data when the component mounts or folderId changes
    if (existingDecoration && folderId) {
      console.log(existingDecoration, "existingDecoration")
      setFolder((prev: any) => ({
        name: existingDecoration.name,
        color: existingDecoration.color,
        background_pattern: existingDecoration.backgroundPattern,
        size: existingDecoration.backgroundPatternSize,
        decorations: existingDecoration.decorations || [],
        ...prev, // Preserve any existing state
      }));
      setIsLoading(false);
    } else if (
      existingDecoration === null &&
      !isLoadingDecoration &&
      folderId
    ) {
      // No existing decoration found, but query is complete - initialize with defaults
      setFolder((prev: FolderData | null) => ({
        name: prev?.name || foldername || "Untitled Folder",
        color: prev?.color || "#FFB6C1",
        background_pattern: prev?.background_pattern || "none",
        size: prev?.size,
        decorations: prev?.decorations || [],
        ...prev, // Preserve any existing state
      }));
      setIsLoading(false);
    } else if (!folderId) {
      setIsLoading(false);
    }
  }, [existingDecoration, folderId, isLoadingDecoration, foldername]);

  const addDecoration = (decoration: DecorationInput) => {
    const defaultWidth =
      decoration.type === "frame" ? 200 : decoration.width || 150;
    const defaultHeight =
      decoration.type === "frame" ? 200 : decoration.height || 150;

    // Canvas dimensions are hardcoded as 1200x900 in DecorationCanvas,
    // so we use those values to center the new decoration.
    const canvasWidth = 1200;
    const canvasHeight = 900;

    const newDecoration = {
      id: `decoration-${Date.now()}-${Math.random()}`,
      x: canvasWidth / 2 - defaultWidth / 2,
      y: canvasHeight / 2 - defaultHeight / 2,
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0,
      effects: [],
      zIndex:
        Math.max(
          ...(folder?.decorations || []).map((d: Decoration) => d.zIndex || 0),
          0,
        ) + 1,
      ...decoration,
      type: decoration.type,
      content: decoration.content,
      frame_style: decoration.frame_style,
      frame_color: decoration.frame_color,
      frame_content: decoration.frame_content,
      frame_content_offset_x: decoration.frame_content_offset_x,
      frame_content_offset_y: decoration.frame_content_offset_y,
      frame_content_scale: decoration.frame_content_scale,
    };

    updateFolder({
      decorations: [...(folder?.decorations || []), newDecoration],
    });
    setSelectedDecorationId(existingDecoration?.id);
  };

  const updateFolder = (updates: Partial<FolderData>) => {
    setFolder((prev: FolderData | null): FolderData | null => {
      if (!prev) return updates as FolderData;
      return { ...prev, ...updates };
    });
  };

  const updateDecoration = (
    decorationId: string,
    updates: { x: number; y: number } | Partial<Decoration>,
  ) => {
    console.log(
      "updateDecoration called for:",
      decorationId,
      "with updates:",
      updates,
    );
    const updatedDecorations = folder?.decorations?.map((d: Decoration) =>
      d.id === decorationId ? { ...d, ...updates } : d,
    );
    console.log(
      "Updated decoration:",
      updatedDecorations?.find((d: Decoration) => d.id === decorationId),
    );
    updateFolder({
      decorations: updatedDecorations,
    });
  };

  const updateDecorationOrder = (
    decorationId: string,
    direction: "forward" | "backward",
  ) => {
    const decorations = [...(folder?.decorations || [])];
    const index = decorations.findIndex((d) => d.id === decorationId);

    if (index === -1) return;

    if (direction === "forward" && index < decorations.length - 1) {
      // Swap with next item
      const temp = decorations[index]!;
      decorations[index] = decorations[index + 1]!;
      decorations[index + 1] = temp;
    } else if (direction === "backward" && index > 0) {
      // Swap with previous item
      const temp = decorations[index]!;
      decorations[index] = decorations[index - 1]!;
      decorations[index - 1] = temp;
    }

    // Update ALL decorations with new zIndex = array index + 1
    const updatedDecorations = decorations.map((decoration, idx) => ({
      ...decoration,
      zIndex: idx + 1, // zIndex matches visual order (1-based)
    }));

    updateFolder({
      decorations: updatedDecorations,
    });
  };

  const deleteDecoration = (decorationId: string) => {
    updateFolder({
      decorations: folder?.decorations?.filter(
        (d: Decoration) => d.id !== decorationId,
      ),
    });
    if (selectedDecorationId === decorationId) {
      setSelectedDecorationId(null);
    }
  };

  const saveFolderDcoration = api.folderDecoration.save.useMutation({
    onSuccess: () => {
      toast.success("Folder decoration saved successfully!");
      setIsSaving(false);

      // Invalidate and refetch the decorations data
      if (folderId) {
        utils.folderDecoration.getByDropboxFolderId.invalidate({
          dropboxFolderId: folderId,
        });
      }
      utils.folderDecoration.getAll.invalidate();

      // Optionally navigate back to dashboard
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(`Failed to save folder decoration: ${error.message}`);
      setIsSaving(false);
    },
  });

  const handleSave = async () => {
    if (!folderId) return;
    if (!foldername) return;

    console.log(folder?.decorations, "save");

    setIsSaving(true);

    saveFolderDcoration.mutate({
      folderId: folderId!, // Non-null assertion since we checked above
      backgroundPattern: folder?.background_pattern || "none",
      backgroundPatternSize: folder?.size,
      color: folder?.color || "#FFB6C1",
      name: foldername,
      decorations: folder?.decorations || [],
    });
  };

  // Early return if no folderId
  if (!folderId) {
    return (
      <div className="from-accent/30 to-primary/10 flex h-screen items-center justify-center bg-linear-to-br">
        <div className="text-center">
          <p className="text-muted-foreground">No folder ID provided</p>
        </div>
      </div>
    );
  }

  // Show loading state while fetching existing decoration
  if (isLoading || isLoadingDecoration) {
    return (
      <div className="from-accent/30 to-primary/10 flex h-screen items-center justify-center bg-linear-to-br">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-2">
            Loading folder decoration...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="from-accent/30 to-primary/10 flex h-screen flex-col bg-linear-to-br">
      <header className="bg-white/90 flex shrink-0 items-center justify-between px-4 py-4 backdrop-blur-lg m-2 rounded-2xl">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="
      group
      flex items-center gap-2
      rounded-full
      px-4 py-2
      text-sm font-medium
      text-muted-foreground
      transition-all
      hover:bg-accent hover:text-foreground
      active:scale-95
      focus-visible:ring-2 focus-visible:ring-ring
    "
          >
            <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
          </Button>

          <div>
            <h1 className="text-xl font-bold text-foreground">{foldername}</h1>
          </div>
        </div>


        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <EditorToolbar
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div
            className="flex-1 overflow-auto p-4"
          //   onClick={handleBackgroundClick}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <DecorationCanvas
                folder={
                  folder || {
                    name: foldername || "Untitled Folder",
                    color: "#FFB6C1",
                    background_pattern: "none",
                    size: 100,
                    backgroundPattern: "none",
                    decorations: [],
                    id: folderId || undefined,
                    dropboxFolderId: folderId || undefined,
                    thumbnail: undefined,
                    created_date: undefined,
                    updated_date: undefined,
                    isSample: false,
                    createdBy: undefined,
                  }
                }
                updateDecoration={updateDecoration}
                deleteDecoration={deleteDecoration}
                selectedDecorationId={selectedDecorationId}
                setSelectedDecorationId={setSelectedDecorationId}
                updateDecorationOrder={updateDecorationOrder}
              />
            </div>
          </div>

          <div className="h-full overflow-y-auto m-2 rounded-2xl">
            {activePanel === "stickers" && (
              <StickerPanel onAddSticker={addDecoration} />
            )}

            {activePanel === "photos" && (
              <PhotoUploadPanel onAddPhoto={addDecoration} />
            )}

            {activePanel === "frames" && (
              <FramesPanel onAddFrame={addDecoration} />
            )}

            {activePanel === "effects" && folder && (
              <EffectsPanel
                folder={folder}
                selectedDecorationId={selectedDecorationId}
                updateDecoration={updateDecoration}
              />
            )}

            {activePanel === "background" && folder && (
              <BackgroundPanel folder={folder} updateFolder={updateFolder} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderEditor;
