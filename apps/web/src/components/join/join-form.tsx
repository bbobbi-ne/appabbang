/**
 * 회원가입 폼
 */

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
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
import { joinSchema, type JoinSchemaType } from '@/validate/join-form-schema';
import ServiceIsAgreedDialog from './service-terms-agreed-dialog';
import PrivacyTermsAgreedDialog from './privacy-terms-agreed-dialog';
import useToast from '@/hooks/useToast';
import { createCustomer } from '@/services/customer-apis';
import { useAccessTokenStore } from '@/store/session';
import { useCustomerStore } from '@/store/customer';

const labelMinWidth = 'min-w-[120px]';

export default function JoinForm() {
  const { addToast } = useToast();
  const { set: setAccessToken } = useAccessTokenStore();
  const { set: setCustomer } = useCustomerStore();

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

  // 폼 선언
  const form = useForm<JoinSchemaType>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      id: '',
      name: '',
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
                  <Input type="text" {...field} placeholder="아이디 입력" maxLength={30} />
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
