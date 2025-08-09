/**
 * 내 정보수정
 */

import { customerFormSchema, type CustomerFormSchema } from '@/validate/form-schema';
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

function InfoForm() {
  /** default form values */
  const defaultValues: CustomerFormSchema = {
    name: '', // 이름
    id: '', // 아이디
    mobileNumber: '', // 휴대번호
    createdAt: '', // 가입일자(등록일자)
  };

  /** form - schema connect */
  const form = useForm({
    resolver: zodResolver(customerFormSchema),
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
  const onSubmit: SubmitHandler<CustomerFormSchema> = (data) => {};

  return (
    <Card className="p-10 flex flex-row items-center justify-center w-2/3">
      <Form {...form}>
        <form onSubmit={onFormHandler} className="w-2/3 *:m-2 *:has-[.submitBtn]:mt-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full m-auto flex flex-row items-center justify-center">
                <FormLabel htmlFor="name" errorCheck={false} className="w-25">
                  <span className="text-red-700">*</span> 이름
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="name"
                    placeholder="이름 입력"
                    {...field}
                    onChange={(e) => field.onChange(e)}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="w-full m-auto flex flex-row items-center justify-center">
                <FormLabel htmlFor="id" errorCheck={false} className="w-25">
                  <span className="text-red-700">*</span> 아이디
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="id"
                    placeholder="아이디 입력"
                    {...field}
                    onChange={(e) => field.onChange(e)}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem className="w-full m-auto flex flex-row items-center justify-center">
                <FormLabel htmlFor="mobileNumber" errorCheck={false} className="w-25">
                  <span className="text-red-700">*</span> 휴대번호
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="mobileNumber"
                    placeholder="휴대번호 입력"
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
            name="createdAt"
            render={({ field }) => (
              <FormItem className="w-full m-auto flex flex-row items-center justify-center">
                <FormLabel htmlFor="createdAt" errorCheck={false} className="w-25">
                  <span className="ml-2">가입일자</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="createdAt"
                    {...field}
                    placeholder="가입일자 입력"
                    onChange={(e) => field.onChange(e)}
                    disabled
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
  );
}

export default InfoForm;
