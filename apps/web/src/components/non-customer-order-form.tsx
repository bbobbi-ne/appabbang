/**
 * 비회원 주문서 폼
 */

import useToast from '@/hooks/useToast';
import type { BankCodeProps, BreadProps, DeliveryProps } from '@/interface/bread-interface';
import { insertOrders, searchBankList, searchDeliveryList } from '@/services/apis';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@appabbang/ui';
import { useQuery } from '@tanstack/react-query';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import DaumPostApi from './daum-post-api';
import GuestPrivacyAgreement from './guest-privacy-agreement';

interface NonCustomerOrderFormProp {
  form: UseFormReturn<FormSchema>;
  paymentList: BreadProps[];
  totalPrice: number;
}

function NonCustomerOrderForm({ form, paymentList, totalPrice }: NonCustomerOrderFormProp) {
  const { addToast } = useToast();

  /** 배송방법 목록 API */
  const { isLoading: deliveryLoading, data: deliveryData } = useQuery({
    queryKey: ['deliveryList'],
    queryFn: searchDeliveryList,
  });

  /** 은행 목록 API */
  const { isLoading: bankLoading, data: bankData } = useQuery({
    queryKey: ['bankList'],
    queryFn: searchBankList,
  });

  /** 유효성 검증 수행하기 전, 빵 결제목록 확인 */
  const handleOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paymentList.length === 0) {
      addToast({
        message: '빵 결제목록이 1개 이상 선택돼야 주문이 가능합니다.',
        type: 'error',
      });

      return;
    }

    form.handleSubmit(onSubmit)(e);
  };

  /**
   * 유효성 검증 끝난 후 비회원 주문 건 저장
   * 조건 1. 주문 건이 1건 이상 존재해야 함.
   * 조건 2. 개인정보 수집 이용 동의가 되어야 함.
   */
  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    const orderItems = Array();

    try {
      if (!data.agreed) throw new Error('비회원인 경우, 개인정보 수집 및 이용 동의가 필요합니다.');
      if (paymentList.length === 0)
        throw new Error('결제목록이 1건 이상 존재해야 주문이 가능합니다.');

      /** orderItems 생성 */
      paymentList.map((bread, _) => {
        orderItems.push({
          breadNo: bread.no,
          quantity: bread.count,
        });
      });

      data.orderItems = orderItems;
      data.totalPrice = totalPrice;

      insertOrders(data); // 비회원 주문서 저장
    } catch (e: any) {
      addToast({
        message: e.message,
        type: 'error',
      });
    }
  };

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
                      onChange={(e) => {
                        form.setValue('recipientName', e.target.value);
                        field.onChange(e);
                      }}
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
                      onChange={(e) => {
                        form.setValue('recipientMobile', e.target.value);
                        field.onChange(e);
                      }}
                      placeholder="주문자 전화번호 입력"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                            {bankData?.data.map((bank: BankCodeProps, idx: number) => {
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
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="deliveryMethodNo" className="w-[150px]">
                          <SelectValue placeholder="배송방법 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>배송방법</SelectLabel>
                            {deliveryData?.data.map((delivery: DeliveryProps, idx: number) => {
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
                    placeholder="송장번호 입력"
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
