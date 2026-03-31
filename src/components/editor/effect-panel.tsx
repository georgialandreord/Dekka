import { Sparkles, Info } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { EFFECTS } from "~/mockdata";

const EFFECT_COLORS = [
  "#fbbf24", // Yellow
  "#ec4899", // Pink
  "#3b82f6", // Blue
  "#10b981", // Green
  "#8b5cf6", // Purple
  "#ef4444", // Red
  "#ffffff", // White
];

const EffectsPanel = ({ folder, selectedDecorationId, updateDecoration }: any) => {
  const selectedDecoration = folder.decorations?.find(
    (d: { id: any }) => d.id === selectedDecorationId,
  );

  const toggleEffect = (effectId: string) => {
    if (!selectedDecoration) return;

    const currentEffects = selectedDecoration.effects || [];
    const hasEffect = currentEffects.includes(effectId);

    const newEffects = hasEffect
      ? currentEffects.filter((e: string) => e !== effectId)
      : [...currentEffects, effectId];

    updateDecoration(selectedDecorationId, { effects: newEffects });
  };

  const handleColorChange = (type: 'sparkle' | 'glitter', color: string) => {
    if (!selectedDecoration) return;
    
    if (type === 'sparkle') {
      updateDecoration(selectedDecorationId, { sparkleColor: color });
    } else {
      updateDecoration(selectedDecorationId, { glitterColor: color });
    }
  };

  const hasEffect = (effectId: string) => {
    return selectedDecoration?.effects?.includes(effectId) || false;
  };

  return (
    <div className="border-border bg-card/90 flex w-80 flex-col border-l backdrop-blur-lg">
      <div className="border-border border-b p-6">
        <h3 className="text-foreground flex items-center gap-2 text-xl font-bold">
          <Sparkles className="text-primary h-5 w-5" />
          Effects
        </h3>
      </div>

      <ScrollArea className="flex-1 p-6">
        {!selectedDecoration ? (
          <Alert className="border-border bg-muted">
            <Info className="text-primary h-4 w-4" />
            <AlertDescription className="text-foreground text-sm">
              Click on any decoration on the canvas to select it, then click
              effects below to apply them
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            
            {/* Sparkle Color Picker - Shows only when Sparkles is active */}
            {hasEffect("sparkles") && (
              <div className="border-border bg-yellow-50 dark:bg-yellow-950/20 mb-4 rounded-lg border p-4">
                <h4 className="text-foreground mb-3 text-sm font-semibold flex items-center gap-2">
                   ✨ Sparkle Color
                </h4>
                <div className="flex flex-wrap gap-2">
                  {EFFECT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange('sparkle', color)}
                      className={`h-8 w-8 rounded-full transition-all hover:scale-110 ${
                        (selectedDecoration.sparkleColor || "#fbbf24") === color
                          ? "ring-2 ring-purple-600 ring-offset-2 scale-110"
                          : "border border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Glitter Color Picker - Shows only when Glitter is active */}
            {hasEffect("glitter") && (
              <div className="border-border bg-pink-50 dark:bg-pink-950/20 mb-4 rounded-lg border p-4">
                <h4 className="text-foreground mb-3 text-sm font-semibold flex items-center gap-2">
                   💖 Glitter Color
                </h4>
                <div className="flex flex-wrap gap-2">
                  {EFFECT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange('glitter', color)}
                      className={`h-8 w-8 rounded-full transition-all hover:scale-110 ${
                        (selectedDecoration.glitterColor || "#ec4899") === color
                          ? "ring-2 ring-purple-600 ring-offset-2 scale-110"
                          : "border border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Existing Selected Decoration Info */}
            <div className="border-border bg-muted mb-6 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                <p className="text-foreground text-sm font-semibold">Selected</p>
              </div>
              <p className="text-muted-foreground text-xs">
                Type: <span className="font-medium">{selectedDecoration.type}</span>
              </p>
            </div>

            {/* Effects List */}
            {EFFECTS.map((effect) => (
              <button
                key={effect.id}
                onClick={() => toggleEffect(effect.id)}
                className={`flex w-full cursor-pointer items-start gap-4 rounded-xl p-5 transition-all duration-200 hover:scale-[1.02] ${
                  hasEffect(effect.id)
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "border-border bg-card hover:bg-accent/80 border"
                }`}
              >
                {/* ... keep existing effect button UI ... */}
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl ${
                    hasEffect(effect.id)
                      ? "bg-primary-foreground/20"
                      : "bg-accent"
                  }`}
                >
                  {effect.preview}
                </div>
                <div className="flex-1 text-left">
                  <h4 className={`flex items-center gap-2 text-base font-bold ${
                      hasEffect(effect.id) ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {effect.name}
                    {hasEffect(effect.id) && (
                      <span className="bg-primary-foreground/20 rounded-full px-2 py-1 text-xs font-medium">
                        Active
                      </span>
                    )}
                  </h4>
                  <p className={`mt-1 text-sm ${
                      hasEffect(effect.id) ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {effect.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default EffectsPanel;