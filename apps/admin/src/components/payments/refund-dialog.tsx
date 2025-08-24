import { useOrderDetailQuery, useOrderStatusUpdateMutation } from '@/hooks/use-order';
import {
  Button,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@appabbang/ui';

import RefundTable from './refund-table';
import { usePaymentDetailQuery, useRefundUpdateMutation } from '@/hooks/use-payment';
import { DialogLayout } from '../ui/dialog-layout';

export function RefundDialog({ no }: { no: number }) {
  return (
    <DialogLayout height={500} trigger={<Button>확인</Button>} title="" description="">
      {({ close }) => <DialogBody no={no} close={close} />}
    </DialogLayout>
  );
}

const DialogBody = ({ no }: { no: number; close: () => void }) => {
  const { data: paymentDetail, isLoading: paymentDetailLoading } = usePaymentDetailQuery(no);
  const { data: ordersDetail, isLoading: ordersDetailLoading } = useOrderDetailQuery(no);
  const { refundUpdateMutation } = useRefundUpdateMutation();
  const { orderStatusUpdateMutation } = useOrderStatusUpdateMutation();

  if (ordersDetailLoading || paymentDetailLoading) return;

  const isRefund = paymentDetail?.isPaid ? true : false;

  const onClickRefund = async () => {
    await refundUpdateMutation({ no, data: { isRefunded: true, orderNo: ordersDetail!.no } });
    await orderStatusUpdateMutation({ no, orderStatus: { orderStatus: '52' } });
  };
  const onClickCancle = async () => {
    await refundUpdateMutation({ no, data: { isRefunded: false, orderNo: ordersDetail!.no } });
    await orderStatusUpdateMutation({ no, orderStatus: { orderStatus: '51' } });
  };

  return (
    <>
      <DialogHeader className="pb-6">
        <DialogTitle>{isRefund ? '환불' : '취소'} 정보</DialogTitle>
        <DialogDescription>
          <strong>주문번호</strong>({ordersDetail!.orderNumber})
        </DialogDescription>
      </DialogHeader>
      <RefundTable ordersDetail={ordersDetail!} paymentDetail={paymentDetail!} />
      <DialogFooter className="py-6">
        {isRefund ? (
          <>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                닫기
              </Button>
            </DialogClose>
            <Button onClick={onClickRefund} disabled={ordersDetail?.orderStatus === '52'}>
              환불완료
            </Button>
          </>
        ) : (
          <>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                닫기
              </Button>
            </DialogClose>
            <Button onClick={onClickCancle} disabled={ordersDetail?.orderStatus === '51'}>
              취소완료
            </Button>
          </>
        )}
      </DialogFooter>
    </>
  );
};
