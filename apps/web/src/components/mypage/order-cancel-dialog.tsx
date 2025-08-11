/**
 * 주문취소
 */

import { orderCancelFormSchema, type OrderCancelFormSchema } from '@/validate/form-schema';
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
import clsx from 'clsx';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
};

export const btnCssStr = `bg-[#ffffff] text-[#202020] hover:bg-[#644a40] hover:text-[#ffffff]`;

function OrderCalcenDialog({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);

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
  const onSubmit: SubmitHandler<OrderCancelFormSchema> = (data) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12 flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="leading-8">
            <span className="mb-3 text-[18px] font-bold">주문을 취소하시겠습니까?</span>
          </DialogTitle>
          <DialogDescription>취소사유를 입력해야 취소진행이 가능합니다.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onFormHandler} className="*:m-2 *:has-[.submitBtn]:mt-5">
            <FormField
              control={form.control}
              name="canceledReason"
              render={({ field }) => (
                <FormItem className="m-auto flex flex-row items-center justify-center">
                  <FormLabel htmlFor="canceledReason" errorCheck={false} className="w-50">
                    <span className="text-red-700">*</span> 취소사유
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-96"
                      id="canceledReason"
                      placeholder="취소사유 입력"
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="text-red-700 text-[14px] text-left mt-10">
                입금이 완료된 경우, 영업일 기준 3일 이내에 환불됩니다.
              </p>
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className={clsx('w-full submitBtn', btnCssStr)}
              >
                주문취소
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default OrderCalcenDialog;
