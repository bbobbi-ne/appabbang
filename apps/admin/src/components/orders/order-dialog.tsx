import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@appabbang/ui';
import { useOrderAndStatusAndDliveryTypeQuery, useOrdersDetailQuery } from '@/hooks/use-order';
import OrderTable from './order-table';
import OrderForm from './order-form';
import { useState } from 'react';

interface orderDetailDialogProps {
  children: React.ReactNode;
  no: number;
}

export function OrderDialog({ children, no }: orderDetailDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {open && <DialogBody no={no} />}
    </Dialog>
  );
}

function DialogBody({ no }: { no: number }) {
  const { data: orderData, isLoading } = useOrdersDetailQuery(no);
  const { ordersStatus } = useOrderAndStatusAndDliveryTypeQuery();

  return (
    <DialogContent
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
      className="sm:max-w-xl h-fit p-0"
    >
      <ScrollArea className="h-[700px] p-6">
        <DialogDescription hidden>주문상세정보</DialogDescription>
        <div className="mb-10 space-y-2">
          {!isLoading && (
            <>
              <DialogTitle>
                주문번호 ({orderData?.orderNumber}){'\n'}
                <strong className="text-sky-500">
                  {ordersStatus?.find((val) => val.code === orderData?.orderStatus)?.name}
                </strong>
              </DialogTitle>
            </>
          )}
        </div>
        <div className="space-y-4 my-4">
          <DialogTitle className="text-base">주문정보</DialogTitle>
          {!isLoading && (
            <OrderTable
              deliveryFee={orderData?.deliveryMethod.fee!}
              orderItem={orderData?.orderItem!}
            />
          )}
        </div>

        <div className="w-full h-1 bg-muted rounded-r-lg my-4" />

        <div className="space-y-4">{!isLoading && <OrderForm orderData={orderData!} />}</div>
      </ScrollArea>
    </DialogContent>
  );
}
