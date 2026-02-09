import { Skeleton } from "~/components/ui/skeleton";

export const CreditPackageCardSkeleton = () => {
  return (
    <div
      className="
        relative rounded-2xl p-4 border border-border bg-card/50
        flex items-center gap-4
      "
    >
      {/* Icon */}
      <Skeleton className="h-12 w-12 rounded-xl shrink-0" />

      {/* Middle content */}
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-44" />
      </div>

      {/* Right content */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
};
