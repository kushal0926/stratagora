import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function GameCardSkeleton() {
  return (
    <Card className="bg-minimal border border-white/5">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32 bg-gray-700" />
            <Skeleton className="h-4 w-16 bg-gray-700" />
          </div>
          <Skeleton className="h-3 w-24 bg-gray-700" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32 bg-gray-700" />
            <Skeleton className="h-4 w-16 bg-gray-700" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-full bg-gray-700" />
        <Skeleton className="h-3 w-3/4 bg-gray-700" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 bg-gray-700" />
          <Skeleton className="h-9 w-9 bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );
}