import { createFileRoute } from '@tanstack/react-router';
import { orderRoundColumns } from '@/data/columns/order-rounds-columns';
import { useOrderRoundsQuery } from '@/hooks/use-order-round';
import OrderRoundCreateDialog from '@/components/order-round/order-round-create-dialog';
import OrderRoundModifyDialog from '@/components/order-round/order-round-modify-dialog';
import { TableContainer } from '@/components/ui/table-container';

export const Route = createFileRoute('/dashboard/orderRound/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, isError } = useOrderRoundsQuery();

  console.log(data);

  return (
    <TableContainer
      title="주문차수"
      columns={orderRoundColumns()}
      data={data}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="주문차수를 등록해주세요."
      createDialog={<OrderRoundCreateDialog />}
      rowWrapper={(cell, row, key) => (
        <OrderRoundModifyDialog key={key} no={row.no}>
          {cell}
        </OrderRoundModifyDialog>
      )}
    />
  );
}
