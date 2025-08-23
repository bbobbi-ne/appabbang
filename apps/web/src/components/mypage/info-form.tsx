/**
 * 내 정보수정
 */

import { customerFormSchema, type CustomerFormSchema } from '@/validate/info-form-schema';
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
  Input,
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { ICustomerProps } from '../pages/info-page';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { getFormattedMobile } from '@/utils';
import useToast from '@/hooks/useToast';

interface InfoFormProps {
  customer?: ICustomerProps;
  updateMutation: (data: CustomerFormSchema) => Promise<void>;
  isSubmitting: boolean;
}

const labelMinWidth = 'min-w-[120px]';

export default function InfoForm({ customer, updateMutation, isSubmitting }: InfoFormProps) {
  const { addToast } = useToast();

  const onSubmit: SubmitHandler<CustomerFormSchema> = async (data) => {
    try {
      await updateMutation(data);

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

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-lg space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                    이름
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
                    아이디
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
                    <span className="text-destructive">*</span> 휴대번호
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
                    가입일자
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

            <div className="pt-8">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                수정
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
