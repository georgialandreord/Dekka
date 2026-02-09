import { ScrollArea } from "~/components/ui/scroll-area";
import type { DecorationInput } from "~/frontend/pages/foldereditor/folder-editor";
import { FRAMES } from "~/mockdata";

type FramesPanelProps = {
  onAddFrame: (decoration: DecorationInput) => void;
};

export default function FramesPanel({ onAddFrame }: FramesPanelProps) {
  return (
    <div className="border-border bg-card/90 flex w-80 flex-col border-l backdrop-blur-lg">
      <div className="border-border border-b p-6">
        <h3 className="text-foreground text-xl font-bold">Frames</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4">
          {FRAMES.map((frame) => (
            <button
              key={frame.id}
              onClick={() =>
                onAddFrame({
                  type: "frame",
                  content: frame.id,
                  frame_style: frame.id,
                  width: 250,
                  height: 250,
                })
              }
              className="bg-muted hover:bg-accent flex aspect-square flex-col items-center justify-center gap-2 rounded-xl p-6 transition-all duration-200 hover:scale-105"
            >
              <frame.icon className="text-primary h-12 w-12" />
              <span className="text-foreground text-sm font-medium">
                {frame.name}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
