import { Check } from 'lucide-react';
import Image from 'next/image';
import { STYLE_VISUALS } from '~/mockdata';
import type { Style } from '~/types';

interface StyleCardProps {
  style: Style;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const StyleCard = ({ style, isSelected, onSelect }: StyleCardProps) => {
  const visual = STYLE_VISUALS[style.id];

  return (
    <button
      onClick={() => onSelect(style.id)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-300 ease-out text-left ${
        isSelected 
          ? 'border-primary bg-primary/5 scale-[0.98] ring-4 ring-primary/10' 
          : 'border-border hover:border-primary/30 bg-card shadow-sm hover:shadow-md'
      }`}
    >
      <div className="aspect-square w-full overflow-hidden relative">
        {/* <img 
          src={visual?.image} 
          alt={`${style.name} style preview`}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isSelected ? 'scale-110' : 'group-hover:scale-105'
          }`}
        /> */}
        <Image src={visual?.image} alt={`${style.name} style preview`} className={`w-full h-full object-cover transition-transform duration-500 ${
            isSelected ? 'scale-110' : 'group-hover:scale-105'
          }`}/>
        
        <div className={`absolute inset-0 transition-opacity duration-300 ${
          isSelected ? 'bg-primary/10' : 'bg-foreground/5 group-hover:bg-transparent'
        }`} />
        
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg z-10 animate-in zoom-in-50 duration-300">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      
      <div className="p-3 bg-card border-t border-border/50">
        <span className={`text-xs font-semibold tracking-tight block truncate transition-colors ${
          isSelected ? 'text-primary' : 'text-foreground'
        }`}>
          {style.name}
        </span>
      </div>
    </button>
  );
};

export default StyleCard;