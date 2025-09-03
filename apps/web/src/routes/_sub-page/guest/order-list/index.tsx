import type { GuestCreatePayload } from '@/api/data-contracts';
import Loading from '@/components/common/loading';
import GuestOrders from '@/components/guest/orders';
import SubLayout from '@/components/templates/sub-layout';
import { useGetGuestOrdersQuery } from '@/hooks/use-guest';
import { createFileRoute, useSearch } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/guest/order-list/')({
  component: RouteComponent,
});

function RouteComponent() {
  const search = useSearch({ from: '/_sub-page/guest/order-list/' }) as GuestCreatePayload;
  const { isLoading, data } = useGetGuestOrdersQuery(search);

  if (isLoading || !data) return <Loading title="비회원 주문목록" />;

  return (
    <SubLayout title="비회원 주문내역">
      <GuestOrders list={data} search={search} />
    </SubLayout>
  );
}
