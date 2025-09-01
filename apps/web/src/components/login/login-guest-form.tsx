/**
 * 비회원 로그인 form
 */

import { loginGuestSchema, type LoginGuestFormType } from '@/validate/login-guest-form-schema';
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  Input,
  FormMessage,
  PasswordInput,
  Button,
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FindIdDialog from './find-id-dialog';
import { useAccessTokenStore } from '@/store/session';
import useToast from '@/hooks/useToast';
import { useGetGuestOrdersMutation } from '@/hooks/use-orders';
import type { GuestCreatePayload } from '@/api/data-contracts';
import { useNavigate } from '@tanstack/react-router';

export default function LoginGuestForm() {
  const labelMinWidth = 'min-w-[100px]';
  const { addToast } = useToast();
  const getGuestOrders = useGetGuestOrdersMutation();
  const navigate = useNavigate();

  /** form 설정 */
  const form = useForm<LoginGuestFormType>({
    resolver: zodResolver(loginGuestSchema),
    defaultValues: { ordererName: '', ordererMobile: '', ordererEmail: '', orderPw: '' },
  });

  /*******************************************************************************************/

  /** 비회원 로그인 */
  const onSubmit = async (data: GuestCreatePayload) => {
    const { accessToken } = useAccessTokenStore.getState();

    if (accessToken.length > 0) {
      addToast({ type: 'error', message: '회원은 비회원 로그인이 불가합니다.' });
      return;
    }

    // 비회원 로그인 :: 주문내역을 조회해서 일치하는 주문 1건(이상) 조회. (주문자 이름, 휴대번호, 이메일)
    const result = await getGuestOrders.mutateAsync(data);
    debugger;
    if (result && result.length > 0) {
      addToast({
        type: 'success',
        message: '주문정보를 성공적으로 조회했습니다. 해당 화면으로 이동합니다.',
      });
      setTimeout(() => {
        navigate({ to: '/guest/order-list' });
      }, 3000);
    } else {
      addToast({
        type: 'error',
        message: '현재 입력한 비회원 정보의 주문목록이 존재하지 않습니다.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="ordererName"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel
                htmlFor="ordererName"
                errorCheck={false}
                className={`${labelMinWidth} whitespace-nowrap px-2 py-3 flex-1/4`}
              >
                주문자
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input
                    id="ordererName"
                    type="text"
                    {...field}
                    placeholder="주문자 입력"
                    maxLength={30}
                  />
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
                className={`${labelMinWidth} whitespace-nowrap px-2 py-3 flex-1/4 `}
              >
                휴대번호
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input id="ordererMobile" {...field} placeholder="휴대번호 입력" maxLength={30} />
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
              <FormLabel
                htmlFor="ordererEmail"
                errorCheck={false}
                className={`${labelMinWidth} whitespace-nowrap px-2 py-3 flex-1/4 `}
              >
                이메일
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <div className="flex flex-row relative">
                    <Input
                      id="ordererEmail"
                      type="email"
                      {...field}
                      placeholder="이메일 입력"
                      maxLength={50}
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
          name="orderPw"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel
                htmlFor="orderPw"
                errorCheck={false}
                className={`${labelMinWidth} whitespace-nowrap px-2 py-3 flex-1/4 `}
              >
                주문 비밀번호
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <PasswordInput
                    id="orderPw"
                    {...field}
                    placeholder="주문 비밀번호 입력"
                    minLength={4}
                    maxLength={20}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <div className="cursor-pointer pt-10 pb-2 flex flex-row justify-center items-center gap-2 text-gray-500 text-sm ">
          <FindIdDialog>
            <div className="hover:underline">아이디찾기</div>
          </FindIdDialog>
          {/* 
          <div> | </div>
          <FindPwDialog>
            <div className="hover:underline">비밀번호찾기</div>
          </FindPwDialog>
          <div> | </div>
          <Link className="hover:underline" to="/join">
            회원가입
          </Link> */}
        </div>
        <Button className="w-full" type="submit">
          로그인
        </Button>
      </form>
    </Form>
  );
}
