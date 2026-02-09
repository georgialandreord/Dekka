import { Skeleton } from "~/components/ui/skeleton";

export const PurchaseSummarySkeleton = () => {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-soft space-y-5">
      {/* Top row */}
      <div className="flex items-center justify-between">
        {/* Total */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Credits */}
        <div className="space-y-2 text-right">
          <Skeleton className="h-3 w-16 ml-auto" />
          <div className="flex items-center gap-2 justify-end">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      </div>

      {/* Button */}
      <Skeleton className="h-14 w-full rounded-xl" />
    </div>
  );
};
