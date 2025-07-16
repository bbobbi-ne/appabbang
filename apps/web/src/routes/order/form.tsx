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
} from '@appabbang/ui';
import BreadCard from '@/components/BreadCard';
import { searchBreadList, searchDeliveryList } from '@/services/apis';
import type { BreadProps, DeliveryProps } from '@/interface/BreadInterface';
import OrderFormSkeleton from '@/components/OrderFormSkeleton';
import BreadSearch from '@/components/BreadSearch';
import CardComment from '@/components/CardComment';
import Payment from '@/components/Payment';
import GuestPrivacyAgreement from '@/components/GuestPrivacyAgreement';
import DaumPostApi from '@/components/DaumPostApi';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '@/validate/formSchema';
import type { FormSchema } from '@/validate/formSchema';

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
  const [agreed, setAgreed] = useState<boolean>(false); // 비회원 동의
  const [deliveryList, setDeliveryList] = useState<DeliveryProps[]>([]);
  const [address, setAddress] = useState<string>(''); // 주소
  const [addressDetail, setAddressDetail] = useState<string>(''); // 상세주소
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
    setAgreed(flag);
  };

  /** 주소 API로 받아온 결과값을 상태값과 form value값에 대입한다. */
  const setFormAddress = (newAddrList: string[]) => {
    const [zipcode, address, addressDetail] = newAddrList;

    // 우편번호
    if (zipcode) {
      form.setValue('zipcode', zipcode);
    }
    // 주소
    if (address) {
      setAddress(address);
      form.setValue('address', address);
    }
    // 상세주소
    if (addressDetail) {
      setAddressDetail(addressDetail);
      form.setValue('addressDetail', addressDetail);
    }
  };
  /**********************************************************************************/
  /**
   * 유효성 검사 로직
   */

  /** form과 schema 연결 */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      mobileNumber: '',
      recipientName: '',
      recipientMobile: '',
      zipcode: '',
      deliveryMethodNo: '',
      address: '',
      addressDetail: '',
      invoiceNum: '',
    },
  });

  /**
   * 유효성 검증 끝난 후 비회원 주문 건 저장
   * 조건 1. 주문 건이 1건 이상 존재해야 함.
   * 조건 2. 개인정보 수집 이용 동의가 되어야 함.
   */
  const onSubmit: SubmitHandler<FormSchema> = (data) => {
    try {
      debugger;
      console.log(data);
    } catch (e: any) {
      console.log(`error!!`);
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
  const {
    isLoading: deliveryLoading,
    data: deliveryData,
    error: deliveryErr,
  } = useQuery({
    queryKey: ['deliveryList'],
    queryFn: searchDeliveryList,
  });

  /** 빵 목록 조회 및 설정 */
  useEffect(() => {
    data && setBreadList(data.data) && setOriginBreadList(data.data);
    error && setErrMsg('빵 목록을 조회하는 데 문제가 발생했습니다.');
  }, [data, error]);

  /** 배송방법 목록 조회 및 설정 */
  useEffect(() => {
    deliveryData && setDeliveryList(deliveryData.data);
  }, [deliveryData, deliveryErr]);

  /** 빵 결제목록의 총 개수, 총 금액 계산 */
  useEffect(() => {
    const count = paymentList.reduce((sum, bread) => sum + (bread.count ?? 0), 0);
    const price = paymentList.reduce(
      (sum, bread) => sum + (bread.unitPrice ?? 0) * (bread.count ?? 0),
      0,
    );

    setTotalCount(count);
    setTotalPrice(price);
  }, [paymentList]);

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
                    <BreadCard key={i} idx={i} bread={data} onClick={handleBreadClick} />
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

          <div className="m-5">
            <CardContent>
              <CardComment
                title="2. 비회원 정보를 입력 해주세요."
                comment="필수항목을 입력해야 주문이 진행됩니다."
              />
            </CardContent>

            {/* 비회원 정보 입력 form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="ml-10 mr-10">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel errorCheck={false}>
                        <span className="text-red-700">*</span> 주문자
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="주문자 이름 입력"
                          {...field}
                          {...form.register('name')}
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
                    <FormItem>
                      <FormLabel errorCheck={false}>
                        <span className="text-red-700">*</span> 주문자 전화번호
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          {...form.register('mobileNumber')}
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
                    <FormItem>
                      <FormLabel errorCheck={false}>
                        <span className="text-red-700">*</span> 수령인
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                    <FormItem>
                      <FormLabel errorCheck={false}>
                        <span className="text-red-700">*</span> 수령인 전화번호
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                    <FormItem>
                      <FormLabel errorCheck={false}>
                        <span className="text-red-700">*</span> 배송지 주소
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-start relative">
                          <Input
                            type="text"
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
                    <FormItem>
                      <FormLabel errorCheck={false}>
                        <span className="text-red-700">*</span> 배송지 상세주소
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                    <FormItem>
                      <FormLabel hidden errorCheck={false}>
                        <span className="text-red-700">*</span> 우편번호
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
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
                    <FormItem>
                      <FormLabel errorCheck={false}>
                        <span className="text-red-700">*</span> 배송방법
                      </FormLabel>
                      <FormControl>
                        {deliveryLoading ? (
                          <Select>
                            <SelectTrigger className="w-[250px]">
                              <SelectValue placeholder="선택할 목록이 존재하지 않습니다..." />
                            </SelectTrigger>
                          </Select>
                        ) : (
                          <Select>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="선택하세요." />
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceNum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel errorCheck={false}>
                        <span className="text-red-700">*</span> 송장번호
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="w-full"
                          placeholder="송장번호 입력"
                          {...field}
                          {...form.register('invoiceNum')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <GuestPrivacyAgreement onAgreed={onAgreed} />

                <div className="m-10">
                  <Button type="submit" className="text-2xl h-15 w-full">
                    주문하기
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}
