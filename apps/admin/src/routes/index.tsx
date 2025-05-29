import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
  CardFooter,
  Label,
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
                  <FormItem>
                    <div className="flex items-center gap-4">
                      <FormLabel className="whitespace-nowrap">아이디</FormLabel>
                      <FormControl className="flex-1">
                        <div className="relative ">
                          <Input placeholder="shadcn" {...field} />
                          <div className="absolute px-3">
                            <FormDescription>아이디를 입력해주세요</FormDescription>
                            <FormMessage />
                          </div>
                        </div>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>비밀번호를 입력해주세요</FormDescription>
                    <FormMessage />
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
