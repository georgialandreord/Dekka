import { Check, Zap } from 'lucide-react';
import type { Product } from '@polar-sh/sdk/models/components/product.js';
import { formatUSD } from '~/helpers';

type CreditPackageCardProps = {
    pkg: Product;
    isSelected: boolean;
    onSelect: () => void;
}

export const CreditPackageCard = ({ pkg, isSelected, onSelect }: CreditPackageCardProps) => {
    return (
        <div
            onClick={onSelect}
            className={`
        relative cursor-pointer transition-all duration-300 rounded-2xl p-4 border flex items-center gap-4 group
        ${isSelected
                    ? 'bg-card border-primary shadow-medium ring-2 ring-primary/10'
                    : 'bg-card/50 border-border hover:border-primary/30 hover:bg-card hover:shadow-soft'
                }
      `}
        >
            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primary text-white shadow-soft' : 'bg-secondary text-muted-foreground'
                }`}>
                <Zap size={20} fill={isSelected ? "currentColor" : "none"} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold uppercase tracking-wide transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                        {pkg.name}
                    </h3>
                </div>
                <p className={`text-xl font-black ${isSelected ? 'text-primary' : 'text-muted-foreground'} leading-none mt-1`}>
                    {pkg.benefits[0]?.type === "meter_credit" ? pkg.benefits[0]?.properties?.units.toLocaleString() : null} <span className="text-xs font-medium text-muted-foreground">credits</span>
                </p>
            </div>

            <div className="text-right shrink-0">
                <p className={`text-lg font-bold ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {pkg.prices[0]?.amountType === "fixed" ? formatUSD(pkg.prices[0]?.priceAmount) : null}
                </p>
                <div className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center mt-1 transition-all duration-300 ${isSelected ? 'text-white border-primary bg-primary' : 'border-2 border-border'
                    }`}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
            </div>
        </div>
    );
};