import { createFileRoute } from '@tanstack/react-router';
import CouponIssueTable from '@/components/coupons/coupon-issue-table';
export const Route = createFileRoute('/dashboard/coupons/$no')({
  component: RouteComponent,
});

import { useCouponDetailQuery } from '@/hooks/use-coupon';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';

export function RouteComponent() {
  const { no } = useParams({ from: '/dashboard/coupons/$no' });
  const { data, isError, isSuccess } = useCouponDetailQuery(Number(no));
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      navigate({ to: '/dashboard/coupons' });
    }
  }, [isError]);

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold leading-none tracking-tight pb-6">
        쿠폰 관리 &gt; 쿠폰 발급
      </h3>

      {data && (
        <div className="bg-secondary rounded-lg p-2 space-y-2 mb-6">
          <p className="text-sm text-secondary-foreground">
            <b>
              {data.name} ({data.amount}원)
            </b>{' '}
            쿠폰을 발급할 고객을 선택해주세요.
          </p>
          <p className="text-xs text-muted-foreground">
            쿠폰은 발급 후{' '}
            <b>
              <u>{data.expireAfterDays}일</u>
            </b>{' '}
            후에 만료됩니다.
          </p>
        </div>
      )}

      {isSuccess && <CouponIssueTable no={data.no} />}
    </div>
  );
}
