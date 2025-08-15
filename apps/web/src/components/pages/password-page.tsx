import { updateCustomerPw, type CustomerPwType } from '@/services/customer-apis';
import { useAccessTokenStore } from '@/store/session';
import {
  passwordModifyFormSchema,
  type PasswordModifyFormSchema,
} from '@/validate/password-modify-form-schema';
import {
  Button,
  Card,
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
  const { accessToken } = useAccessTokenStore();

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

  /**
   * form handler
   */
  const onFormHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    form.handleSubmit(onSubmit)(e);
  };

  /**
   * form submit - 비밀번호 변경
   */
  const onSubmit: SubmitHandler<PasswordModifyFormSchema> = (data: CustomerPwType) => {
    (async () => {
      await updateCustomerPw(data, accessToken);

      // 비밀번호는 민감정보이므로 세팅하지 않고 빈값으로 처리
      form.setValue('pw', '');
      form.setValue('pwModify', '');
      form.setValue('pwConfirm', '');
    })();
  };

  return (
    <div className="w-full flex flex-row items-center justify-center">
      <Card className="p-10 flex flex-row items-center justify-center w-2/3">
        <Form {...form}>
          <form onSubmit={onFormHandler} className="w-2/3 *:m-2 *:has-[.submitBtn]:mt-5">
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
