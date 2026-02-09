import { useState } from "react";
import { Lock, Sparkles, Search, Loader2 } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { THEME } from "~/mockdata";
import { api, type RouterOutputs } from "~/trpc/react";
import type { DecorationInput } from "~/frontend/pages/foldereditor/folder-editor";

type StickerPack = RouterOutputs["sticker"]["getAllStickers"][number];

const mergedByName = (packs: StickerPack[]): StickerPack[] => {
  const map = new Map<string, StickerPack>();

  for (const pack of packs) {
    if (!map.has(pack.name)) {
      // clone to avoid mutating original
      map.set(pack.name, {
        ...pack,
        stickers: [...pack.stickers],
      });
    } else {
      const existing = map.get(pack.name)!;
      existing.stickers.push(...pack.stickers);
    }
  }

  return Array.from(map.values());
};

type StickerPanelProps = {
  onAddSticker: (decoration: DecorationInput) => void;
};

export default function StickerPanel({ onAddSticker }: StickerPanelProps) {
  const [activeTheme, setActiveTheme] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stickers = [], isLoading } =
    api.sticker.getAllStickers.useQuery();

  const mergedPacks = mergedByName(stickers);

  const canAccessPack = (pack: StickerPack) => {
    return pack.isFree;
  };

  const filteredPacks = mergedPacks.filter((pack) => {
    const matchesTheme = activeTheme === "all" || pack.theme === activeTheme;
    const matchesSearch =
      searchQuery === "" ||
      pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  return (
    <div className="border-border bg-card/90 flex w-80 flex-col overflow-hidden border-l backdrop-blur-lg">
      <div className="border-border shrink-0 border-b p-6">
        <h3 className="text-foreground mb-4 flex items-center gap-2 text-xl font-bold">
          <Sparkles className="text-primary h-5 w-5" />
          Stickers
        </h3>

        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search stickers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border focus:border-primary pl-9"
          />
        </div>
      </div>

      <Tabs
        value={activeTheme}
        onValueChange={setActiveTheme}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList className="m-4 grid grid-cols-4 gap-1">
          {THEME.slice(0, 4).map((theme) => (
            <TabsTrigger key={theme} value={theme} className="text-xs">
              {theme === "tattoo_flash"
                ? "Tattoo"
                : theme.charAt(0).toUpperCase() + theme.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : null}

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6 pb-6">
            {filteredPacks?.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                No stickers found
              </div>
            ) : (
              filteredPacks?.map((pack) => (
                <div key={pack.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground text-sm font-semibold">
                      {pack.name}
                    </h4>
                    {!canAccessPack(pack) && (
                      <Lock className="text-muted-foreground h-4 w-4" />
                    )}
                  </div>

                  {canAccessPack(pack) ? (
                    <div className="grid grid-cols-3 gap-2">
                      {pack.stickers?.map((sticker, idx) => (
                        <img
                          key={idx}
                          src={sticker.url}
                          alt={sticker.name}
                          draggable="true"
                          onDragStart={(e) => {
                            e.dataTransfer.setData("imageUrl", sticker.url);
                            e.dataTransfer.effectAllowed = "copy";
                          }}
                          onClick={() =>
                            onAddSticker({
                              type: "sticker",
                              content: sticker.url,
                              width: 80,
                              height: 80,
                            })
                          }
                          className="bg-muted hover:bg-accent aspect-square cursor-grab rounded-lg object-contain p-2 transition-colors duration-200 hover:scale-105 active:cursor-grabbing"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/50 text-muted-foreground border-border rounded-lg border p-4 text-center text-sm">
                      Purchase this pack from the Marketplace to use these
                      stickers
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
