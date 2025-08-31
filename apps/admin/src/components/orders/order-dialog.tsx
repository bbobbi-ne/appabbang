import { DialogTitle } from '@appabbang/ui';
import { useOrderDetailQuery } from '@/hooks/use-order';
import OrderTable from './order-table';
import OrderForm from './order-form';
import { DialogLayout } from '../ui/dialog-layout';
import { useGetOrderStatusQuery } from '@/hooks/use-common-code';

interface orderDetailDialogProps {
  children: React.ReactNode;
  no: number;
}

export function OrderDialog({ children, no }: orderDetailDialogProps) {
  return (
    <DialogLayout trigger={children} title="" description="">
      {({ close }) => <DialogBody close={close} no={no} />}
    </DialogLayout>
  );
}

function DialogBody({ no, close }: { no: number; close: () => void }) {
  const { data: orderData, isLoading } = useOrderDetailQuery(no);
  const { data: ordersStatus } = useGetOrderStatusQuery();

  return (
    <>
      <div className="mb-10 space-y-2">
        {!isLoading && (
          <DialogTitle className="text-base">
            주문번호 ({orderData?.orderNumber}){'\n'}
            <strong className="text-sky-500">
              {ordersStatus?.find((val) => val.code === orderData?.orderStatus)?.name}
            </strong>
          </DialogTitle>
        )}
      </div>
      <div className="space-y-4 my-4">
        <DialogTitle className="text-base">주문정보</DialogTitle>
        {!isLoading && <OrderTable orderData={orderData!} />}
      </div>

      <div className="w-full h-1 bg-muted rounded-r-lg my-4" />

      <div className="space-y-4">
        {!isLoading && <OrderForm orderData={orderData!} close={close} />}
      </div>
    </>
  );
}
