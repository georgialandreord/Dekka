import { Check } from 'lucide-react';
import type { ThemeName } from '~/contexts/ThemeContext';
import { cn } from '~/lib/utils';

interface ThemeCardProps {
  name: ThemeName;
  displayName: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  isActive: boolean;
  onClick: () => void;
}

export function ThemeCard({
  displayName,
  description,
  colors,
  isActive,
  onClick,
}: ThemeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border-2 bg-card p-4 text-left transition-all duration-300 hover:shadow-theme-card-hover',
        isActive
          ? 'border-primary shadow-theme-card'
          : 'border-border hover:border-primary/50'
      )}
    >
      {/* Color preview */}
      <div className="mb-4 flex gap-2">
        <div
          className="h-12 w-12 rounded-lg shadow-sm transition-transform group-hover:scale-105"
          style={{ backgroundColor: colors.primary }}
        />
        <div
          className="h-12 w-12 rounded-lg shadow-sm transition-transform group-hover:scale-105"
          style={{ backgroundColor: colors.secondary }}
        />
        <div
          className="h-12 w-12 rounded-lg shadow-sm transition-transform group-hover:scale-105"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="h-12 w-12 rounded-lg border shadow-sm transition-transform group-hover:scale-105"
          style={{ backgroundColor: colors.background }}
        />
      </div>

      {/* Theme info */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">{displayName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Active indicator */}
        <div
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full transition-all',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'border-2 border-border bg-background'
          )}
        >
          {isActive && <Check className="h-4 w-4" />}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}