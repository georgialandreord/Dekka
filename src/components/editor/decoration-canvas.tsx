import React, { useCallback, useRef, useState } from "react";
import { Card } from "~/components/ui/card";
import DraggableDecoration from "./draggable-decoration";
import { BACKGROUND_PATTERN } from "~/mockdata";

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;

export default function DecorationCanvas({
  folder,
  updateDecoration,
  deleteDecoration,
  selectedDecorationId,
  setSelectedDecorationId,
  addDecoration,
  updateDecorationOrder,
}: any) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [dragOverFrameId, setDragOverFrameId] = useState(null);

  const moveItem = useCallback(
    (id: string, direction: "forward" | "backward") => {
      // Update the actual folder.decorations array
      updateDecorationOrder(id, direction);
    },
    [updateDecorationOrder],
  );

  const handleCanvasClick = (e: any) => {
    if (
      e.target === e.currentTarget ||
      e.target.classList.contains("decoration-canvas-bg")
    ) {
      setSelectedDecorationId(null);
    }
  };

  const findFrameUnderPoint = (x: number, y: number): any | null => {
    const frames =
      (folder.decorations as any[] | undefined)?.filter(
        (d) => d.type === "frame",
      ) || [];

    const hitFrames = frames.filter((f) => {
      const left = f.x;
      const top = f.y;
      const right = f.x + f.width;
      const bottom = f.y + f.height;
      return x >= left && x <= right && y >= top && y <= bottom;
    });

    if (hitFrames.length === 0) return null;

    hitFrames.sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));
    return hitFrames[0];
  };

  const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const actualX = e.clientX - rect.left;
    const actualY = e.clientY - rect.top;

    const canvasX = (actualX / rect.width) * CANVAS_WIDTH;
    const canvasY = (actualY / rect.height) * CANVAS_HEIGHT;

    const frame = findFrameUnderPoint(canvasX, canvasY);
    setDragOverFrameId(frame?.id || null);
  };

  const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const imageUrl = e.dataTransfer.getData("imageUrl");
    if (!imageUrl) {
      setDragOverFrameId(null);
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) {
      setDragOverFrameId(null);
      return;
    }

    const actualX = e.clientX - rect.left;
    const actualY = e.clientY - rect.top;

    const canvasX = (actualX / rect.width) * CANVAS_WIDTH;
    const canvasY = (actualY / rect.height) * CANVAS_HEIGHT;

    const frame = findFrameUnderPoint(canvasX, canvasY);

    if (frame) {
      updateDecoration(frame.id, { frame_content: imageUrl });
      setDragOverFrameId(null);
      return;
    }

    // Drop outside any frame → create normal decoration
    addDecoration({
      type: "sticker",
      content: imageUrl,
      width: 100,
      height: 100,
    });

    setDragOverFrameId(null);
  };

  const handleCanvasDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      setDragOverFrameId(null);
    }
  };

  const sortedDecorations = [...(folder.decorations || [])].sort(
    (a, b) => (a.zIndex || 0) - (b.zIndex || 0),
  );

  return (
    <Card
      className="relative mx-auto w-full overflow-visible py-0 shadow-2xl"
      style={{
        aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`,
        maxWidth: "750px",
        width: "100%",
      }}
    >
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        onDragLeave={handleCanvasDragLeave}
        className="decoration-canvas-bg relative h-full w-full overflow-visible"
        style={{
          backgroundColor: folder.color || "#FFB6C1",
          // backgroundImage: `url(${folder.background_pattern})`,
          backgroundImage: getBackgroundPattern(folder.background_pattern) || `url(${folder.background_pattern})`,
          // backgroundSize:`${folder.size ? folder.size : '100px'}px`
          backgroundSize:
            folder.background_pattern === "dots"
              ? "30px 30px"
              : folder.background_pattern === "hearts"
                ? "80px 80px"
                : folder.background_pattern === "palm_trees"
                  ? "100px 120px"
                  : folder.background_pattern === "wavy_zebra"
                    ? "150px 150px"
                    : folder.background_pattern === "purple_flames"
                      ? "200px 350px"
                      : folder.background_pattern === "cherries"
                        ? "150px 150px"
                        : folder.background_pattern === "leopard"
                          ? "120px 120px"
                          : folder.background_pattern === "tiger"
                            ? "80px 80px"
                            : folder.background_pattern === "zebra"
                              ? "100px 100px"
                              : folder.background_pattern === "stars"
                                ? "100px 100px"
                                : `${folder.size ? folder.size : '100px'}px`,
        }}
      >
        {sortedDecorations.map((decoration) => {
          const scaleX = 100 / CANVAS_WIDTH;
          const scaleY = 100 / CANVAS_HEIGHT;

          return (
            <div
              key={decoration.id}
              className="absolute"
              style={{
                left: `${decoration.x * scaleX}%`,
                top: `${decoration.y * scaleY}%`,
                width: `${decoration.width * scaleX}%`,
                height: `${decoration.height * scaleY}%`,
                zIndex: decoration.zIndex || 0,
                pointerEvents: "auto",
                transition: "none",
              }}
            >
              <DraggableDecoration
                decoration={decoration}
                onUpdate={updateDecoration}
                onReorder={moveItem}
                onDelete={deleteDecoration}
                canvasRef={canvasRef}
                allDecorations={folder.decorations}
                onSelect={setSelectedDecorationId}
                isSelected={selectedDecorationId === decoration.id}
                isDragOverFrame={dragOverFrameId === decoration.id}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function getBackgroundPattern(pattern: string) {
  return (
    BACKGROUND_PATTERN[pattern as keyof typeof BACKGROUND_PATTERN] || null
  );
}
