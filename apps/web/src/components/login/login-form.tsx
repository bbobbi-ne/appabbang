import { useGetAuthLoginMutation } from '@/hooks/use-auth';
import useToast from '@/hooks/useToast';

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

const labelMinWidth = 'min-w-[100px]';

/** 로그인 폼 */
function LoginForm() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const loginMutation = useGetAuthLoginMutation();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { id: '', pw: '', type: 'customer' },
  });

  /**
   * 로그인
   */
  const onSubmit = async (data: LoginFormType) => {
    try {
      const res = await loginMutation.mutateAsync({ ...data });
      addToast({ type: 'success', message: `${res.data.name}님, 환영합니다!` });
      navigate({ to: '/' });
    } catch (error: any) {
      addToast({ type: 'error', message: error || '로그인 오류입니다.' });
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

        <p className="text-right pt-2 pb-4 flex flex-col gap-2">
          <Link className="text-gray-500 text-xs hover:underline" to="/join">
            아직 회원이 아니신가요? 회원가입하러가기
          </Link>
          {/* <div className="flex justify-end gap-2">
            <Link className="text-gray-500 text-xs hover:underline" to="/find-id">
              아이디찾기
            </Link>
            <Link className="text-gray-500 text-xs hover:underline" to="/find-pw">
              비밀번호찾기
            </Link>
          </div> */}
        </p>
        <Button className="w-full" type="submit">
          로그인
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
