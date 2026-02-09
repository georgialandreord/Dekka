import { cn } from "~/lib/utils";

interface FolderIconProps {
  color?: "coral" | "teal" | "purple" | "gold" | "mint";
  size?: "sm" | "md" | "lg" | "xl";
  emoji?: string;
  className?: string;
}

const colorClasses = {
  coral: "bg-[hsl(12,85%,60%)]",
  teal: "bg-[hsl(175,60%,45%)]",
  purple: "bg-[hsl(265,60%,60%)]",
  gold: "bg-[hsl(40,90%,55%)]",
  mint: "bg-[hsl(160,50%,50%)]",
};

const sizeClasses = {
  sm: "w-12 h-10",
  md: "w-16 h-14",
  lg: "w-24 h-20",
  xl: "w-32 h-28",
};

const emojiSizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-5xl",
};

export function FolderIcon({
  color = "coral",
  size = "md",
  emoji,
  className,
}: FolderIconProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Folder back */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl opacity-80",
          colorClasses[color],
          sizeClasses[size]
        )}
        style={{ transform: "translateY(-8%) scale(0.85)" }}
      />

      {/* Folder tab */}
      <div
        className={cn(
          "absolute top-1 left-0 w-2/5 h-3 rounded-t-lg",
          colorClasses[color]
        )}
        style={{ transform: "translateY(-100%)" }}
      />

      {/* Folder front */}
      <div
        className={cn(
          "relative rounded-xl rounded-tl-none flex items-center justify-center",
          colorClasses[color],
          sizeClasses[size]
        )}
      >
        {emoji && (
          <span className={cn("drop-shadow-sm", emojiSizes[size])}>
            {emoji}
          </span>
        )}
      </div>
    </div>
  );
}
