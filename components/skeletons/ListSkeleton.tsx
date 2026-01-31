'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ListSkeletonProps {
  count?: number;
  showTitle?: boolean;
  showFilters?: boolean;
}

export function ListSkeleton({
  count = 6,
  showTitle = true,
  showFilters = true,
}: ListSkeletonProps) {
  return (
    <div className="space-y-6">
      <div>
        {showTitle && (
          <>
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </>
        )}
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-20" />
            ))}
          </div>
        </div>
      )}

      <div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        style={{ gridAutoRows: '1fr' }}
      >
        {Array.from({ length: count }, (_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
