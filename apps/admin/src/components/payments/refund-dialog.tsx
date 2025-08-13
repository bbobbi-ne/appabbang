import { useOrdersDetailQuery } from '@/hooks/use-order';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  ScrollArea,
} from '@appabbang/ui';

import { useState } from 'react';
import RefundTable from './refund-table';
import { usePaymenDetailQuery } from '@/hooks/use-payment';

export function RefundDialog({ no }: { no: number }) {
  const [opne, setOpen] = useState(false);

  return (
    <Dialog open={opne} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button className="ml-auto">확인</Button>
      </DialogTrigger>
      {opne && <RefundDialogBody no={no} />}
    </Dialog>
  );
}

const RefundDialogBody = ({ no }: { no: number }) => {
  const { data: paymentDetail, isLoading: paymentDetailLoading } = usePaymenDetailQuery(no);
  const { data: ordersDetail, isLoading: ordersDetailLoading } = useOrdersDetailQuery(no);

  if (ordersDetailLoading || paymentDetailLoading) return;

  const isRefund = paymentDetail?.isPaid ? true : false;

  return (
    <>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-xl h-fit p-0"
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{isRefund ? '환불' : '취소'} 정보</DialogTitle>
          <DialogDescription>
            <strong>주문번호</strong>({ordersDetail!.orderNumber})
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[600px] p-6">
          <RefundTable ordersDetail={ordersDetail!} paymentDetail={paymentDetail!} />
        </ScrollArea>
        <DialogFooter className="px-6 pb-6">
          {isRefund ? (
            <>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  닫기
                </Button>
              </DialogClose>
              <Button>환불완료</Button>
            </>
          ) : (
            <>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  닫기
                </Button>
              </DialogClose>
              <Button>취소완료</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </>
  );
};
