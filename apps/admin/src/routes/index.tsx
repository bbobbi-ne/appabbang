import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useCallback } from 'react';
import { useEffect } from 'react';
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
} from '@appabbang/ui';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const getMe = useCallback(async () => {
    const response = await axios.get(`${import.meta.env.VITE_APPABBANG_API_URL}/auth/me`);
    console.log(response);
    console.log(response.data);
    return response.data;
  }, []);

  useEffect(() => {
    getMe();
  }, []);
  const adminLoginSchema = z.object({
    userId: z.string().min(4, '아이디는 최소 4글자 이상이어야 합니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(19, '비밀번호는 20자 미만이어야 합니다.')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자 하나 이상이 포함되어야 합니다.'),
  });

  type AdminLoginForm = z.infer<typeof adminLoginSchema>;

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      userId: '',
      password: '',
    },
  });

  const onSubmit = (data: AdminLoginForm) => {
    console.log('로그인 시도:', data);
  };

  return (
    <div className="p-4">
      <div className="text-3xl">프로젝트 시작중..</div>
      <div className="mt-4"></div>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>관리자 로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                      아이디
                    </FormLabel>
                    <div className="flex-3/4 space-y-1">
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>아이디를 입력해주세요</FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex">
                    <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                      비밀번호
                    </FormLabel>
                    <div className="flex-3/4 space-y-1">
                      <FormControl>
                        <PasswordInput placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>비밀번호를 입력해주세요</FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                로그인
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
