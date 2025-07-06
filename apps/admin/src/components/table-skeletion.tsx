import { Card, CardContent, CardFooter, CardHeader, Skeleton } from '@appabbang/ui';

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[100px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[550px]"></Skeleton>
      </CardContent>
      <CardFooter>
        <div className="flex items-center pt-0 space-x-2">
          <ul className="flex flex-row items-center gap-1">
            <li>
              <Skeleton className="h-9 w-[49px]" />
            </li>
            <li>
              <Skeleton className="h-9 w-[49px]" />
            </li>
            <li>
              <Skeleton className="h-9 w-[49px]" />
            </li>
            <li>
              <Skeleton className="h-9 w-[49px]" />
            </li>
          </ul>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[40px]" />
            <Skeleton className="h-9 w-[40px]" />
            <Skeleton className="h-9 w-[64px]" />
            <Skeleton className="h-9 w-[105px]" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default TableSkeleton;
