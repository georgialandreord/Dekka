import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CreditPackageCard } from '~/components/purchase/credit-package-card';
import type { PurchaseStatus } from '~/types';
import { VisualShowcase } from '~/components/purchase/visual-showcase';
import { PurchaseSummary } from '~/components/purchase/purchase-summary';
import { api } from '~/trpc/react';
import { CreditPackageCardSkeleton } from '~/components/skeleton/credit-package-card-skeleton';
import { authClient } from '~/server/better-auth/client';

const BuyCredits = () => {
    const { data: productList, isLoading: isProductListLoading } = api.polar.getProducts.useQuery();
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [status, setStatus] = useState<PurchaseStatus>('idle');

    const selectedPackage = productList?.find(p => p.id === selectedId);

    const handleProceed = async (id: string) => {
        try {
            setStatus("processing")
            await authClient.checkout({
                products: [id],
            })
        } catch (error) {
            setStatus("idle")
            console.log("ERROR", error)
        } finally {
            setStatus('idle')
        }
    };

    const handleReset = () => {
        setStatus('idle');
    };

    useEffect(() => {
        if (isProductListLoading === false) {
            setSelectedId(productList?.[1]?.id)
        }
    }, [isProductListLoading, productList])

    return (
        <div className="flex flex-col bg-background h-screen">
            <main className="flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto w-full px-6 py-5 gap-12 lg:gap-16 items-center">
                {/* Left Side: Purchase Section */}
                <div className="w-full flex flex-col gap-8">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={14} />
                            <span>Credit Packages</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Package</span>
                        <div className="flex flex-col gap-3">
                            {isProductListLoading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <CreditPackageCardSkeleton key={index} />
                                ))
                            ) : !productList?.length ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <div className="text-5xl mb-4">📦</div>
                                    <h3 className="text-xl font-semibold mb-2">No packages found</h3>
                                    <p className="text-sm max-w-sm">
                                        No credit packages available at the moment. Please check back later.
                                    </p>
                                </div>
                            ) : (
                                productList?.slice().reverse().map((pkg) => (
                                    <CreditPackageCard
                                        key={pkg.id}
                                        pkg={pkg}
                                        isSelected={selectedId === pkg.id}
                                        onSelect={() => setSelectedId(pkg.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {
                        productList && productList?.length > 0 &&
                        <PurchaseSummary
                            selectedPackage={selectedPackage}
                            status={status}
                            onProceed={handleProceed}
                        />
                    }

                </div>

                {/* Right Side: Visual Showcase */}
                <div className="w-full flex justify-center lg:justify-end">
                    <div className="w-full max-w-md lg:max-w-lg">
                        <VisualShowcase />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BuyCredits;
