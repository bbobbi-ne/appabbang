import { createFileRoute, useNavigate } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import OrderRoundDetailPage from '@/components/pages/order-round-detail-page';
import { useGetOrderRoundNowQuery } from '@/hooks/use-order-round';
import { useEffect } from 'react';
import { toast } from '@appabbang/ui';

/** TODO: 주문서 오픈 시점에만 접근이 가능해야함. 마감시 접근 불가 */
export const Route = createFileRoute('/_sub-page/order-round/$orderRoundNo')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isSuccess } = useGetOrderRoundNowQuery();
  const { orderRoundNo } = Route.useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (orderRoundNo && isSuccess) {
      if (data?.no !== Number(orderRoundNo)) {
        toast.error('현재 오픈되어있는 주문이 아닙니다.');
        navigate({ to: '/' });
      }
    }
  }, [isSuccess, data]);

  if (!isSuccess) return <></>;

  return (
    <SubLayout title="주문서">
      <OrderRoundDetailPage />
    </SubLayout>
  );
}
