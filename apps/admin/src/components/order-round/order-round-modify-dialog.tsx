import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@appabbang/ui';
import { useState, type Dispatch, type ReactNode } from 'react';
import OrderRoundForm from './order-round-form';
import { useOrderRoundDetailQuery, useOrderRoundUpdateMutation } from '@/hooks/use-order-round';
import { format } from 'date-fns';

function OrderRoundModifyDialog({ children, no }: { children: ReactNode; no: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {open && <OrderRoundModifyDialogBody setOpen={setOpen} no={no} />}
    </Dialog>
  );
}

function OrderRoundModifyDialogBody({
  setOpen,
  no,
}: {
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  no: number;
}) {
  const { data, isLoading } = useOrderRoundDetailQuery(no);
  const { orderRoundUpdateMutation } = useOrderRoundUpdateMutation();

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
    image: data?.image ? data?.image[0]!.url : undefined,
    startedAt: splitIsoToDateTime(data?.startedAt!),
    endedAt: splitIsoToDateTime(data?.endedAt!),
  };

  return (
    <DialogContent
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
      className="sm:max-w-xl h-fit p-0"
    >
      <ScrollArea className="h-[700px] p-6">
        <DialogHeader>
          <DialogTitle>주문차수 등록</DialogTitle>
        </DialogHeader>
        <DialogDescription hidden>주문차수를 등록해주세요</DialogDescription>
        <OrderRoundForm
          setOpen={setOpen}
          currentValues={currentValues}
          submitFn={orderRoundUpdateMutation}
          no={no}
        />
      </ScrollArea>
    </DialogContent>
  );
}

export default OrderRoundModifyDialog;
