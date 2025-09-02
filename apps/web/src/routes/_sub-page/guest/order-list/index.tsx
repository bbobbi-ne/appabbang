import type { GuestCreateData, GuestCreatePayload } from '@/api/data-contracts';
import Loading from '@/components/common/loading';
import GuestOrders from '@/components/guest/orders';
import SubLayout from '@/components/templates/sub-layout';
import { useGetGuestOrdersMutation } from '@/hooks/use-orders';
import useToast from '@/hooks/useToast';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_sub-page/guest/order-list/')({
  component: RouteComponent,
});

function RouteComponent() {
  const search = useSearch({ from: '/_sub-page/guest/order-list/' }) as GuestCreatePayload;
  const getGuestOrders = useGetGuestOrdersMutation();
  const [list, setList] = useState<GuestCreateData>([]);
  const { addToast } = useToast();

  useEffect(() => {
    const guestOrders = async () => {
      if (search.ordererName && search.ordererMobile && search.ordererEmail) {
        try {
          const result = await getGuestOrders.mutateAsync(search);
          setList(result);
        } catch (err) {
          addToast({
            type: 'error',
            message: '비회원 주문목록 조회 과정에서 문제가 발생했습니다.',
          });
        }
      }
    };

    guestOrders();
  }, [search]);

  if (getGuestOrders.isPending || !list) return <Loading title="비회원 주문목록" />;

  return (
    <SubLayout title="비회원 주문내역">
      <GuestOrders list={list} />
    </SubLayout>
  );
}
