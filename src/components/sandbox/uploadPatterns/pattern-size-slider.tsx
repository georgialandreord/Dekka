import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";

interface PatternSizeSliderProps {
  size: number;
  onSizeChange: (size: number) => void;
  fileName: string;
}

export default function PatternSizeSlider({
  size,
  onSizeChange,
  fileName,
}: PatternSizeSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">Pattern Size</Label>
        <span className="text-muted-foreground text-xs">{size}%</span>
      </div>
      <Slider
        value={[size]}
        onValueChange={(value: number[]) => onSizeChange(value[0] || 100)}
        max={200}
        min={10}
        step={5}
        className="w-full"
        aria-label={`Adjust size for ${fileName}`}
      />
    </div>
  );
}
