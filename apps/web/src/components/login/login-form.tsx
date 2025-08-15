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
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

/** 로그인 폼 */
function LoginForm() {
  const navigate = useNavigate();
  const { set: setAccessToken } = useAccessTokenStore();
  const { set: setCustomer } = useCustomerStore();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { id: '', pw: '' },
  });

  /**
   * 로그인
   */
  const onSubmit = (data: { id: string; pw: string }) => {
    login(data, setAccessToken, setCustomer);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data: any) => onSubmit(data))} className="space-y-2">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`whitespace-nowrap px-2 py-3 flex-1/4`}>
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
              <FormLabel errorCheck={false} className={`whitespace-nowrap px-2 py-3 flex-1/4 `}>
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

        <div
          className="text-gray-500 text-[15px] text-right mt-10 mb-3 cursor-pointer"
          onClick={() => navigate({ to: '/join' })}
        >
          아직 회원이 아니신가요? 회원가입 이동하기
        </div>
        <Button className="w-full" type="submit">
          로그인
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
