import { Sparkles, Info } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { EFFECTS } from "~/mockdata";

const EffectsPanel = ({
  folder,
  selectedDecorationId,
  updateDecoration,
}: any) => {
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
            <div className="border-border bg-muted mb-6 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                <p className="text-foreground text-sm font-semibold">
                  Selected
                </p>
              </div>
              <p className="text-muted-foreground text-xs">
                Type:{" "}
                <span className="font-medium">{selectedDecoration.type}</span>
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Click effects to toggle on/off
              </p>
            </div>

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
                  <h4
                    className={`flex items-center gap-2 text-base font-bold ${
                      hasEffect(effect.id)
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {effect.name}
                    {hasEffect(effect.id) && (
                      <span className="bg-primary-foreground/20 rounded-full px-2 py-1 text-xs font-medium">
                        Active
                      </span>
                    )}
                  </h4>
                  <p
                    className={`mt-1 text-sm ${
                      hasEffect(effect.id)
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {effect.description}
                  </p>
                </div>
              </button>
            ))}

            {selectedDecoration.effects &&
              selectedDecoration.effects.length > 0 && (
                <div className="border-success/20 bg-success/10 mt-6 rounded-lg border p-4">
                  <p className="text-success-foreground text-sm font-medium">
                    ✓ {selectedDecoration.effects.length} effect
                    {selectedDecoration.effects.length > 1 ? "s" : ""} active
                  </p>
                </div>
              )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
export default EffectsPanel;
