/**
 * 내 정보수정
 */

import { customerFormSchema, type CustomerFormSchema } from '@/validate/info-form-schema';
import {
  Badge,
  Button,
  Card,
  CardContent,
  cn,
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
import { useEffect, useState } from 'react';
import { formatIsoToDateTime, formatMobile } from '@appabbang/utils';
import useToast from '@/hooks/useToast';
import type { GetMyData } from '@/api/data-contracts';
import {
  useCompareEmailCodeMutation,
  useGetEmailMutation,
  useSendEmailMutation,
} from '@/hooks/use-customer';
import { validEmail } from '@/validate/join-form-schema';

interface InfoFormProps {
  customer: GetMyData;
  updateMutation: (data: CustomerFormSchema) => Promise<void>;
  isSubmitting: boolean;
}

const labelMinWidth = 'min-w-[120px]';

export default function InfoForm({ customer, updateMutation, isSubmitting }: InfoFormProps) {
  const { addToast } = useToast();
  const [showCode, setShowCode] = useState<boolean>(false);
  const [hashedCode, setHashedCode] = useState<string>('');
  const [check, setCheck] = useState<boolean>(false);

  const getEmail = useGetEmailMutation(); // 이메일 가져오기
  const sendEmail = useSendEmailMutation(); // 입력한 이메일로 인증코드 전송
  const compareEmailCode = useCompareEmailCodeMutation(); // 이메일 인증번호 비교

  /** 고객정보 수정 */
  const onSubmit: SubmitHandler<CustomerFormSchema> = async (data) => {
    try {
      const email = form.getValues('email');
      // 현재 등록된 이메일과 입력한 이메일이 동일하지 않을 때는 이메일 인증 검토가 필요하다.
      if (customer.email !== email) {
        if (!check) {
          addToast({ type: 'error', message: '이메일 인증이 필요합니다.' });
          return;
        }
      }

      await updateMutation(data);
      addToast({ type: 'success', message: '변경되었습니다.' });
      returnValidEmail();
    } catch (error: any) {
      addToast({ type: 'error', message: error.message });
    }
  };

  /** 고객 정보가 존재하면 form에 세팅하고, 없으면 리셋 */
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name ?? '',
        id: customer.id ?? '',
        email: customer.email ?? '',
        code: '',
        mobileNumber: customer.mobileNumber ?? '',
        createdAt: formatIsoToDateTime(customer.createdAt) ?? '',
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
          email: customer.email || '',
          code: '',
          mobileNumber: customer.mobileNumber || '',
          createdAt: formatIsoToDateTime(customer.createdAt) || '',
        }
      : undefined,
  });

  /** 이메일 인증 */
  const authEmail = async () => {
    if (sendEmail.isPending) return; // 이미 실행중이면 리턴

    const email = form.getValues('email');
    const validFlag = validEmail(email, form); // 이메일만 유효성 검증
    if (!validFlag) return;

    if (customer.email === email) {
      addToast({ type: 'warning', message: '이미 인증된 이메일입니다.' });
      return;
    }

    try {
      // 이메일 인증 보내기 전에, DB에 등록된 이메일과 동일한지 확인
      const response = await getEmail.mutateAsync({ email });
      if (response && customer.no !== response.no) {
        addToast({ type: 'error', message: '이미 존재하는 이메일입니다.' });
        return;
      }

      const result = await sendEmail.mutateAsync({ email }); // 이메일
      setHashedCode(result.code);
      form.clearErrors('email');
      setShowCode(true);
    } catch (e) {
      addToast({ type: 'error', message: '이메일 인증 과정에서 문제가 발생했습니다.' });
    }
  };

  /** 이메일 재인증을 위한 상태값 리턴 */
  const returnValidEmail = () => {
    setShowCode(false); // 인증코드 input 리셋
    setCheck(false); // 인증코드 검증 리셋
    setHashedCode(''); // 해싱코드 리셋
    form.setValue('code', ''); // 초기화
  };

  /** 이메일 인증번호 체크하기 */
  const checkCode = async (value: string) => {
    if (check) return; // 이미 체크되었으므로 기능을 수행하지 않는다.

    // 이메일 인증코드 비교
    try {
      const result = await compareEmailCode.mutateAsync({ code: value, hashedCode });
      if (Number(result.code) === 200) {
        form.clearErrors('code');
        setCheck(true);
        setHashedCode('');
      } else {
        form.setError('code', { type: 'value', message: '인증번호가 일치하지 않습니다.' });
        setCheck(false);
      }
    } catch (e) {
      addToast({ type: 'error', message: '이메일 인증코드 비교 과정에서 오류가 발생했습니다.' });
    }
  };

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

            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                    <span className="text-red-700">*</span> 이메일
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <div className="flex flex-row relative">
                        <Input
                          type="email"
                          {...field}
                          placeholder="이메일 입력"
                          maxLength={50}
                          disabled={showCode} // 인증 완료되고나면 수정불가
                        />
                        {!showCode ? (
                          <Badge
                            variant="secondary"
                            onClick={authEmail}
                            className={cn(
                              'cursor-pointer absolute right-2 top-1/2 -translate-y-1/2',
                              showCode
                                ? 'bg-gray-300 text-white dark:bg-gray-300'
                                : 'bg-green-700 text-white dark:bg-green-700',
                              showCode ? 'hidden' : '',
                            )}
                          >
                            인증
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            onClick={returnValidEmail}
                            className={cn(
                              'cursor-pointer absolute right-2 top-1/2 -translate-y-1/2',
                              !showCode
                                ? 'bg-gray-300 text-white dark:bg-gray-300'
                                : 'bg-green-700 text-white dark:bg-green-700',
                            )}
                          >
                            재인증
                          </Badge>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            {/* 인증코드 */}
            {showCode ? (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                      <span className="text-red-700">*</span> 인증코드
                    </FormLabel>

                    <div className="w-full space-y-1">
                      <FormControl>
                        <div className="flex flex-row relative">
                          <Input
                            type="text"
                            {...field}
                            placeholder="인증코드 입력"
                            maxLength={6}
                            disabled={check}
                          />
                          <Badge
                            variant="secondary"
                            onClick={() => checkCode(field.value as string)}
                            className={cn(
                              'cursor-pointer absolute right-2 top-1/2 -translate-y-1/2',
                              check
                                ? 'bg-green-700 text-white dark:bg-green-700'
                                : 'bg-gray-700 text-white dark:bg-gray-700',
                            )}
                          >
                            {check ? '확인완료' : '확인'}
                          </Badge>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />
            ) : null}

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
                          const formattedValue = formatMobile(e.target.value);
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
