import type { GuestPwUpdatePayload } from '@/api/data-contracts';
import { useUpdateGuestOrderPwSendEmailMutation } from '@/hooks/use-guest';
import useToast from '@/hooks/useToast';
import { EMAIL, findGuestOrderPwSchema, ORDERER } from '@/validate/find-order-pw-form-schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@appabbang/ui';
import { formatMobile } from '@appabbang/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  children: React.ReactNode;
};

export default function FindOrderPwDialog({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { addToast } = useToast();
  const updateGuestOrderPw = useUpdateGuestOrderPwSendEmailMutation();

  const form = useForm({
    resolver: zodResolver(findGuestOrderPwSchema),
    defaultValues: {
      ordererName: '',
      ordererEmail: '',
      ordererMobile: '',
    },
  });

  /*************************************************************************/

  /** 모든 상태값과 form 초기화 */
  const resetAllStates = () => {
    form.reset();
    updateGuestOrderPw.reset();
  };

  /** 임시 주문 비밀번호를 이메일로 전송 onSubmit */
  const onSubmit = async (data: GuestPwUpdatePayload) => {
    if (updateGuestOrderPw.isPending) return;

    try {
      // 임시 주문 비밀번호로 업데이트하고, 입력한 이메일로 전송한다.
      await updateGuestOrderPw.mutateAsync(data);
    } catch (e) {
      addToast({
        type: 'error',
        message: '비회원 임시 주문 비밀번호 변경 과정에서 문제가 발생했습니다.',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setOpen(false);
          resetAllStates(); // dialog가 닫힐 때만 초기화
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
        // className="overflow-y-auto max-h-11/12 flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="leading-8">
            <span className="text-[18px] font-bold">주문 비밀번호 변경</span>
          </DialogTitle>
          <DialogDescription className="-mt-2">
            비회원 주문등록 시 입력했던 정보를 입력해야 주문정보 확인이 가능합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="ordererName"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`min-w-[120px] whitespace-nowrap`}>
                    <span className="text-red-700">*</span> 주문자
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <div className="flex flex-row relative">
                        <Input
                          type="text"
                          {...field}
                          placeholder="주문자 입력"
                          minLength={ORDERER.min.value}
                          maxLength={ORDERER.max.value}
                          disabled={updateGuestOrderPw.isSuccess} // 인증 완료되고나면 수정불가
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ordererMobile"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel
                    htmlFor="ordererMobile"
                    errorCheck={false}
                    className={`min-w-[120px] whitespace-nowrap`}
                  >
                    <span className="text-red-700">*</span> 주문자 휴대번호
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <div className="flex flex-row relative">
                        <Input
                          id="ordererMobile"
                          disabled={updateGuestOrderPw.isSuccess}
                          {...field}
                          placeholder="주문자 휴대번호 입력"
                          maxLength={13}
                          onChange={(e) => {
                            const formattedValue = formatMobile(e.target.value);
                            field.onChange(formattedValue);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ordererEmail"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`min-w-[120px] whitespace-nowrap`}>
                    <span className="text-red-700">*</span> 주문자 이메일
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <div className="flex flex-row relative">
                        <Input
                          type="email"
                          {...field}
                          placeholder="주문자 이메일 입력"
                          minLength={EMAIL.min.value}
                          maxLength={EMAIL.max.value}
                          disabled={updateGuestOrderPw.isSuccess} // 인증 완료되고나면 수정불가
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="button"
              disabled={updateGuestOrderPw.isPending || updateGuestOrderPw.isSuccess}
              className="w-full"
              onClick={form.handleSubmit(onSubmit)}
            >
              전송받기
            </Button>
          </form>
        </Form>

        {updateGuestOrderPw.isSuccess ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">임시 비밀번호를 전달합니다!</CardTitle>
              <CardDescription>
                비회원 고객님의 잃어버린 주문 비밀번호는 임시 주문 비밀번호로 대체되었습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              입력한 이메일({form.getValues('ordererEmail')})로 임시 주문 비밀번호를 전달합니다.
              해당 임시 주문 비밀번호로 주문내역을 확인하세요.
            </CardContent>
          </Card>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
