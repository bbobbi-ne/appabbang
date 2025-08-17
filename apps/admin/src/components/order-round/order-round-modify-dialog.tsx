import { type ReactNode } from 'react';
import OrderRoundForm from './order-round-form';
import { useOrderRoundDetailQuery, useOrderRoundUpdateMutation } from '@/hooks/use-order-round';
import { format } from 'date-fns';
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

  console.log(data);
  if (isLoading && !data) return;

  function splitIsoToDateTime(isoString: string) {
    const dateObj = new Date(isoString);

    return {
      date: dateObj,
      time: format(dateObj, 'HH:mm:ss'),
    };
  }

  const orderRoundBreads = data!.orderRoundBreads.map((item) => {
    return { no: item.no, name: item.name };
  });

  const currentValues = {
    ...data!,
    orderRoundBreads,
    image: data?.image ? data?.image.url : undefined,
    startedAt: splitIsoToDateTime(data?.startedAt!),
    endedAt: splitIsoToDateTime(data?.endedAt!),
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
