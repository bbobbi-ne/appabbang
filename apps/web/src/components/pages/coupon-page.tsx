import { useGetCouponQuery } from '@/hooks/use-my';
import Loading from '../common/loading';
import type { CouponsListData } from '@/api/data-contracts';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@appabbang/ui';

export default function CouponPage() {
  const { isLoading, data } = useGetCouponQuery();

  if (isLoading) return <Loading title="쿠폰내역" />;
  return (
    <div className="mt-10">
      {data?.map((customerCoupon: CouponsListData[number]) => (
        <Card className="mb-5 hover:bg-muted hover:cursor-pointer">
          <CardHeader>
            <CardTitle className="flex flex-row gap-2">
              <div>{customerCoupon.coupon.amount.toLocaleString()}원</div>
              <Badge
                variant="secondary"
                className={cn(
                  `${customerCoupon.isExpired && 'bg-red-700 text-white'}`,
                  `${customerCoupon.isUsed && 'bg-amber-700 text-white'}`,
                  `${!customerCoupon.isUsed && 'bg-green-700 text-white'}`,
                )}
              >
                {customerCoupon.isExpired
                  ? '사용만료'
                  : customerCoupon.isUsed
                    ? '사용완료'
                    : '사용가능'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row justify-between">
            <CardDescription>{customerCoupon.coupon.name}</CardDescription>
            <div className="text-right">
              {customerCoupon.expiredAt.toString().slice(0, 16).replace('T', ' ')} 까지
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
