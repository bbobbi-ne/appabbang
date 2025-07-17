/**
 * [ 주문서 ]
 * 로그인 세션을 서버로부터 호출하여 세션 존재유무에 따라 보여지는 화면.
 */

import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Form,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Checkbox,
} from '@appabbang/ui';
import BreadCard from '@/components/bread-card';
import { insertOrders, searchBreadList, searchDeliveryList } from '@/services/apis';
import type { BreadProps, DeliveryProps } from '@/interface/bread-interface';
import OrderFormSkeleton from '@/components/order-form-skeleton';
import BreadSearch from '@/components/bread-search';
import CardComment from '@/components/card-comment';
import Payment from '@/components/Payment';
import GuestPrivacyAgreement from '@/components/guest-privacy-agreement';
import DaumPostApi from '@/components/daum-post-api';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '@/validate/form-schema';
import type { FormSchema } from '@/validate/form-schema';
import { toast } from 'sonner';

/**********************************************************************************/
/** Route */
export const Route = createFileRoute('/order/form')({
  component: RouteComponent,
});

/** Main Function */
function RouteComponent() {
  const [breadList, setBreadList] = useState<BreadProps[]>([]); // 빵 목록
  const [originBreadList, setOriginBreadList] = useState<BreadProps[]>([]); // 빵 목록(origin)
  const [paymentList, setPaymentList] = useState<BreadProps[]>([]); // 결제목록
  const [errMsg, setErrMsg] = useState<string>(''); // 에러메세지
  const [keyword, setKeyword] = useState<string>(''); // 빵 키워드
  const [totalCount, setTotalCount] = useState<number>(0); // 최종 수량
  const [totalPrice, setTotalPrice] = useState<number>(0); // 최종 금액

  /**********************************************************************************/
  /**
   * Function
   */
  /** enter key 누를때 빵 검색 기능 수행 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && breadSearch();
  };

  /** 키워드 저장 */
  const keywordSetting = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  /** 키워드 검색 onChange 함수 */
  const breadSearch = () => {
    const regExp = /^[가-힣+$]/g; // 한글 + 1글자 이상 입력된 경우
    const tmpList = Array<BreadProps>();
    let tmpCount = 0;

    // 빈 값으로 검색할 경우 모든 리스트 보여주기
    if (keyword.length === 0) {
      setBreadList(originBreadList);
      return false;
    }

    if (regExp.test(keyword)) {
      // 정규표현식에 올바르다면, 텍스트에 포함되는 빵 목록을 보여준다.
      breadList?.map((data, _) => {
        const breadNm = data.name;

        if (breadNm.includes(keyword)) {
          tmpList.length === 0 && tmpList.push(data); // 데이터 0건이면 하나는 삽입

          tmpList?.map((tmpBread, _) => {
            tmpBread.no === tmpBread.no ? tmpCount++ : null;
          });

          tmpCount === 0 ? tmpList.push(data) : null;
        }
      });

      // 임시 빵 목록 삽입
      setBreadList(tmpList);
    } else return false;
  };

  /** 빵 카드 click시 하단 결제목록 컴포넌트에 추가될 빵 list를 삽입함. */
  const handleBreadClick = (bread: BreadProps) => {
    if (paymentList.length === 0) {
      // 1건도 결제목록이 존재하지 않으면 삽입하고 종료
      setPaymentList((prev) => [...prev, { ...bread, count: 1 }]);
      return false;
    }

    let tmpCount = 0;

    // list에 동일한 빵이 있다면 추가하지 않는다.
    paymentList.map((payment, _) => {
      payment.no === bread.no ? tmpCount++ : null;
    });
    tmpCount === 0 ? setPaymentList((prev) => [...prev, { ...bread, count: 1 }]) : null;
  };

  /** 결제목록 수량, 금액 */
  const onCountChange = useCallback((bread: BreadProps, _: string) => {
    setPaymentList((prev) =>
      prev.map((item) => (item.no === bread.no ? { ...item, count: bread.count } : item)),
    );
  }, []);

  /** 결제목록에서 삭제 */
  const onRemove = useCallback((bread: BreadProps) => {
    setPaymentList((prev) => prev.filter((item) => item.no !== bread.no));
  }, []);

  const handlers = useMemo(
    () => ({
      onCountChange,
      onRemove,
    }),
    [onCountChange, onRemove],
  );

  /** 비회원 개인정보처리방침 동의 flag 처리 */
  const onAgreed = (flag: boolean) => {
    // setAgreed(flag);
    form.setValue('agreed', flag); // onSubmit에서 사용하기 위해 정의함.
  };

  /** 주소 API로 받아온 결과값을 상태값과 form value값에 대입한다. */
  const setFormAddress = (newAddrList: string[]) => {
    const [zipcode, address, addressDetail] = newAddrList;
    zipcode && form.setValue('zipcode', zipcode); // 우편번호
    address && form.setValue('address', address); // 주소
    addressDetail && form.setValue('addressDetail', addressDetail); // 상세주소
  };
  /**********************************************************************************/
  /**
   * 유효성 검사 로직
   */

  /** Form 기본값 설정 */
  const defaultValues = {
    name: '',
    mobileNumber: '',
    recipientName: '',
    recipientMobile: '',
    zipcode: '',
    deliveryMethodNo: '',
    address: '',
    addressDetail: '',
    message: '',
    orderPw: '',
    orderItems: [], // 주문목록
    paid: false, // 입금확인여부
    totalPrice: 0, // 최종금액
    discountAmount: 0, // 할인금액
    agreed: false, // 동의여부(화면단에서만 이용)
  };

  /** form과 schema 연결 */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

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
      toast.error(e.message);
    }
  };

  /**********************************************************************************/
  /**
   * React Hooks
   */
  /** 빵 목록 조회 API */
  const { isLoading, data, error } = useQuery({
    queryKey: ['allBreadList'],
    queryFn: searchBreadList,
  });

  /** 배송방법 목록 조회 */
  const { isLoading: deliveryLoading, data: deliveryData } = useQuery({
    queryKey: ['deliveryList'],
    queryFn: searchDeliveryList,
  });

  /** 빵 목록 조회 및 설정 */
  useEffect(() => {
    data && setBreadList(data.data) && setOriginBreadList(data.data);
    error && setErrMsg('빵 목록을 조회하는 데 문제가 발생했습니다.');
  }, [data, error]);

  /** 빵 결제목록의 총 개수, 총 금액 계산 */
  useEffect(() => {
    const count = paymentList.reduce((sum, bread) => sum + (bread.count ?? 0), 0);
    const price = paymentList.reduce(
      (sum, bread) => sum + (bread.unitPrice ?? 0) * (bread.count ?? 0),
      0,
    );

    setTotalCount(count);
    setTotalPrice(price);

    form.setValue(
      'orderItems',
      paymentList.map((bread) => ({
        breadNo: bread.no,
        quantity: bread.count,
      })),
    );
  }, [paymentList]);

  /** 동의여부가 바뀌면 form에도 적용. */
  // useEffect(() => {
  //   form.setValue('agreed', agreed); // onSubmit에서 사용하기 위해 정의함.
  // }, [agreed]);

  return isLoading ? (
    <OrderFormSkeleton />
  ) : (
    <div>
      <div className="flex flex-col items-center justify-center m-14">
        <span className="text-4xl">주문서</span>
      </div>

      <div className="relative flex w-6xl h-auto m-auto">
        <Card className="w-full bg-[#fcfcfc]">
          <div className="m-5">
            <CardContent>
              <CardComment
                title="1. 구매할 빵을 검색하고 선택하세요."
                comment="최소 1건 이상 선택해야 주문서 작성이 진행됩니다."
              />

              {/* 검색창 */}
              <BreadSearch
                keyword={keyword}
                onKeyDown={handleKeyDown}
                onChange={keywordSetting}
                onClick={breadSearch}
              />

              {/* 빵 목록 */}
              <div className="flex flex-row flex-wrap gap-5 justify-start">
                {isLoading ? (
                  <Card>
                    <CardHeader className="text-red-600">{errMsg}</CardHeader>
                  </Card>
                ) : (
                  breadList?.map((data, i) => (
                    <BreadCard key={i} bread={data} onClick={handleBreadClick} />
                  ))
                )}
              </div>
            </CardContent>

            {paymentList.length === 0
              ? null
              : paymentList.map((data, i) => <Payment key={i} bread={data} handlers={handlers} />)}
          </div>

          <div className="mt-5 mb-5 mr-10 text-right font-bold">
            <CardTitle>
              총 금액 : {totalPrice.toLocaleString()}원 ({totalCount}개)
            </CardTitle>
          </div>

          <div className="mt-20 m-5">
            <CardContent>
              <CardComment
                title="2. 비회원 정보를 입력 해주세요."
                comment="필수항목을 입력해야 주문이 진행됩니다."
              />
            </CardContent>

            {/* 비회원 정보 입력 form */}
            <div className="flex justify-center w-full">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
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
                      <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipientMobile"
                    render={({ field }) => (
                      <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
                        <FormLabel htmlFor="address" errorCheck={false}>
                          <span className="text-red-700">*</span> 배송지 주소
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-start relative">
                            <Input
                              type="text"
                              id="address"
                              className="w-full"
                              disabled
                              placeholder="배송지 주소 입력"
                              {...field}
                              {...form.register('address')}
                            />
                            <DaumPostApi setAddress={setFormAddress} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressDetail"
                    render={({ field }) => (
                      <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
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
                      </FormItem>
                    )}
                  />

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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryMethodNo"
                    render={({ field }) => (
                      <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
                        <FormLabel htmlFor="deliveryMethodNo" errorCheck={false}>
                          <span className="text-red-700">*</span> 배송방법
                        </FormLabel>
                        <FormControl>
                          {deliveryLoading ? (
                            <Select>
                              <SelectTrigger id="deliveryMethodNo" className="w-full">
                                <SelectValue placeholder="선택할 목록이 존재하지 않습니다..." />
                              </SelectTrigger>
                            </Select>
                          ) : (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger id="deliveryMethodNo" className="w-full">
                                <SelectValue placeholder="선택하세요." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>배송방법</SelectLabel>
                                  {deliveryData?.data.map(
                                    (delivery: DeliveryProps, idx: number) => {
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
                                    },
                                  )}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="mt-5 mb-5 pl-10 pr-10 w-full">
                        <FormLabel htmlFor="message" errorCheck={false}>
                          배송 메세지
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            id="message"
                            className="w-full"
                            placeholder="배송 메세지 입력"
                            {...field}
                            {...form.register('message')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="paid" hidden errorCheck={false}>
                          <span className="text-red-700">*</span> 입금 확인여부
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            id="paid"
                            className="w-full"
                            hidden
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...form.register('paid')}
                          />
                        </FormControl>
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
          </div>
        </Card>
      </div>
    </div>
  );
}
