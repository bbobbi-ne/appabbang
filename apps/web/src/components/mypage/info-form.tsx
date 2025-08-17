/**
 * 내 정보수정
 */

import { customerFormSchema, type CustomerFormSchema } from '@/validate/info-form-schema';
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
import type { ICustomerProps } from '../pages/info-page';
import Loading from '../common/loading';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { updateCustomer } from '@/services/customer-apis';
import { getFormattedMobile } from '@/utils';

interface InfoFormProps {
  customer?: ICustomerProps;
}

const labelMinWidth = 'min-w-[120px]';

function InfoForm({ customer }: InfoFormProps) {
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name ?? '',
        id: customer.id ?? '',
        mobileNumber: customer.mobileNumber ?? '',
        createdAt: dayjs(customer.createdAt).format('YYYY-MM-DD HH:mm:ss') ?? '',
      });
    }
  }, [customer]);

  /** form - schema connect */
  const form = useForm({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? {
          name: customer.name || '',
          id: customer.id || '',
          mobileNumber: customer.mobileNumber || '',
          createdAt: dayjs(customer.createdAt).format('YYYY-MM-DD HH:mm:ss') || '',
        }
      : undefined,
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
  const onSubmit: SubmitHandler<CustomerFormSchema> = (data) => {
    (async () => {
      const { mobileNumber } = await updateCustomer(data);

      // 변경된 값으로 form 설정
      form.setValue('mobileNumber', mobileNumber);
    })();
  };

  if (!customer) return <Loading />;
  return (
    <div className="w-full flex flex-row items-center justify-center">
      <Card className="p-10 flex flex-row items-center justify-center w-2/3">
        <Form {...form}>
          <form onSubmit={onFormHandler} className="w-2/3 *:m-2 *:has-[.submitBtn]:mt-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                    <span className="text-red-700">*</span> 이름
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="이름 입력"
                        maxLength={30}
                        value={field.value ?? ''}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                    <span className="text-red-700">*</span> 아이디
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="아이디 입력"
                        maxLength={30}
                        value={field.value ?? ''}
                        disabled
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            {/* 휴대번호 */}
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                    <span className="text-red-700">*</span> 휴대번호
                  </FormLabel>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="휴대번호 입력"
                        onChange={(e) => {
                          const formattedValue = getFormattedMobile(e.target.value);
                          field.onChange(formattedValue);
                        }}
                        maxLength={13}
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
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                    <span className="text-red-700 ml-2"></span> 가입일자
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        placeholder="가입일자 입력"
                        maxLength={30}
                        value={field.value ?? ''}
                        disabled
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

export default InfoForm;
