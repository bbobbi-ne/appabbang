import { TableContainer } from '@/components/ui/table-container';
import { paymentsColumns } from '@/data/columns/payments-columns';
import { usePaymentsWithOrderStatusQuery } from '@/hooks/use-payment';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/payment/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { paymentsList, isLoading, isError } = usePaymentsWithOrderStatusQuery();

  console.log(paymentsList);

  return (
    <TableContainer
      title="결제관리"
      columns={paymentsColumns()}
      data={paymentsList}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="결제 데이터가 없습니다."
    />
  );
}
