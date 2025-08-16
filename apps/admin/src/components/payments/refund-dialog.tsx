import { useOrderDetailQuery } from '@/hooks/use-order';
import {
  Button,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  ScrollArea,
} from '@appabbang/ui';

import RefundTable from './refund-table';
import { usePaymentDetailQuery } from '@/hooks/use-payment';
import { DialogLayout } from '../ui/dialog-layout';

export function RefundDialog({ no }: { no: number }) {
  return (
    <DialogLayout trigger={<Button>확인</Button>} title="" description="">
      {({ close }) => <DialogBody no={no} close={close} />}
    </DialogLayout>
  );
}

const DialogBody = ({ no }: { no: number; close: () => void }) => {
  const { data: paymentDetail, isLoading: paymentDetailLoading } = usePaymentDetailQuery(no);
  const { data: ordersDetail, isLoading: ordersDetailLoading } = useOrderDetailQuery(no);

  if (ordersDetailLoading || paymentDetailLoading) return;

  const isRefund = paymentDetail?.isPaid ? true : false;

  console.log(ordersDetail?.orderStatus);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isRefund ? '환불' : '취소'} 정보</DialogTitle>
        <DialogDescription>
          <strong>주문번호</strong>({ordersDetail!.orderNumber})
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-[600px] py-6">
        <RefundTable ordersDetail={ordersDetail!} paymentDetail={paymentDetail!} />
      </ScrollArea>
      <DialogFooter>
        {isRefund ? (
          <>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                닫기
              </Button>
            </DialogClose>
            <Button disabled={ordersDetail?.orderStatus === '52'}>환불완료</Button>
          </>
        ) : (
          <>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                닫기
              </Button>
            </DialogClose>
            <Button disabled={ordersDetail?.orderStatus === '51'}>취소완료</Button>
          </>
        )}
      </DialogFooter>
    </>
  );
};
