/**
 * 비회원 주문서 폼
 */

import type { BankCodeProps, DeliveryProps } from '@/interface/bread-interface';
import type { FormSchema } from '@/validate/form-schema';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import type { UseFormReturn } from 'react-hook-form';
import DaumPostApi from './daum-post-api';
import GuestPrivacyAgreement from './guest-privacy-agreement';
import { useState } from 'react';

interface NonCustomerOrderFormProp {
  form: UseFormReturn<FormSchema>;
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
}

/** Main Function */
function NonCustomerOrderForm({
  form,
  onSelectedDeliveryTp,
  bank,
  delivery,
  handleOrderSubmit,
}: NonCustomerOrderFormProp) {
  const [deliveryMethodNo, setDeliveryMethodNo] = useState<string>('');
  const [same, setSame] = useState<boolean>(false);
  const { bankLoading, bankData } = bank;
  const { deliveryLoading, deliveryData } = delivery;

  /** 주소 API로 받아온 결과값을 상태값과 form value값에 대입한다. */
  const setFormAddress = (newAddrList: string[]) => {
    const [zipcode, address, addressDetail] = newAddrList;
    zipcode && form.setValue('zipcode', zipcode); // 우편번호
    address && form.setValue('address', address); // 주소
    addressDetail && form.setValue('addressDetail', addressDetail); // 상세주소
  };

  /** 비회원 개인정보처리방침 동의 flag 처리 */
  const onAgreed = (flag: boolean) => form.setValue('agreed', flag); // onSubmit에서 사용하기 위해 정의함.

  return (
    <div className="flex justify-center w-full">
      <Form {...form}>
        <form onSubmit={handleOrderSubmit} className="w-2/3">
          <div className="flex items-start mt-5 mb-5 pl-10 pr-10">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full mr-2">
                  <FormLabel htmlFor="name" errorCheck={false}>
                    <span className="text-red-700">*</span> 주문자
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="name"
                      placeholder="주문자 이름 입력"
                      {...field}
                      {...form.register('name')}
                      // onChange={(e) => {
                      //   form.setValue('recipientName', e.target.value, {
                      //     shouldDirty: true,
                      //     shouldTouch: true,
                      //     shouldValidate: true,
                      //   });
                      //   field.onChange(e);
                      // }}
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
                <FormItem className="w-full">
                  <FormLabel htmlFor="mobileNumber" errorCheck={false}>
                    <span className="text-red-700">*</span> 주문자 전화번호
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      id="mobileNumber"
                      {...field}
                      {...form.register('mobileNumber')}
                      // onChange={(e) => {
                      //   form.setValue('recipientMobile', e.target.value, {
                      //     shouldDirty: true,
                      //     shouldTouch: true,
                      //     shouldValidate: true,
                      //   });
                      //   field.onChange(e);
                      // }}
                      placeholder="주문자 전화번호 입력"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-3 pl-10 pr-10">
            <Checkbox
              id="same"
              onCheckedChange={(flag) => {
                // 주문자와 수령인이 동일하면 true
                if (flag) {
                  setSame(true);
                  form.setValue('recipientName', form.getValues('name')); // 수령인
                  form.setValue('recipientMobile', form.getValues('mobileNumber')); // 수령인 전화번호
                } else {
                  setSame(false);
                  form.setValue('recipientName', ''); // 수령인
                  form.setValue('recipientMobile', ''); // 수령인 전화번호
                }
              }}
            />
            <Label htmlFor="same">주문자와 수령인 정보가 동일합니다.</Label>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DaumPostApi setAddress={setFormAddress} />

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
                      {...field}
                      {...form.register('addressDetail')}
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
                          const deliveryType = found?.deliveryType ?? '';

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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="orderPw"
            render={({ field }) => (
              <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
                <FormLabel htmlFor="orderPw" errorCheck={false}>
                  <span className="text-red-700">*</span> 주문 비밀번호
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="orderPw"
                    className="w-full"
                    placeholder="주문 비밀번호 입력"
                    {...field}
                    {...form.register('orderPw')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreed"
            render={({ field }) => (
              <FormItem>
                <FormLabel hidden htmlFor="agreed" errorCheck={false}>
                  <span className="text-red-700">*</span> 동의여부
                </FormLabel>
                <FormControl>
                  <Checkbox
                    id="agreed"
                    className="w-full"
                    hidden
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    {...form.register('agreed')}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <GuestPrivacyAgreement
            onAgreed={onAgreed}
            agreed={form.watch('agreed')}
            setAgreed={(flag: boolean) => form.setValue('agreed', flag)}
          />

          <div className="m-10">
            <Button type="submit" className="text-2xl h-15 w-full">
              주문하기
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default NonCustomerOrderForm;
