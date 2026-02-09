import { Loader2, Palette } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Label } from "~/components/ui/label";
import {
  NEUTRAL_COLORS,
  PASTEL_COLORS,
  PATTERN_DATA,
  PRESET_COLORS,
} from "~/mockdata";
import { api } from "~/trpc/react";

type BackgroundPanelProps = {
  folder: any;
  updateFolder: (updates: any) => void;
};

const BackgroundPanel = ({ folder, updateFolder }: BackgroundPanelProps) => {
  const { data: patterns, isLoading: isPatternLoading } = api.backgroundPattern.getAllPatterns.useQuery();
  return (
    <div className="border-border bg-card/90 flex w-80 flex-col border-l backdrop-blur-lg">
      <div className="border-border border-b p-6">
        <h3 className="text-foreground flex items-center gap-2 text-xl font-bold">
          <Palette className="text-primary h-5 w-5" />
          Background
        </h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Vibrant Colors</Label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateFolder({ color })}
                  className={`aspect-square w-full cursor-pointer rounded-xl transition-all duration-200 ${folder.color === color
                    ? "scale-95 ring-4 ring-purple-600 ring-offset-2"
                    : "hover:scale-105 hover:shadow-md"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Pastel Colors</Label>
            <div className="grid grid-cols-5 gap-2">
              {PASTEL_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateFolder({ color })}
                  className={`aspect-square w-full cursor-pointer rounded-xl border transition-all duration-200 ${folder.color === color
                    ? "ring-primary scale-95 shadow-lg ring-4 ring-offset-2"
                    : "border-muted-foreground/20 hover:scale-105 hover:shadow-md"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Neutral Colors</Label>
            <div className="grid grid-cols-5 gap-2">
              {NEUTRAL_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateFolder({ color })}
                  className={`aspect-square w-full cursor-pointer rounded-xl border transition-all duration-200 ${folder.color === color
                    ? "ring-primary scale-95 shadow-lg ring-4 ring-offset-2"
                    : "border-muted-foreground/30 hover:scale-105 hover:shadow-md"
                    }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Pattern</Label>

            {isPatternLoading ? (
              <Loader2 className="animate-spin text-primary" />
            )  : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    updateFolder({ background_pattern: "none" })
                  }
                  className={`cursor-pointer rounded-xl p-4 text-sm font-medium transition-all duration-200 ${folder.background_pattern === "none"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-foreground hover:bg-accent"
                    }`}
                >
                  none
                </button>

                {PATTERN_DATA.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() =>
                    updateFolder({ background_pattern: pattern.id })
                  }
                  className={`cursor-pointer rounded-xl p-4 text-sm font-medium transition-all duration-200 ${
                    folder.background_pattern === pattern.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-foreground hover:bg-accent"
                  }`}
                >
                  {pattern.name?.slice(0, 16)}
                </button>
              ))}
                {patterns?.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() =>
                      updateFolder({ background_pattern: pattern.fileUrl,size:pattern.size })
                    }
                    className={`cursor-pointer rounded-xl p-4 text-sm font-medium transition-all duration-200 ${folder.background_pattern === pattern.fileUrl
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-muted text-foreground hover:bg-accent"
                      }`}
                  >
                    {pattern.filename?.slice(0, 16)}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </ScrollArea>
    </div>
  );
};

export default BackgroundPanel;
