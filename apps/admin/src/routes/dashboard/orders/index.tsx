import { OrderDialog } from '@/components/orders/order-dialog';
import { TableContainer } from '@/components/ui/table-container';
import { ordersColumns } from '@/data/columns/orders-columns';
import { useOrdersWithStatusAndDeliveryQuery } from '@/hooks/use-order';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/orders/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { isError, isLoading, orders } = useOrdersWithStatusAndDeliveryQuery();

  console.log(orders);
  return (
    <TableContainer
      title="주문관리"
      columns={ordersColumns()}
      data={orders || []}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="주문이 없습니다."
      rowWrapper={(cell, row, key) => (
        <OrderDialog key={key} no={row.no}>
          {cell}
        </OrderDialog>
      )}
    />
  );
}
