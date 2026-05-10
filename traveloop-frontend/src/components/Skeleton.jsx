import { cn } from '@/utils/helpers';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-800", className)}
      {...props}
    />
  );
}

export function TripCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="mt-4 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-64 w-full rounded-[3rem]" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => <TripCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
