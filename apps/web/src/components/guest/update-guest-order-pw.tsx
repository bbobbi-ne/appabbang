/** 주문 비밀번호 변경 */

import type { UpdateGuestOrderPwFormType } from '@/validate/order-pw-modify-form-schema';
import { useUpdateGuestOrderPwMutation } from '@/hooks/use-guest';
import useToast from '@/hooks/useToast';
import { ORDER_PW, UpdateGuestOrderPwFormSchema } from '@/validate/order-pw-modify-form-schema';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';

export type SearchProp = {
  // 비회원 query string search
  ordererName: string;
  ordererEmail: string;
  ordererMobile: string;
  orderPw: string;
};

export default function UpdateGuestOrderPw({
  orderNo,
  children,
  search,
}: {
  orderNo: number;
  children: React.ReactNode;
  search: SearchProp;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const labelMinWidth = 'min-w-[120px]';
  const updateGuestOrderPw = useUpdateGuestOrderPwMutation();

  const form = useForm<UpdateGuestOrderPwFormType>({
    resolver: zodResolver(UpdateGuestOrderPwFormSchema),
    defaultValues: { orderPw: '', orderPwModify: '', orderPwConfirm: '' },
  });

  /*************************************************************************/

  /** 컴포넌트 닫을 때 초기화 */
  const resetAllStates = () => {
    form.reset();
  };

  /** 해당 주문서의 주문 비밀번호 변경 */
  const onSubmit = async (data: UpdateGuestOrderPwFormType) => {
    if (updateGuestOrderPw.isPending) return;

    const model = {
      no: orderNo,
      orderPw: data.orderPw,
      orderPwModify: data.orderPwModify,
    };

    try {
      await updateGuestOrderPw.mutateAsync(model);
      addToast({ type: 'success', message: '정상적으로 변경되었습니다.' });
      setOpen(false);
      resetAllStates();

      // 바뀐 주문 비밀번호로 다시 조회
      navigate({
        to: `/guest/order-list`,
        state: { data: { ...search, orderPw: data.orderPwModify } } as any,
      });
    } catch (e) {
      addToast({
        type: 'error',
        message: '비회원 주문 비밀번호 변경 과정에서 문제가 발생했습니다.',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setOpen(false);
          resetAllStates();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="leading-8">
            <span className="text-[18px] font-bold">주문 비밀번호 변경</span>
          </DialogTitle>
          <DialogDescription className="-mt-2">
            해당 주문서의 비밀번호를 변경합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="orderPw"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel
                    htmlFor="pw"
                    errorCheck={false}
                    className={`${labelMinWidth} whitespace-nowrap`}
                  >
                    <span className="text-red-700">*</span> 현재 비밀번호
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <PasswordInput
                        id="pw"
                        {...field}
                        placeholder="현재 비밀번호 입력"
                        minLength={ORDER_PW.min.value}
                        maxLength={ORDER_PW.max.value}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderPwModify"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel
                    htmlFor="pwModify"
                    errorCheck={false}
                    className={`${labelMinWidth} whitespace-nowrap`}
                  >
                    <span className="text-red-700">*</span> 새 비밀번호
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <PasswordInput
                        id="pwModify"
                        placeholder="새 비밀번호 입력"
                        {...field}
                        onChange={(e) => field.onChange(e)}
                        minLength={ORDER_PW.min.value}
                        maxLength={ORDER_PW.max.value}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderPwConfirm"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel
                    htmlFor="pwConfirm"
                    errorCheck={false}
                    className={`${labelMinWidth} whitespace-nowrap`}
                  >
                    <span className="text-red-700">*</span> 비밀번호 확인
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <PasswordInput
                        id="pwConfirm"
                        placeholder="비밀번호 확인 입력"
                        {...field}
                        onChange={(e) => field.onChange(e)}
                        minLength={ORDER_PW.min.value}
                        maxLength={ORDER_PW.max.value}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <div className="pt-8">
              <Button type="submit" className="w-full">
                변경하기
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
