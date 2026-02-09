import React, { useState, useRef, useEffect } from "react";
import { Trash2, ArrowUp, ArrowDown, RotateCw } from "lucide-react";
import { FRAME_COLORS } from "~/mockdata";

const CANVAS_WIDTH_LOGICAL = 1200;
const CANVAS_HEIGHT_LOGICAL = 900;

// Define types for the decoration object
interface Decoration {
  id: string;
  type: "sticker" | "photo" | "text" | "frame";
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex?: number;
  effects?: string[];
  frame_style?: "star" | "polaroid" | "heart" | "circle" | "default";
  frame_content?: string;
  frame_color?: string;
  font_family?: string;
  font_color?: string;
  // NEW: inner content transform (relative to frame)
  frame_content_offset_x?: number; // percentage or px
  frame_content_offset_y?: number;
  frame_content_scale?: number; // 1 = fit, >1 zoom
}

// Define types for component props
interface DraggableDecorationProps {
  decoration: Decoration;
  onUpdate: (id: string, updates: Partial<Decoration>) => void;
  onDelete: (id: string) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  allDecorations: Decoration[];
  onSelect: (id: string) => void;
  isSelected: boolean;
  isDragOverFrame?: boolean;
  onReorder?: (id: string, direction: "forward" | "backward") => void;
}

