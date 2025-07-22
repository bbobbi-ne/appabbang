/**
 * * 아빠빵 로그인
 * * 카카오 로그인 API
 */

import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  Input,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
  CardDescription,
} from '@appabbang/ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { getKakaoCode } from '@/services/apis';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const raw = sessionStorage.getItem('auth-storage');
    const auth = raw ? JSON.parse(raw).state.auth : null;

    if (auth) {
      // throw redirect({ to: '/dashboard' });
    }
  },
  component: RouteComponent,
});

export const adminLoginSchema = z.object({
  id: z.string().min(4, '아이디는 최소 4글자 이상이어야 합니다.'),
  pw: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(19, '비밀번호는 20자 미만이어야 합니다.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자 하나 이상이 포함되어야 합니다.'),
  type: z.string(),
});
type AdminLoginForm = z.infer<typeof adminLoginSchema>;

function RouteComponent() {
  // const navigate = useNavigate();
  const onSubmit = useMutation({
    // mutationFn: loginCreate,
    onSuccess: (res) => {
      if (res) {
        // navigate({ to: '/dashboard' });
      }
    },
  }).mutate;

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      id: 'admin',
      pw: 'test1234!',
      type: 'user',
    },
  });

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-4 p-24">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="inline">사용자 로그인</CardTitle>
          </div>
          <CardDescription>로그인 후 사용이 가능합니다!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data: any) => onSubmit(data))} className="space-y-8">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                      아이디
                    </FormLabel>
                    <div className="flex-3/4 space-y-1">
                      <FormControl>
                        <Input placeholder="아이디 입력" {...field} />
                      </FormControl>
                      <FormDescription>아이디를 입력 바랍니다.</FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pw"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                      비밀번호
                    </FormLabel>
                    <div className="flex-3/4 space-y-1">
                      <FormControl>
                        <PasswordInput placeholder="비밀번호 입력" {...field} />
                      </FormControl>
                      <FormDescription>비밀번호를 입력 바랍니다.</FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" onClick={() => alert('작업중입니다.')}>
                로그인
              </Button>
            </form>
          </Form>

          <div className="flex justify-center m-2">
            <img
              className="cursor-pointer"
              src="./images/kakao_login_medium_wide.png"
              alt="카카오 로그인"
              onClick={getKakaoCode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
