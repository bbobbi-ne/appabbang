import type { BankCodeProps, DeliveryProps } from '@/interface/bread-interface';
import type { CustomerOrderFormSchema } from '@/validate/order-form-schema';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import DaumPostApi from '../common/daum-post-api';
import { useQuery } from '@tanstack/react-query';
import { getCustomerInfo } from '@/services/customer-apis';
import { useAccessTokenStore } from '@/store/session';
import Loading from '../common/loading';
import PrivacyTermsAgreedDialog from '../join/privacy-terms-agreed-dialog';
import ServiceIsAgreedDialog from '../join/service-terms-agreed-dialog';
import PaymentRefundTermsAgreedDialog from './payment-refund-terms-agreed-dialog';

interface CustomerOrderFormProp {
  form: UseFormReturn<CustomerOrderFormSchema>;
  onSelectedDeliveryTp: (delivery: string) => void;
  bank: {
    bankLoading: boolean;
    bankData: BankCodeProps[] | undefined;
  };
  delivery: {
    deliveryLoading: boolean;
    deliveryData: DeliveryProps[] | undefined;
  };
  handleOrderSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  save: boolean;
}

function CustomerOrderForm({
  form,
  onSelectedDeliveryTp,
  bank,
  delivery,
  handleOrderSubmit,
  save,
}: CustomerOrderFormProp) {
  const [deliveryMethodNo, setDeliveryMethodNo] = useState<string>('');
  const [same, setSame] = useState<boolean>(false);
  const { bankLoading, bankData } = bank;
  const { deliveryLoading, deliveryData } = delivery;
  const [checked, setChecked] = useState<boolean>(false); // 주문자-수령인 동일인물 체크여부
  const [disabledAddrDtl, setDisabledAddrDtl] = useState<boolean>(true);
  const { accessToken } = useAccessTokenStore();

  /** 고객정보 조회 */
  const { isLoading, data } = useQuery({
    queryKey: ['getCustomer'],
    queryFn: getCustomerInfo,
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        ordererName: data.customer.name ?? '',
        ordererMobile: data.customer.mobileNumber ?? '',
        recipientName: data.customer.address?.[0]?.recipientName ?? '',
        recipientMobile: data.customer.address?.[0]?.recipientMobile ?? '',
        address: data.customer.address?.[0]?.address ?? '',
        addressDetail: data.customer.address?.[0]?.addressDetail ?? '',
        zipcode: data.customer.address?.[0]?.zipcode ?? '',
        message: data.customer.address?.[0]?.message ?? '',
        bankCode: '',
        accountNumber: '',
        accountHolderName: '',
        deliveryMethodNo: '',
        same: false,
        totalPrice: 0,
        discountAmount: 0,
        isServiceTermsAgreed: data.customer.isServiceTermsAgreed ?? false,
        isPrivacyTermsAgreed: data.customer.isPrivacyTermsAgreed ?? false,
      });
    }
  }, [data, form]);

  /** 주소 API로 받아온 결과값을 상태값과 form value값에 대입한다. */
  const setFormAddress = (newAddrList: string[]) => {
    const [zipcode, address, addressDetail] = newAddrList;
    zipcode && form.setValue('zipcode', zipcode); // 우편번호

    if (address && addressDetail) {
      form.setValue('address', `${address}(${addressDetail})`); // 주소(상세주소)
      setDisabledAddrDtl(false);
    }
  };

  /** 주문자-수령인 정보가 동일하지 않을 때 */
  const checkedRecipient = (_: React.ChangeEvent<HTMLInputElement>) => {
    checked && setSame(false);
    form.setValue('same', false);
  };

  if (isLoading) return <Loading />;

  return (
    <Form {...form}>
      <form onSubmit={handleOrderSubmit} className="w-2/3">
        <div className="flex items-start mt-5 mb-5 pl-10 pr-10">
          <FormField
            control={form.control}
            name="ordererName"
            render={({ field }) => (
              <FormItem className="w-full mr-2">
                <FormLabel htmlFor="ordererName" errorCheck={false}>
                  <span className="text-red-700">*</span> 주문자
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="ordererName"
                    placeholder="주문자 이름 입력"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      field.onChange(e);
                      checkedRecipient(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ordererMobile"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="ordererMobile" errorCheck={false}>
                  <span className="text-red-700">*</span> 주문자 전화번호
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="ordererMobile"
                    {...field}
                    {...form.register('ordererMobile')}
                    value={field.value ?? ''}
                    placeholder="주문자 전화번호 입력"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3 pl-10 pr-10">
          <FormField
            control={form.control}
            name="same"
            render={({ field }) => (
              <FormItem className="flex gap-2">
                <FormControl>
                  <Checkbox
                    id="same"
                    checked={field.value}
                    onCheckedChange={(flag) => {
                      // 주문자와 수령인이 동일하면 true
                      if (flag) {
                        setSame(true);
                        setChecked(true);
                        form.setValue('recipientName', form.getValues('ordererName')); // 수령인
                        form.setValue('recipientMobile', form.getValues('ordererMobile')); // 수령인 전화번호
                      } else {
                        setSame(false);
                        setChecked(false);
                        form.setValue('recipientName', ''); // 수령인
                        form.setValue('recipientMobile', ''); // 수령인 전화번호
                      }

                      field.onChange(flag);
                    }}
                  />
                </FormControl>
                <FormLabel htmlFor="same" errorCheck={false}>
                  주문자와 수령인 정보가 동일합니다.
                </FormLabel>
              </FormItem>
            )}
          ></FormField>
        </div>

        <div className="flex items-start mt-5 mb-5 pl-10 pr-10">
          <FormField
            control={form.control}
            name="recipientName"
            render={({ field }) => (
              <FormItem className="w-full mr-2">
                <FormLabel htmlFor="recipientName" errorCheck={false}>
                  <span className="text-red-700">*</span> 수령인
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="recipientName"
                    placeholder="수령인 입력"
                    disabled={same ? true : false}
                    {...field}
                    {...form.register('recipientName')}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipientMobile"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="recipientMobile" errorCheck={false}>
                  <span className="text-red-700">*</span> 수령인 전화번호
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="recipientMobile"
                    disabled={same ? true : false}
                    {...field}
                    {...form.register('recipientMobile')}
                    value={field.value ?? ''}
                    placeholder="수령인 전화번호 입력"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-start justify-center mt-5 pl-10 pr-10 gap-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-2/3">
                <FormLabel htmlFor="address" errorCheck={false}>
                  <span className="text-red-700">*</span> 배송지 주소
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="address"
                    className="w-full"
                    disabled
                    placeholder="배송지 주소 입력"
                    {...field}
                    {...form.register('address')}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DaumPostApi setAddress={setFormAddress} className="mt-6 mb-5 w-20 mr-4" />

          <FormField
            control={form.control}
            name="addressDetail"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel htmlFor="addressDetail" errorCheck={false}>
                  <span className="text-red-700">*</span> 배송지 상세주소
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="addressDetail"
                    className="w-full"
                    placeholder="배송지 상세주소 입력"
                    disabled={disabledAddrDtl}
                    {...field}
                    {...form.register('addressDetail')}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
              <FormLabel htmlFor="zipcode" hidden errorCheck={false}>
                <span className="text-red-700">*</span> 우편번호
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="zipcode"
                  className="w-full"
                  hidden
                  placeholder="우편번호 입력"
                  {...field}
                  {...form.register('zipcode')}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-start mt-5 mb-5 pl-9 pr-10 w-full">
          <FormField
            control={form.control}
            name="bankCode"
            render={({ field }) => (
              <FormItem className="pl-1 pr-1">
                <FormLabel htmlFor="bankCode" errorCheck={false}>
                  <span className="text-red-700">*</span> 은행코드
                </FormLabel>
                <FormControl>
                  {bankLoading ? (
                    <Select>
                      <SelectTrigger id="bankCode" className="w-full">
                        <SelectValue placeholder="선택할 목록이 존재하지 않습니다..." />
                      </SelectTrigger>
                    </Select>
                  ) : (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="bankCode" className="w-[150px]">
                        <SelectValue placeholder="은행 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>은행</SelectLabel>
                          {bankData?.map((bank: BankCodeProps, idx: number) => {
                            return (
                              <SelectItem
                                key={idx}
                                {...field}
                                {...form.register('deliveryMethodNo')}
                                value={bank.code}
                              >
                                {bank.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem className="ml-1 mr-1 w-[250px]">
                <FormLabel htmlFor="accountNumber" errorCheck={false}>
                  <span className="text-red-700">*</span> 계좌번호
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="accountNumber"
                    placeholder="계좌번호 입력"
                    {...field}
                    {...form.register('accountNumber')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountHolderName"
            render={({ field }) => (
              <FormItem className="ml-1 mr-1 w-[250px]">
                <FormLabel htmlFor="accountHolderName" errorCheck={false}>
                  <span className="text-red-700">*</span> 예금주
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="accountHolderName"
                    placeholder="예금주 입력"
                    {...field}
                    {...form.register('accountHolderName')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-start mt-5 mb-5 pl-9 pr-10 w-full">
          <FormField
            control={form.control}
            name="deliveryMethodNo"
            render={({ field }) => (
              <FormItem className="pl-1 pr-1">
                <FormLabel htmlFor="deliveryMethodNo" errorCheck={false}>
                  <span className="text-red-700">*</span> 배송방법
                </FormLabel>
                <FormControl>
                  {deliveryLoading ? (
                    <Select>
                      <SelectTrigger id="deliveryMethodNo" className="w-[150px]">
                        <SelectValue placeholder="선택할 목록이 존재하지 않습니다..." />
                      </SelectTrigger>
                    </Select>
                  ) : (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);

                        // 현재 select에 선택된 option value와 동일한 데이터의 deliveryType 값을 저장한다.
                        const found = deliveryData?.find(
                          ({ no }: DeliveryProps) => no.toString() === value,
                        );
                        // 배송방법이 없으면 기본값 설정(공백)
                        const deliveryType = found?.deliveryTypeCode ?? '';

                        setDeliveryMethodNo(deliveryType);
                        onSelectedDeliveryTp(deliveryType);
                        deliveryType !== '10' && form.setValue('message', ''); // 배송타입이 10이 아니면 배송메세지는 공백처리
                      }}
                    >
                      <SelectTrigger id="deliveryMethodNo" className="w-[150px]">
                        <SelectValue placeholder="배송방법 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>배송방법</SelectLabel>
                          {deliveryData?.map((delivery: DeliveryProps, idx: number) => {
                            return (
                              <SelectItem
                                key={idx}
                                {...field}
                                {...form.register('deliveryMethodNo')}
                                value={delivery.no.toString()}
                              >
                                {delivery.name}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="pl-1 pr-1 w-full">
                <FormLabel htmlFor="message" errorCheck={false}>
                  배송 메세지
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="message"
                    placeholder="배송 메세지 입력"
                    disabled={deliveryMethodNo !== '10'}
                    {...field}
                    {...form.register('message')}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-0 items-center">
          {/* 서비스 이용약관 동의여부 */}
          <FormField
            control={form.control}
            name="isServiceTermsAgreed"
            render={({ field }) => (
              <FormItem className="w-2/3 pl-10 pr-10">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mb-0"
                      />
                    </FormControl>

                    <FormLabel
                      errorCheck={false}
                      className="whitespace-nowrap cursor-pointer text-xs"
                    >
                      아빠빵 서비스 이용약관 처리방침에 동의합니다.
                    </FormLabel>
                  </div>

                  <ServiceIsAgreedDialog>
                    <Button type="button" variant="link" className="text-xs ml-auto pr-2">
                      약관보기
                    </Button>
                  </ServiceIsAgreedDialog>
                </div>
              </FormItem>
            )}
          />

          {/* 개인정보 수집, 이용 동의여부 */}
          <FormField
            control={form.control}
            name="isPrivacyTermsAgreed"
            render={({ field }) => (
              <FormItem className="w-2/3 pl-10 pr-10">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mb-0"
                      />
                    </FormControl>

                    <FormLabel
                      errorCheck={false}
                      className="whitespace-nowrap cursor-pointer text-xs"
                    >
                      아빠빵 개인정보 수집 및 이용 처리방침에 동의합니다.
                    </FormLabel>
                  </div>

                  <PrivacyTermsAgreedDialog>
                    <Button type="button" variant="link" className="text-xs ml-auto pr-2">
                      약관보기
                    </Button>
                  </PrivacyTermsAgreedDialog>
                </div>
              </FormItem>
            )}
          />

          {/* 결제/환불 약관 동의여부 */}
          <FormField
            control={form.control}
            name="isPaymentRefundTermsAgreed"
            render={({ field }) => (
              <FormItem className="w-2/3 pl-10 pr-10">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mb-0"
                      />
                    </FormControl>

                    <FormLabel
                      errorCheck={false}
                      className="whitespace-nowrap cursor-pointer text-xs"
                    >
                      아빠빵 결제 및 환불 처리방침에 동의합니다.
                    </FormLabel>
                  </div>

                  <PaymentRefundTermsAgreedDialog>
                    <Button type="button" variant="link" className="text-xs ml-auto pr-2">
                      약관보기
                    </Button>
                  </PaymentRefundTermsAgreedDialog>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="totalPrice"
          render={({ field }) => (
            <FormItem className="w-full hidden">
              <FormLabel htmlFor="totalPrice" errorCheck={false}>
                <span className="text-red-700">*</span> 총 주문금액
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  id="totalPrice"
                  {...field}
                  {...form.register('totalPrice')}
                  value={field.value ?? ''}
                  placeholder="주문자 전화번호 입력"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="m-10">
          <Button type="submit" className="text-2xl h-15 w-full" disabled={save}>
            주문하기
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CustomerOrderForm;
