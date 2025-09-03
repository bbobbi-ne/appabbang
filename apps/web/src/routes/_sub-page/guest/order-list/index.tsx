import Loading from '@/components/common/loading';
import GuestOrders from '@/components/guest/orders';
import SubLayout from '@/components/templates/sub-layout';
import { useGetGuestOrdersQuery } from '@/hooks/use-guest';
import { createFileRoute, redirect, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/guest/order-list/')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const data = (location.state as any).data;
    if (!data) throw redirect({ to: '/login' });
  },
  loader: async ({ location }) => {
    return { stateData: (location.state as any).data };
  },
});

function RouteComponent() {
  const { stateData } = useLoaderData({ from: '/_sub-page/guest/order-list/' });
  const { isLoading, data } = useGetGuestOrdersQuery(stateData);

  if (isLoading || !data) return <Loading title="비회원 주문목록" />;

  return (
    <SubLayout title="비회원 주문내역">
      <GuestOrders list={data} search={stateData} />
    </SubLayout>
  );
}
