import {
  Form,
  FormLabel,
  FormMessage,
  FormItem,
  FormControl,
  Input,
  FormField,
  Label,
  Button,
  PasswordInput,
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Checkbox,
} from '@appabbang/ui';
import { formatMobile } from '@appabbang/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useGetCommonCodesQuery } from '@/hooks/use-common-code';
import { orderFormSchema, type OrderFormSchema } from '@/validate/order-form-schema';

// TODO: 점검 및 정리 필요 (약관들)
import ServiceIsAgreedDialog from '../join/service-terms-agreed-dialog';
import PrivacyTermsAgreedDialog from '../join/privacy-terms-agreed-dialog';
import PaymentRefundTermsAgreedDialog from '../join/privacy-terms-agreed-dialog';
import { MyAddressListDialog } from '@/components/order-round/my-address-list-dialog';
import { OrderAddressForm } from '@/components/order-round/order-address-form';

type Props = {
  isDelivery: boolean;
  myContact: any;
  buttonArea: (props: { form: any }) => React.ReactNode;
};

const labelMinWidth = 'min-w-[120px]';

export const OrderForm = ({ isDelivery, myContact, buttonArea }: Props) => {
  /** 은행 목록 API */
  const { data: bankData } = useGetCommonCodesQuery('bank_code');

  // 폼 선언
  const form = useForm<OrderFormSchema>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      ordererName: '',
      ordererMobile: '',
      recipientName: '',
      recipientMobile: '',
      address: '',
      addressDetail: '',
      zipcode: '',
      message: '',
      bankCode: '',
      accountNumber: '',
      accountHolderName: '',
      orderPw: '',
      isServiceTermsAgreed: false,
      isPrivacyTermsAgreed: false,
      isPaymentRefundTermsAgreed: false,
      isDelivery: isDelivery,
      isMember: !!myContact,
    },
  });

  const handleSelectAddress = (item: any) => {
    form.setValue('recipientName', item.recipientName);
    form.setValue('recipientMobile', item.recipientMobile);
    form.setValue('address', item.address);
    form.setValue('addressDetail', item.addressDetail);
    form.setValue('zipcode', item.zipcode);
    form.setValue('message', item.message);

    form.clearErrors('recipientName');
    form.clearErrors('recipientMobile');
    form.clearErrors('address');
    form.clearErrors('addressDetail');
    form.clearErrors('zipcode');
    form.clearErrors('message');
  };
  // // 주문 생성
  // const createOrder = async (data: any) => {
  //   await onSubmit(data);
  // };

  useEffect(() => {
    if (!isDelivery) {
      form.setValue('isDelivery', false);
      // 배송정보 초기화
      form.setValue('recipientName', '');
      form.setValue('recipientMobile', '');
      form.setValue('address', '');
      form.setValue('addressDetail', '');
      form.setValue('zipcode', '');
      form.setValue('message', '');
    } else {
      form.setValue('isDelivery', true);
    }
  }, [isDelivery]);

  useEffect(() => {
    if (myContact) {
      form.setValue('isMember', true);
      form.setValue('ordererName', myContact.name);
      form.setValue('ordererMobile', myContact.mobileNumber);
    } else {
      form.setValue('isMember', false);
      form.setValue('ordererName', '');
      form.setValue('ordererMobile', '');
    }
  }, [myContact]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        {/* 주문자 이름 */}
        <FormField
          control={form.control}
          name="ordererName"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-destructive">*</span> 주문자 이름
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="주문자 이름을 입력해주세요"
                    maxLength={10}
                    readOnly={!!myContact}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 연락처 */}
        <FormField
          control={form.control}
          name="ordererMobile"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-destructive">*</span> 주문자 연락처
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="주문자 연락처를 입력해주세요"
                    onChange={(e) => {
                      const formattedValue = formatMobile(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    maxLength={13}
                    readOnly={!!myContact}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <div className="pt-2" />

        {myContact && isDelivery && (
          <div>
            <MyAddressListDialog handleSelectAddress={handleSelectAddress}>
              <Button className="flex ml-auto">나의 배송지 목록 불러오기</Button>
            </MyAddressListDialog>
            <p className="text-sm">
              <u>나의 배송지 정보를 불러와주세요</u>
            </p>
          </div>
        )}

        {!myContact && isDelivery && (
          <p className="text-sm">
            <u>배송지 정보를 입력해주세요.</u>
          </p>
        )}

        {isDelivery && (
          <OrderAddressForm form={form} isMember={!!myContact} labelMinWidth={labelMinWidth} />
        )}

        <div className="pt-2" />

        <p className="text-sm">
          <u>환불 받으실 계좌 정보를 입력해주세요.</u>
          <br />
          <span className="text-xs text-muted-foreground">
            (입금 계좌와 동일한 계좌로 환불 받으실 수 있습니다.)
          </span>
        </p>

        {/* 은행 정보 */}
        <FormField
          control={form.control}
          name="bankCode"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel
                htmlFor="bankCode"
                errorCheck={false}
                className={`${labelMinWidth} whitespace-nowrap`}
              >
                <span className="text-destructive">*</span> 은행
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="bankCode" className="w-full">
                      <SelectValue placeholder="은행을 선택해주세요." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>은행</SelectLabel>
                        {bankData?.map((bank: any, idx: number) => {
                          return (
                            <SelectItem
                              key={`bank-${bank.code}-${idx}`}
                              // {...field}
                              // {...form.register('bankCode')}
                              value={bank.code}
                            >
                              {bank.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 계좌번호  */}
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-destructive">*</span> 계좌번호
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="계좌번호를 입력해주세요" />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 예금주  */}
        <FormField
          control={form.control}
          name="accountHolderName"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-destructive">*</span> 예금주
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="예금주를 입력해주세요" />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {!myContact && (
          <>
            <div className="pt-2" />
            <p className="text-sm">
              <u>주문서 비밀번호를 입력해주세요.</u>
            </p>

            <FormField
              control={form.control}
              name="orderPw"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                    <span className="text-destructive">*</span> 주문서 비밀번호
                  </FormLabel>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <PasswordInput {...field} placeholder="주문서 비밀번호를 입력해주세요" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />
          </>
        )}
        <div className="pt-2" />

        <p className="text-sm">
          <u>약관 동의</u>
        </p>

        {/* 비회원 약관 동의  */}
        {!myContact && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 h-8">
              <Checkbox
                id="allAgreed"
                checked={
                  form.watch('isServiceTermsAgreed') &&
                  form.watch('isPrivacyTermsAgreed') &&
                  form.watch('isPaymentRefundTermsAgreed')
                }
                onCheckedChange={(checked: boolean) => {
                  form.setValue('isServiceTermsAgreed', checked);
                  form.setValue('isPrivacyTermsAgreed', checked);
                  form.setValue('isPaymentRefundTermsAgreed', checked);
                }}
              />
              <Label
                htmlFor="allAgreed"
                className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
              >
                아래 이용약관을 전체 동의합니다.
              </Label>
            </div>

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
                          }}
                        />
                      </FormControl>

                      <FormLabel
                        errorCheck={false}
                        className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                      >
                        [필수] 아빠빵 서비스 이용약관 처리방침에 동의합니다.
                      </FormLabel>
                    </div>

                    <div className="flex-shrink-0">
                      <ServiceIsAgreedDialog>
                        <Button type="button" variant="link" className="text-xs p-0">
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
                          }}
                        />
                      </FormControl>

                      <FormLabel
                        errorCheck={false}
                        className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                      >
                        [필수] 아빠빵 개인정보 수집 및 이용 처리방침에 동의합니다.
                      </FormLabel>
                    </div>

                    <PrivacyTermsAgreedDialog>
                      <Button type="button" variant="link" className="text-xs p-0">
                        약관보기
                      </Button>
                    </PrivacyTermsAgreedDialog>
                  </div>
                </FormItem>
              )}
            />

            {/* 결제 환불 약관 동의여부 */}
            <FormField
              control={form.control}
              name="isPaymentRefundTermsAgreed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>

                      <FormLabel
                        errorCheck={false}
                        className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                      >
                        [필수] 아빠빵 결제 환불 처리방침에 동의합니다.
                      </FormLabel>
                    </div>

                    <div className="flex-shrink-0">
                      <PaymentRefundTermsAgreedDialog>
                        <Button type="button" variant="link" className="text-xs p-0">
                          약관보기
                        </Button>
                      </PaymentRefundTermsAgreedDialog>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        {/* 회원 약관 동의  */}
        {myContact && (
          <div>
            {/* 결제 환불 약관 동의여부 */}
            <FormField
              control={form.control}
              name="isPaymentRefundTermsAgreed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>

                      <FormLabel
                        errorCheck={false}
                        className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                      >
                        [필수] 아빠빵 결제 환불 처리방침에 동의합니다.
                      </FormLabel>
                    </div>

                    <div className="flex-shrink-0">
                      <ServiceIsAgreedDialog>
                        <Button type="button" variant="link" className="text-xs p-0">
                          약관보기
                        </Button>
                      </ServiceIsAgreedDialog>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="pt-4" />

        {buttonArea({ form })}
      </form>
    </Form>
  );
};