export default function DraggableDecoration({
  decoration,
  onUpdate,
  onDelete,
  canvasRef,
  allDecorations,
  onSelect,
  isSelected,
  isDragOverFrame,
  onReorder,
}: DraggableDecorationProps) {
  console.log(decoration, "decoration");
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isInnerDragging, setIsInnerDragging] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0, x: 0, y: 0 });
  const startMousePos = useRef({ x: 0, y: 0 });
  const rotationCenter = useRef({ x: 0, y: 0 });
  const innerDrag = useRef({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest(".control-handle") ||
        e.target.closest(".floating-toolbar"))
    ) {
      return;
    }
    e.stopPropagation();
    onSelect(decoration.id);
  };

  const handleResizeMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    handle: string,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    startSize.current = {
      width: decoration.width,
      height: decoration.height,
      x: decoration.x,
      y: decoration.y,
    };
    startMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleRotateMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);

    if (canvasRef.current) {
      const canvas = canvasRef.current.getBoundingClientRect();
      const actualDecorationX =
        (decoration.x / CANVAS_WIDTH_LOGICAL) * canvas.width;
      const actualDecorationY =
        (decoration.y / CANVAS_HEIGHT_LOGICAL) * canvas.height;
      const actualDecorationWidth =
        (decoration.width / CANVAS_WIDTH_LOGICAL) * canvas.width;
      const actualDecorationHeight =
        (decoration.height / CANVAS_HEIGHT_LOGICAL) * canvas.height;

      rotationCenter.current = {
        x: canvas.left + actualDecorationX + actualDecorationWidth / 2,
        y: canvas.top + actualDecorationY + actualDecorationHeight / 2,
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest(".control-handle") ||
        e.target.closest(".floating-toolbar"))
    ) {
      return;
    }

    e.stopPropagation();
    setIsDragging(true);

    if (canvasRef.current) {
      const canvas = canvasRef.current.getBoundingClientRect();
      const actualX = (decoration.x / CANVAS_WIDTH_LOGICAL) * canvas.width;
      const actualY = (decoration.y / CANVAS_HEIGHT_LOGICAL) * canvas.height;

      dragOffset.current = {
        x: e.clientX - canvas.left - actualX,
        y: e.clientY - canvas.top - actualY,
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && canvasRef.current) {
      const canvas = canvasRef.current.getBoundingClientRect();
      const actualX = e.clientX - canvas.left - dragOffset.current.x;
      const actualY = e.clientY - canvas.top - dragOffset.current.y;
      const canvasX = (actualX / canvas.width) * CANVAS_WIDTH_LOGICAL;
      const canvasY = (actualY / canvas.height) * CANVAS_HEIGHT_LOGICAL;
      onUpdate(decoration.id, {
        x: canvasX,
        y: canvasY,
        frame_color: decoration.frame_color,
        frame_content: decoration.frame_content,
        frame_content_offset_x: decoration.frame_content_offset_x,
        frame_content_offset_y: decoration.frame_content_offset_y,
        frame_content_scale: decoration.frame_content_scale,
      });
    } else if (isResizing && resizeHandle) {
      const canvas = canvasRef.current?.getBoundingClientRect();
      if (!canvas) return;

      const deltaX = e.clientX - startMousePos.current.x;
      const deltaY = e.clientY - startMousePos.current.y;
      const canvasDeltaX = (deltaX / canvas.width) * CANVAS_WIDTH_LOGICAL;
      const canvasDeltaY = (deltaY / canvas.height) * CANVAS_HEIGHT_LOGICAL;

      let updates: Partial<Decoration> = {};

      if (resizeHandle.includes("e")) {
        updates.width = Math.max(50, startSize.current.width + canvasDeltaX);
      }
      if (resizeHandle.includes("w")) {
        const newWidth = Math.max(50, startSize.current.width - canvasDeltaX);
        updates.width = newWidth;
        updates.x = startSize.current.x + (startSize.current.width - newWidth);
      }
      if (resizeHandle.includes("s")) {
        updates.height = Math.max(50, startSize.current.height + canvasDeltaY);
      }
      if (resizeHandle.includes("n")) {
        const newHeight = Math.max(50, startSize.current.height - canvasDeltaY);
        updates.height = newHeight;
        updates.y =
          startSize.current.y + (startSize.current.height - newHeight);
      }

      onUpdate(decoration.id, updates);
    } else if (isRotating) {
      const angle = Math.atan2(
        e.clientY - rotationCenter.current.y,
        e.clientX - rotationCenter.current.x,
      );
      const degrees = (angle * 180) / Math.PI + 90;
      onUpdate(decoration.id, { rotation: degrees });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    setResizeHandle(null);
  };

  const handleInnerMouseDown = (e: React.MouseEvent) => {
    if (decoration.type !== "frame" || !decoration.frame_content) return;
    e.stopPropagation(); // do not move whole frame

    setIsInnerDragging(true);
    innerDrag.current = { x: e.clientX, y: e.clientY };
    onUpdate(decoration.id, { frame_color: "" });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (decoration.type !== "frame" || !decoration.frame_content) return;
    e.preventDefault();

    const currentScale = decoration.frame_content_scale ?? 1;
    const delta = e.deltaY < 0 ? 0.05 : -0.05;

    const MIN_SCALE = 0.5;
    const MAX_SCALE = 3;
    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, currentScale + delta),
    );
    // const nextScale = Math.min(Math.max(0.5, currentScale + delta), 3);

    onUpdate(decoration.id, { frame_content_scale: nextScale });
  };

  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, decoration, resizeHandle, canvasRef]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (decoration.type === "sticker" || decoration.type === "photo") {
      e.dataTransfer.setData("imageUrl", decoration.content || "");
      e.dataTransfer.effectAllowed = "copy";
    }
  };

  useEffect(() => {
    const moveInner = (e: MouseEvent) => {
      if (!isInnerDragging) return;

      const dx = e.clientX - innerDrag.current.x;
      const dy = e.clientY - innerDrag.current.y;

      innerDrag.current = { x: e.clientX, y: e.clientY };

      const offsetX = (decoration.frame_content_offset_x ?? 0) + dx;
      const offsetY = (decoration.frame_content_offset_y ?? 0) + dy;

      console.log(offsetX, offsetX, "axis");

      onUpdate(decoration.id, {
        frame_content_offset_x: offsetX,
        frame_content_offset_y: offsetY,
      });
    };

    const stopInner = () => {
      if (isInnerDragging) setIsInnerDragging(false);
    };

    window.addEventListener("mousemove", moveInner);
    window.addEventListener("mouseup", stopInner);

    return () => {
      window.removeEventListener("mousemove", moveInner);
      window.removeEventListener("mouseup", stopInner);
    };
  }, [
    isInnerDragging,
    decoration.id,
    decoration.frame_content_offset_x,
    decoration.frame_content_offset_y,
    onUpdate,
  ]);

  const bringForward = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Tell parent: "move this item one position up in the array"
    onReorder?.(decoration.id, "forward");
  };

  const sendBackward = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Tell parent: "move this item one position down in the array"
    onReorder?.(decoration.id, "backward");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent parent elements from handling the drop
    setIsDraggingOver(false);

    if (decoration.type === "frame") {
      const imageUrl = e.dataTransfer.getData("imageUrl");
      if (imageUrl) {
        console.log(
          "Dropping image into frame:",
          decoration.id,
          "URL:",
          imageUrl,
        );
        onUpdate(decoration.id, {
          frame_content: imageUrl,
          frame_content_scale: 1,
        });
        console.log("Update called with frame_content:", imageUrl);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent parent elements from handling dragOver
    if (decoration.type === "frame") {
      setIsDraggingOver(true);
      e.stopPropagation();
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (decoration.type === "frame") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <>
      {isSelected && (
        <div
          className="floating-toolbar absolute -top-14 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-lg"
          style={{
            pointerEvents: "auto",
            zIndex: 1000,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <p>{decoration.zIndex}</p>
          <button
            onClick={bringForward}
            onMouseDown={(e) => e.stopPropagation()}
            className="relative z-1000 rounded-lg p-2 transition-colors hover:bg-gray-100"
            title="Bring Forward"
          >
            <ArrowUp className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={sendBackward}
            onMouseDown={(e) => e.stopPropagation()}
            className="relative z-1000 rounded-lg p-2 transition-colors hover:bg-gray-100"
            title="Send Backward"
          >
            <ArrowDown className="h-4 w-4 text-gray-700" />
          </button>

          {decoration.type === "frame" && (
            <>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex gap-1 px-2">
                {FRAME_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdate(decoration.id, { frame_color: color });
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`h-6 w-6 rounded-full transition-all ${(decoration.frame_color || FRAME_COLORS[0]) === color
                        ? "scale-110 ring-2 ring-purple-600 ring-offset-2"
                        : "hover:scale-110"
                      }`}
                    style={{
                      backgroundColor: color,
                      border:
                        color === "#ffffff" ? "2px solid #e5e7eb" : "none",
                    }}
                    title="Frame Color"
                  />
                ))}
              </div>
            </>
          )}

          {/* <div className="h-6 w-px bg-gray-200" /> */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(decoration.id);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      )}

      <div
        ref={elementRef}
        onClick={handleClick}
        onMouseDown={decoration.type !== "frame" ? handleMouseDown : undefined}
        draggable={
          (decoration.type === "sticker" || decoration.type === "photo") &&
          !isDragging &&
          !isResizing &&
          !isRotating
        }
        onDragStart={handleDragStart}
        className={`h-full w-full cursor-move transition-all duration-200 select-none ${isSelected ? "ring-2 ring-purple-400 ring-inset" : ""
          } ${isDraggingOver && decoration.type === "frame" ? "ring-4 ring-blue-500" : ""}`}
        style={{
          transform: `rotate(${decoration.rotation || 0}deg)`,
        }}
      >
        {decoration.effects?.includes("sparkles") && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "2s",
                }}
              >
                <div
                  className="h-3 w-3 rounded-full bg-yellow-400 shadow-lg"
                  style={{
                    boxShadow: "0 0 10px #fbbf24",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {decoration.effects?.includes("glitter") && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-visible">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1.5s",
                }}
              >
                <div
                  className="h-2 w-2 rounded-full bg-pink-400 shadow-lg"
                  style={{
                    boxShadow: "0 0 8px #ec4899",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        <div
          className={`h-full w-full ${decoration.effects?.includes("retro_sticker") ? "p-[8%]" : ""
            } ${decoration.effects?.includes("holographic") ? "animate-pulse" : ""
            }`}
          style={{
            filter: [
              decoration.effects?.includes("shadow")
                ? "drop-shadow(0 10px 15px rgba(0,0,0,0.3))"
                : "",
              decoration.effects?.includes("neon_glow")
                ? "drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))"
                : "",
              decoration.effects?.includes("holographic")
                ? "hue-rotate(0deg)"
                : "",
            ]
              .filter(Boolean)
              .join(" "),
            animation: decoration.effects?.includes("holographic")
              ? "rainbow 3s linear infinite"
              : "none",
          }}
        >
          {decoration.effects?.includes("retro_sticker") && (
            <div
              className="absolute inset-0 rounded-lg bg-white"
              style={{
                boxShadow: "0 4px 6px rgba(0,0,0,0.2), inset 0 0 0 6px white",
              }}
            />
          )}

          {decoration.type === "sticker" && (
            <img
              src={decoration.content}
              alt=""
              className={`pointer-events-none relative z-10 h-full w-full object-contain ${decoration.effects?.includes("retro_sticker")
                  ? "drop-shadow-md"
                  : ""
                }`}
              draggable={false}
            />
          )}

          {decoration.type === "text" && (
            <div
              className="pointer-events-none flex h-full w-full items-center justify-center"
              style={{
                fontFamily: decoration.font_family || "Arial",
                color: decoration.font_color || "#000000",
                fontSize: `${decoration.width * 0.12}px`,
                fontWeight: "bold",
                textAlign: "center",
                wordWrap: "break-word",
                padding: "8px",
                lineHeight: "1.2",
              }}
            >
              {decoration.content}
            </div>
          )}

          {decoration.type === "photo" && (
            <div className="relative z-10 h-full w-full">
              <img
                src={decoration.content}
                alt=""
                className={`pointer-events-none h-full w-full rounded-lg object-cover ${decoration.effects?.includes("retro_sticker")
                    ? "drop-shadow-md"
                    : ""
                  }`}
                draggable={false}
              />
            </div>
          )}

          {decoration.type === "frame" && (
            <div
              className="relative h-full w-full"
              onMouseDown={handleMouseDown}
              onWheel={handleWheel}
            >
              {decoration.content === "star" ? (
                <div className="relative h-full w-full">
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e25a4bb3cd572cc9ec987b/80c6feb75_image.png"
                    alt="star frame"
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    draggable={false}
                    style={{
                      zIndex: 1,
                      filter:
                        decoration.frame_color &&
                          decoration.frame_color !== "#000000" &&
                          decoration.frame_color !== "#ffffff"
                          ? `brightness(0) saturate(100%) invert(0%) sepia(100%) hue-rotate(${getHueRotation(decoration.frame_color)}deg) brightness(1.2) contrast(1.2)`
                          : decoration.frame_color === "#ffffff"
                            ? `brightness(0) saturate(100%) invert(100%) sepia(0%) hue-rotate(0deg) brightness(1.2) contrast(1.2)`
                            : decoration.frame_color === "#000000"
                              ? "brightness(0)"
                              : "none",
                    }}
                  />
                  <div
                    className={`absolute inset-[15%] flex items-center justify-center overflow-hidden bg-white transition-all ${isDraggingOver ? "scale-95" : ""}`}
                    style={{ pointerEvents: "auto", zIndex: 0 }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onWheel={handleWheel}
                  >
                    {decoration.frame_content ? (
                      <img
                        src={decoration.frame_content}
                        alt="Frame content"
                        className="h-full w-full origin-center object-cover"
                        style={{
                          transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%
            scale(${decoration.frame_content_scale ?? 1})
          `,
                          cursor: "grab",
                        }}
                        onMouseDown={handleInnerMouseDown}
                        draggable={false}
                      />
                    ) : (
                      <div className="p-2 text-center">
                        <span className="block text-xs font-medium text-gray-400">
                          Drop Image Here
                        </span>
                        <span className="text-[10px] text-gray-300">
                          Drag sticker or photo
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : decoration.content === "polaroid" ? (
                <div
                  className="relative h-full w-full shadow-2xl"
                  style={{
                    backgroundColor: decoration.frame_color || "#ffffff",
                    border: `12px solid ${decoration.frame_color || "#ffffff"}`,
                  }}
                >
                  <div
                    className={`absolute inset-3 flex items-center justify-center overflow-hidden transition-all ${isDraggingOver ? "scale-95" : ""}`}
                    style={{ bottom: "50px", pointerEvents: "auto" }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {decoration.frame_content ? (
                      <img
                        src={decoration.frame_content}
                        alt="Frame content"
                        className="h-full w-full origin-center object-cover"
                        style={{
                          transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                          cursor: "grab",
                        }}
                        onMouseDown={handleInnerMouseDown}
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-purple-50 to-pink-50 p-2 text-center">
                        <span className="block text-xs font-medium text-gray-400">
                          Drop Image Here
                        </span>
                        <span className="text-[10px] text-gray-300">
                          Drag sticker or photo
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : decoration.content === "heart" ? (
                <div className="relative h-full w-full">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 h-full w-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <clipPath
                        id={`heart-clip-${decoration.id}`}
                        clipPathUnits="objectBoundingBox"
                        transform="scale(0.01 0.01)"
                      >
                        <path d="M50,90 C50,90 10,65 10,40 C10,25 20,15 32.5,15 C40,15 45,20 50,27.5 C55,20 60,15 67.5,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z" />
                      </clipPath>
                    </defs>
                    <path
                      d="M50,90 C50,90 10,65 10,40 C10,25 20,15 32.5,15 C40,15 45,20 50,27.5 C55,20 60,15 67.5,15 C80,15 90,25 90,40 C90,65 50,90 50,90 Z"
                      fill="none"
                      stroke={decoration.frame_color || "#ec4899"}
                      strokeWidth="3"
                      filter="drop-shadow(0 4px 12px rgba(0,0,0,0.2))"
                    />
                  </svg>
                  <div
                    className={`absolute inset-[5%] flex items-center justify-center transition-all ${isDraggingOver ? "scale-95" : ""}`}
                    style={{
                      pointerEvents: "auto",
                      clipPath: `url(#heart-clip-${decoration.id})`,
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {decoration.frame_content ? (
                      <img
                        src={decoration.frame_content}
                        alt="Frame content"
                        className="h-full w-full origin-center object-cover"
                        style={{
                          transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                          cursor: "grab",
                        }}
                        onMouseDown={handleInnerMouseDown}
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-pink-50 to-purple-50">
                        <div className="text-center">
                          <span className="block text-sm font-medium text-pink-400">
                            Drop Image
                          </span>
                          <span className="text-xs text-pink-300">
                            Drag sticker or photo
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : decoration.content === "circle" ? (
                <div
                  className="relative h-full w-full overflow-hidden rounded-full shadow-2xl"
                  style={{
                    backgroundColor: decoration.frame_color || "#ffffff",
                    border: `12px solid ${decoration.frame_color || "#ffffff"}`,
                  }}
                >
                  <div
                    className={`absolute inset-3 flex items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-purple-50 to-pink-50 transition-all ${isDraggingOver ? "scale-95" : ""}`}
                    style={{ pointerEvents: "auto" }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {decoration.frame_content ? (
                      <img
                        src={decoration.frame_content}
                        alt="Frame content"
                        className="h-full w-full origin-center object-cover"
                        style={{
                          transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                          cursor: "grab",
                        }}
                        onMouseDown={handleInnerMouseDown}
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-linear-to-br from-purple-50 to-pink-50 p-2 text-center">
                        <span className="block text-xs font-medium text-gray-400">
                          Drop Image Here
                        </span>
                        <span className="text-[10px] text-gray-300">
                          Drag sticker or photo
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="relative h-full w-full rounded-lg shadow-2xl"
                  style={{
                    backgroundColor: decoration.frame_color || "#ffffff",
                    border: `12px solid ${decoration.frame_color || "#ffffff"}`,
                  }}
                >
                  <div
                    className={`absolute inset-3 flex items-center justify-center overflow-hidden rounded bg-linear-to-br from-purple-50 to-pink-50 transition-all ${isDraggingOver ? "scale-95" : ""}`}
                    style={{ pointerEvents: "auto" }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {decoration.frame_content ? (
                      <img
                        src={decoration.frame_content}
                        alt="Frame content"
                        className="h-full w-full origin-center object-cover"
                        style={{
                          transform: `
            translate(${decoration.frame_content_offset_x ?? 0}%,
                      ${decoration.frame_content_offset_y ?? 0}%)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                          cursor: "grab",
                        }}
                        onMouseDown={handleInnerMouseDown}
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center rounded bg-linear-to-br from-purple-50 to-pink-50 p-2 text-center">
                        <span className="block text-xs font-medium text-gray-400">
                          Drop Image Here
                        </span>
                        <span className="text-[10px] text-gray-300">
                          Drag sticker or photo
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* {decoration.type === "frame" && (
            <div
              className="relative h-full w-full overflow-hidden rounded-2xl border-4 bg-white"
              style={{ borderColor: decoration.frame_color || FRAME_COLORS[0] }}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
            >
              {decoration.frame_content ? (
                <img
                  src={decoration.frame_content}
                  alt="Frame content"
                  className="h-full w-full origin-center object-cover"
                  style={{
                    transform: `
            translate(${decoration.frame_content_offset_x ?? 0}px,
                      ${decoration.frame_content_offset_y ?? 0}px)
            scale(${decoration.frame_content_scale ?? 1})
          `,
                    cursor: "grab",
                  }}
                  onMouseDown={handleInnerMouseDown}
                  draggable={false}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-center text-xs text-gray-500">
                  <span>Drop image here</span>
                  <span className="mt-1 text-[10px]">
                    Drag sticker or photo into this frame
                  </span>
                </div>
              )}
            </div>
          )} */}
        </div>

        <style jsx>{`
          @keyframes rainbow {
            0% {
              filter: hue-rotate(0deg) saturate(1.5) brightness(1.1);
            }
            33% {
              filter: hue-rotate(120deg) saturate(1.5) brightness(1.1);
            }
            66% {
              filter: hue-rotate(240deg) saturate(1.5) brightness(1.1);
            }
            100% {
              filter: hue-rotate(360deg) saturate(1.5) brightness(1.1);
            }
          }
        `}</style>
      </div>

      {/* Resize handles */}
      {isSelected && (
        <>
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
            className="control-handle absolute -top-2 -left-2 h-4 w-4 cursor-nw-resize rounded-full border-2 border-purple-400 bg-white transition-transform hover:scale-125"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
            className="control-handle absolute -top-2 -right-2 h-4 w-4 cursor-ne-resize rounded-full border-2 border-purple-400 bg-white transition-transform hover:scale-125"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
            className="control-handle absolute -bottom-2 -left-2 h-4 w-4 cursor-sw-resize rounded-full border-2 border-purple-400 bg-white transition-transform hover:scale-125"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
            className="control-handle absolute -right-2 -bottom-2 h-4 w-4 cursor-se-resize rounded-full border-2 border-purple-400 bg-white transition-transform hover:scale-125"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          />

          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "n")}
            className="control-handle absolute -top-1 left-1/2 h-2 w-8 -translate-x-1/2 cursor-n-resize rounded border-2 border-purple-400 bg-white transition-transform hover:scale-110"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "s")}
            className="control-handle absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 cursor-s-resize rounded border-2 border-purple-400 bg-white transition-transform hover:scale-110"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "w")}
            className="control-handle absolute top-1/2 -left-1 h-8 w-2 -translate-y-1/2 cursor-w-resize rounded border-2 border-purple-400 bg-white transition-transform hover:scale-110"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          />
          <div
            onMouseDown={(e) => handleResizeMouseDown(e, "e")}
            className="control-handle absolute top-1/2 -right-1 h-8 w-2 -translate-y-1/2 cursor-e-resize rounded border-2 border-purple-400 bg-white transition-transform hover:scale-110"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          />

          <div
            onMouseDown={handleRotateMouseDown}
            className="control-handle absolute -bottom-12 left-1/2 flex h-10 w-10 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-purple-400 bg-white shadow-lg transition-colors hover:bg-purple-50"
            style={{ pointerEvents: "auto", zIndex: 9999 }}
          >
            <RotateCw className="h-5 w-5 text-purple-600" />
          </div>
        </>
      )}
    </>
  );
}

function getHueRotation(color: string): number {
  const colorMap: Record<string, number> = {
    "#ec4899": 320, // pink (base color, close to 320-330)
    "#8b5cf6": 260, // purple
    "#3b82f6": 220, // blue
    "#10b981": 140, // green
    "#f59e0b": 40, // orange
    "#ef4444": 0, // red
  };
  return colorMap[color] || 0;
}
