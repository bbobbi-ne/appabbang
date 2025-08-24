/**
 * 주문취소
 */

import { useCancelOrderMutation } from '@/hooks/use-my';
import {
  orderCancelFormSchema,
  type OrderCancelFormSchema,
} from '@/validate/order-cancel-form-schema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  DialogDescription,
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from '@appabbang/ui';

type Props = {
  children: React.ReactNode;
  no: number;
};

export default function OrderCalcenDialog({ children, no }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const cancelOrderMutation = useCancelOrderMutation();

  const cancelOrder = async (data: { canceledReason: string }) => {
    try {
      await cancelOrderMutation.mutateAsync({ no, data });
      toast.success('주문이 취소되었습니다.');
    } catch (error) {
      toast.error('주문취소에 실패했습니다.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12"
      >
        <DialogHeader>
          <DialogTitle>주문을 취소하시겠습니까?</DialogTitle>
          <DialogDescription>취소사유를 입력해야 취소진행이 가능합니다.</DialogDescription>
        </DialogHeader>

        <OrderCancelForm cancelOrder={cancelOrder} isSubmitting={cancelOrderMutation.isPending} />
      </DialogContent>
    </Dialog>
  );
}

const OrderCancelForm = ({
  cancelOrder,
  isSubmitting,
}: {
  cancelOrder: (data: { canceledReason: string }) => Promise<void>;
  isSubmitting: boolean;
}) => {
  const defaultValues = {
    canceledReason: '', // 취소사유
  };

  /** form - schema connect */
  const form = useForm({
    resolver: zodResolver(orderCancelFormSchema),
    defaultValues,
  });

  /**
   * form handler
   */
  const onFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    form.handleSubmit(onSubmit)(e);
  };

  /**
   * form submit
   */
  const onSubmit: SubmitHandler<OrderCancelFormSchema> = async (data) => {
    await cancelOrder(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={onFormHandler}>
        <FormField
          control={form.control}
          name="canceledReason"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 py-2">
              <FormLabel htmlFor="canceledReason" errorCheck={false} className="w-24">
                <span className="text-red-700">*</span> 취소사유
              </FormLabel>
              <div className="flex-1">
                <FormControl>
                  <Input
                    {...field}
                    id="canceledReason"
                    placeholder="취소사유 입력"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage className="text-xs pt-1" />
              </div>
            </FormItem>
          )}
        />

        <div>
          <p className="text-destructive text-xs py-2">
            입금이 완료된 경우, 영업일 기준 3일 이내에 환불됩니다.
          </p>
          <Button disabled={isSubmitting} className="w-full" variant="destructive">
            주문취소
          </Button>
        </div>
      </form>
    </Form>
  );
};
