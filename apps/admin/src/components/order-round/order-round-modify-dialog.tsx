import { type ReactNode } from 'react';
import OrderRoundForm from './order-round-form';
import { useOrderRoundDetailQuery, useOrderRoundUpdateMutation } from '@/hooks/use-order-round';
import { DialogLayout } from '../ui/dialog-layout';

function OrderRoundModifyDialog({ children, no }: { children: ReactNode; no: number }) {
  return (
    <DialogLayout trigger={children} description="주문차수를 등록해주세요" title="주문차수 등록">
      {({ close }) => <DialogBody no={no} close={close} />}
    </DialogLayout>
  );
}

function DialogBody({ close, no }: { close: () => void; no: number }) {
  const { data, isLoading } = useOrderRoundDetailQuery(no);
  const { orderRoundUpdateMutation } = useOrderRoundUpdateMutation();

  if (isLoading && !data) return;

  const orderRoundBreads = data!.orderRoundBreads.map((item) => {
    return { no: item.no, name: item.name };
  });

  const currentValues = {
    ...data!,
    orderRoundBreads,
    image: data?.image,
    startedAt: new Date(data?.startedAt!),
    endedAt: new Date(data?.endedAt!),
  };

  return (
    <OrderRoundForm
      onSuccess={close}
      currentValues={currentValues}
      submitFn={orderRoundUpdateMutation}
      no={no}
    />
  );
}

export default OrderRoundModifyDialog;
