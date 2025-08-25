import useToast from '@/hooks/useToast';
import { login } from '@/services/customer-apis';
import { useCustomerStore } from '@/store/customer';
import { useAccessTokenStore } from '@/store/session';
import { loginSchema, type LoginFormType } from '@/validate/login-form-schema';
import {
  FormField,
  FormItem,
  FormLabel,
  Input,
  FormControl,
  FormMessage,
  Button,
  Form,
  PasswordInput,
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import FindIdDialog from './find-id-dialog';
import FindPwDialog from './find-pw-dialog';

const labelMinWidth = 'min-w-[100px]';

/** 로그인 폼 */
function LoginForm() {
  const navigate = useNavigate();
  const { set: setAccessToken } = useAccessTokenStore();
  const { set: setCustomer } = useCustomerStore();
  const { addToast } = useToast();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { id: '', pw: '', type: 'customer' },
  });

  /**
   * 로그인
   */
  const onSubmit = async (data: { id: string; pw: string }) => {
    const { code, name } = await login(data, setAccessToken, setCustomer);
    if (code === 200) {
      addToast({ type: 'success', message: `${name}님, 환영합니다!` });
      navigate({ to: '/' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel
                errorCheck={false}
                className={`${labelMinWidth} whitespace-nowrap px-2 py-3 flex-1/4`}
              >
                아이디
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input type="text" {...field} placeholder="아이디 입력" maxLength={30} />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pw"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel
                errorCheck={false}
                className={`${labelMinWidth} whitespace-nowrap px-2 py-3 flex-1/4 `}
              >
                비밀번호
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <PasswordInput {...field} placeholder="비밀번호 입력" maxLength={30} />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel errorCheck={false} className={`whitespace-nowrap px-2 py-3 flex-1/4 `}>
                유저타입
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} maxLength={30} value="customer" />
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
          <div> | </div>
          <FindPwDialog>
            <div className="hover:underline">비밀번호찾기</div>
          </FindPwDialog>
          <div> | </div>
          <Link className="hover:underline" to="/join">
            회원가입
          </Link>
        </div>
        <Button className="w-full" type="submit">
          로그인
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
