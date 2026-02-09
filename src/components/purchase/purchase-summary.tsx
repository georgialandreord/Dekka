import { ArrowRight, Loader2, Zap } from 'lucide-react';
import type { PurchaseStatus } from '~/types';
import { formatUSD } from '~/helpers';
import type { Product } from '@polar-sh/sdk/models/components/product.js';
type PurchaseSummaryProps = {
    selectedPackage: Product | undefined;
    status: PurchaseStatus;
    onProceed: (selectedPackage: string) => void;
}

export const PurchaseSummary = ({ selectedPackage, status, onProceed }: PurchaseSummaryProps) => {
    if (!selectedPackage) return null;

    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-soft space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Total</span>
                    <span className="text-3xl font-semibold text-foreground">{selectedPackage.prices[0]?.amountType === "fixed" ? formatUSD(selectedPackage?.prices[0]?.priceAmount) : null}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Credits</span>
                    <div className="flex items-center gap-1.5 justify-end">
                        <Zap className="text-primary" size={20} fill="currentColor" />
                        <span className="text-2xl font-bold text-primary">{selectedPackage.benefits[0]?.type === "meter_credit" ? selectedPackage?.benefits[0]?.properties.units.toLocaleString() : null}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={() => onProceed(selectedPackage?.id)}
                disabled={status === 'processing'}
                className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-medium flex items-center justify-center gap-2 group active:scale-[0.98] cursor-pointer"
            >
                {status === 'processing' ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <span>Proceed to Checkout</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </div>
    );
};