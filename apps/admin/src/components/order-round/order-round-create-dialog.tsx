import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@appabbang/ui';
import { useState } from 'react';
import OrderRoundForm from './order-round-form';
import { useOrderRoundCreateMutation } from '@/hooks/use-order-round';

function OrderRoundCreateDialog() {
  const [open, setOpen] = useState(false);
  const { orderRoundCreateMutation } = useOrderRoundCreateMutation();

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button className="ml-auto">등록</Button>
      </DialogTrigger>
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
          <OrderRoundForm setOpen={setOpen} submitFn={orderRoundCreateMutation} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default OrderRoundCreateDialog;
