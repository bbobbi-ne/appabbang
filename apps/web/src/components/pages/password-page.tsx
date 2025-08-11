import { passwordModifyFormSchema, type PasswordModifyFormSchema } from '@/validate/form-schema';
import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

// 비밀번호 변경 페이지
export default function PasswordPage() {
  /** default form values */
  const defaultValues: PasswordModifyFormSchema = {
    password: '', // 현재 비밀번호
    passwordModify: '', // 새 비밀번호
    passwordConfirm: '', // 비밀번호 확인
  };

  /** form - schema connect */
  const form = useForm({
    resolver: zodResolver(passwordModifyFormSchema),
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
  const onSubmit: SubmitHandler<PasswordModifyFormSchema> = (data) => {};

  return (
    <div className="w-full flex flex-row items-center justify-center">
      <Card className="p-10 flex flex-row items-center justify-center w-2/3">
        <Form {...form}>
          <form onSubmit={onFormHandler} className="w-2/3 *:m-2 *:has-[.submitBtn]:mt-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full m-auto flex flex-row items-center justify-center">
                  <FormLabel htmlFor="password" errorCheck={false} className="w-50">
                    <span className="text-red-700">*</span> 현재 비밀번호 입력
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="password"
                      placeholder="현재 비밀번호 입력"
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordModify"
              render={({ field }) => (
                <FormItem className="w-full m-auto flex flex-row items-center justify-center">
                  <FormLabel htmlFor="id" errorCheck={false} className="w-50">
                    <span className="text-red-700">*</span> 새 비밀번호
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="passwordModify"
                      placeholder="새 비밀번호 입력"
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem className="w-full m-auto flex flex-row items-center justify-center">
                  <FormLabel htmlFor="passwordConfirm" errorCheck={false} className="w-50">
                    <span className="text-red-700">*</span> 비밀번호 확인
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="passwordConfirm"
                      placeholder="비밀번호 확인 입력"
                      {...field}
                      onChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button type="submit" className="rounded-2xl h-10 w-full font-bold submitBtn">
                수정
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
