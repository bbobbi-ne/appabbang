import type { UpdateMyPasswordPayload } from '@/api/data-contracts';
import { useUpdateCustomerPwMutation } from '@/hooks/use-my';
import useToast from '@/hooks/useToast';
import {
  passwordModifyFormSchema,
  type PasswordModifyFormSchema,
} from '@/validate/password-modify-form-schema';
import {
  Button,
  Card,
  CardContent,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  PasswordInput,
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';

const labelMinWidth = 'min-w-[120px]';

// 비밀번호 변경 페이지
export default function PasswordPage() {
  const { addToast } = useToast();
  const updateMutation = useUpdateCustomerPwMutation();

  /** default form values */
  const defaultValues: PasswordModifyFormSchema = {
    pw: '', // 현재 비밀번호
    pwModify: '', // 새 비밀번호
    pwConfirm: '', // 비밀번호 확인
  };

  /** form - schema connect */
  const form = useForm({
    resolver: zodResolver(passwordModifyFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<PasswordModifyFormSchema> = async (
    data: UpdateMyPasswordPayload,
  ) => {
    try {
      await updateMutation.mutateAsync(data);

      addToast({
        type: 'success',
        message: '변경되었습니다.',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.message,
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-4">
            <FormField
              control={form.control}
              name="pw"
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
                        maxLength={30}
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
              name="pwModify"
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
              name="pwConfirm"
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
                        maxLength={30}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <div className="pt-8">
              <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                수정
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
