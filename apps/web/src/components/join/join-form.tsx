/**
 * 회원가입 폼
 */

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Badge,
  Button,
  Checkbox,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  PasswordInput,
} from '@appabbang/ui';
import DaumPostApi from '@/components/common/daum-post-api';
import { formatMobile } from '@appabbang/utils';
import { joinSchema, validEmail, type JoinSchemaType } from '@/validate/join-form-schema';
import ServiceIsAgreedDialog from './service-terms-agreed-dialog';
import PrivacyTermsAgreedDialog from './privacy-terms-agreed-dialog';
import useToast from '@/hooks/useToast';
import {
  compareCode,
  createCustomer,
  getCheckId,
  getEmail,
  sendEmail,
} from '@/services/customer-apis';
import { useAccessTokenStore, useEmailCodeStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

const labelMinWidth = 'min-w-[120px]';

export default function JoinForm() {
  const { addToast } = useToast();
  const { set: setAccessToken } = useAccessTokenStore();
  const { set: setCustomer } = useCustomerStore();
  const [showCode, setShowCode] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const { code, set: setEmailCode, reset: resetEmailCode } = useEmailCodeStore();
  const [_, setEmail] = useState<string>('');

  /** 전체동의 체크박스 */
  const allCheck = (allAgreed: boolean) => {
    if (allAgreed) {
      form.setValue('isServiceTermsAgreed', true);
      form.setValue('isPrivacyTermsAgreed', true);
      form.setValue('isMarketingTermsAgreed', true);
    } else {
      form.setValue('isServiceTermsAgreed', false);
      form.setValue('isPrivacyTermsAgreed', false);
      form.setValue('isMarketingTermsAgreed', false);
    }
  };

  /** 개별 체크박스 처리 시 전체동의 처리 */
  const individualCheck = () => {
    const service = form.getValues('isServiceTermsAgreed');
    const privacy = form.getValues('isPrivacyTermsAgreed');
    const marketing = form.getValues('isMarketingTermsAgreed');

    service && privacy && marketing
      ? form.setValue('allAgreed', true)
      : form.setValue('allAgreed', false);
  };

  /** 이메일 인증코드 전송 */
  const emailMutation = useMutation({
    mutationFn: (email: string) => sendEmail(email, setEmailCode),
    onSuccess: (status) => {
      if (status === 200) {
        form.setError('email', { type: 'required', message: '' }); // 에러메세지 제거
        setShowCode(true); // 인증코드 input 보이게 처리
      } else addToast({ type: 'error', message: '이메일 전송이 실패되었습니다.' });
    },
    onError: (error) => addToast({ type: 'error', message: error.message }),
  });

  /** 이메일 인증하기 버튼(뱃지) 클릭 */
  const authEmail = async () => {
    if (emailMutation.isPending) return; // 이미 실행중이면 리턴

    const email = form.getValues('email');

    const validFlag = validEmail(email, form); // 이메일만 유효성 검증
    if (!validFlag) return;

    // 이메일 인증 보내기 전에, 이미 DB에 존재하는지 확인 (존재하면 가입불가)
    const response = await getEmail(email);
    if (response.email) {
      addToast({ type: 'error', message: '이미 존재하는 이메일입니다.' });
      return;
    }

    setEmail(email);
    email.trim() !== '' && emailMutation.mutateAsync(email); // 이메일
  };

  /** 인증코드 체크 */
  const checkCode = async (value: string) => {
    if (check) return; // 이미 체크되었으므로 기능을 수행하지 않는다.

    // 이메일 인증코드 비교
    const data = await compareCode(value, code);

    if (data.code === 200) {
      // 인증성공
      form.setError('code', { type: 'value', message: '' });
      setCheck(true);
      resetEmailCode();
    } else {
      // 인증실패
      form.setError('code', { type: 'value', message: '인증번호가 일치하지 않습니다.' });
      setCheck(false);
    }
  };

  /** 이메일 재인증을 위한 상태값 리턴 */
  const returnValidEmail = () => {
    setShowCode(false); // 인증코드 input 리셋
    setCheck(false); // 인증코드 검증 리셋
    resetEmailCode(); // 세션에 저장된 해싱코드 리셋
    form.setValue('code', ''); // 초기화
  };

  /** 아이디 중복체크 */
  const checkId = async (id: string) => {
    if (!id) {
      form.setError('id', { type: 'value', message: '' });
      return;
    }

    const response = await getCheckId(id);
    if (response.id) {
      form.setError('id', { type: 'value', message: '이미 존재하는 아이디입니다.' });
      form.setFocus('id');
    }
  };

  // 폼 선언
  const form = useForm<JoinSchemaType>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      id: '',
      name: '',
      email: '',
      code: '',
      pw: '',
      pwConfirm: '',
      mobileNumber: '',
      address: '',
      addressDetail: '',
      zipcode: '',
      isServiceTermsAgreed: false,
      isPrivacyTermsAgreed: false,
      isMarketingTermsAgreed: false,
      allAgreed: false,
    },
  });

  /**
   * 회원가입 submit 전 핸들러
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 이메일 인증 확인
    if (!check) {
      addToast({ type: 'error', message: '이메일 인증이 필요합니다.' });
      return;
    }

    // 아빠빵 처리방침 3가지 true 확인
    const service = form.getValues('isServiceTermsAgreed');
    const privacy = form.getValues('isPrivacyTermsAgreed');
    if (!(service && privacy)) {
      addToast({
        type: 'error',
        message: '아빠빵 필수 이용약관을 확인 바랍니다.',
      });

      return;
    }

    // success
    form.handleSubmit(onSubmit)(e);
  };

  /**
   * 회원가입 submit
   */
  const onSubmit: SubmitHandler<JoinSchemaType> = (data) => {
    createCustomer(data, setAccessToken, setCustomer);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
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
                    onBlur={(e) => {
                      field.onBlur();
                      checkId(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

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
                  <Input type="text" {...field} placeholder="이름 입력" maxLength={30} />
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
                        onClick={() => checkCode(field.value)}
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

        {/* 비밀번호 */}
        <FormField
          control={form.control}
          name="pw"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 비밀번호
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <PasswordInput {...field} placeholder="비밀번호 입력" maxLength={30} />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 비밀번호 확인 */}
        <FormField
          control={form.control}
          name="pwConfirm"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 비밀번호 확인
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <PasswordInput {...field} placeholder="비밀번호 확인 입력" maxLength={30} />
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
                      const formattedValue = formatMobile(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    maxLength={13}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 주소 */}
        <div className="flex items-center">
          <Label className={`${labelMinWidth} whitespace-nowrap`}>
            <span className="text-red-700">*</span> 주소
          </Label>

          {/* 우편번호 + 주소 검색 */}
          <div className="w-full flex flex-col gap-2">
            <div>
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem className="flex gap-2">
                    <FormControl>
                      <Input {...field} placeholder="우편 번호" disabled className="mb-0" />
                    </FormControl>

                    <DaumPostApi
                      setAddress={(data) => {
                        if (!data) return;
                        form.setValue('zipcode', data[0] ?? '');
                        form.setValue('address', data[1] ?? '');
                      }}
                      variant="secondary"
                    />
                  </FormItem>
                )}
              />
            </div>

            {/* 주소 */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <div className="w-full space-y-1">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input {...field} placeholder="주소" disabled />
                      </FormControl>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* 상세 주소 */}
            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <div className="w-full space-y-1">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="상세 주소"
                          disabled={!form.watch('zipcode')}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-0">
          {/* 전체동의 */}
          <FormField
            control={form.control}
            name="allAgreed"
            render={({ field }) => (
              <FormItem className="mt-2 mb-2">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked);
                          allCheck(checked);
                        }}
                        className="mb-0"
                      />
                    </FormControl>

                    <FormLabel
                      errorCheck={false}
                      className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                    >
                      아래 이용약관을 전체 동의합니다.
                    </FormLabel>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* 서비스 이용약관 동의여부 */}
          <FormField
            control={form.control}
            name="isServiceTermsAgreed"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked);
                          individualCheck();
                        }}
                        className="mb-0"
                      />
                    </FormControl>

                    <FormLabel
                      errorCheck={false}
                      className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                    >
                      아빠빵 서비스 이용약관 처리방침에 동의합니다.
                    </FormLabel>
                  </div>

                  <div className="flex-shrink-0">
                    <ServiceIsAgreedDialog>
                      <Button type="button" variant="link" className="text-xs p-o">
                        약관보기
                      </Button>
                    </ServiceIsAgreedDialog>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* 개인정보 수집, 이용 동의여부 */}
          <FormField
            control={form.control}
            name="isPrivacyTermsAgreed"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked);
                          individualCheck();
                        }}
                        className="mb-0"
                      />
                    </FormControl>

                    <FormLabel
                      errorCheck={false}
                      className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                    >
                      아빠빵 개인정보 수집 및 이용 처리방침에 동의합니다.
                    </FormLabel>
                  </div>

                  <PrivacyTermsAgreedDialog>
                    <Button type="button" variant="link" className="text-xs p-o">
                      약관보기
                    </Button>
                  </PrivacyTermsAgreedDialog>
                </div>
              </FormItem>
            )}
          />

          {/* 마케팅 목적 개인정보 이용 및 광고 수신 동의여부 */}
          <FormField
            control={form.control}
            name="isMarketingTermsAgreed"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked);
                          individualCheck();
                        }}
                        className="mb-0"
                      />
                    </FormControl>

                    <FormLabel
                      errorCheck={false}
                      className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                    >
                      마케팅 목적 개인정보 이용 처리방침에 동의합니다. (선택)
                    </FormLabel>
                  </div>

                  <ServiceIsAgreedDialog>
                    <Button type="button" variant="link" className="text-xs p-o">
                      약관보기
                    </Button>
                  </ServiceIsAgreedDialog>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8 flex gap-2 pb-10">
          <Button type="submit" className="w-full">
            가입하기
          </Button>
        </div>
      </form>
    </Form>
  );
}
