/**
 * [ 주문서 ]
 * 로그인 세션을 서버로부터 호출하여 세션 존재유무에 따라 보여지는 화면.
 */

import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@appabbang/ui';
import BreadCard from '@/components/bread-card';
import type { BreadProps } from '@/interface/bread-interface';
import OrderFormSkeleton from '@/components/order-form-skeleton';
import BreadSearch from '@/components/bread-search';
import CardComment from '@/components/card-comment';
import Payment from '@/components/Payment';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '@/validate/form-schema';
import NonCustomerOrderForm from '@/components/non-customer-order-form';
import { insertOrders, searchBankList, searchBreadList, searchDeliveryList } from '@/services/apis';
import type { FormSchema } from '@/validate/form-schema';
import useToast from '@/hooks/useToast';

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
  const [fee, setFee] = useState<number>(0); // 배송비
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

  /** 우체국 한정으로 배송비 3,000원 추가 */
  const onSelectedDeliveryTp = (value: string) => {
    value === '10' ? setFee(3000) : setFee(0);
  };
  /**********************************************************************************/
  /**
   * 유효성 검사 로직
   */

  /** Form 기본값 설정 */

  const defaultValues: FormSchema = {
    name: '', // 주문자명
    mobileNumber: '', // 주문자 전화번호
    recipientName: '', // 수령인명
    recipientMobile: '', // 수령인 전화번호
    zipcode: '', // 우편번호
    deliveryMethodNo: '', // 배송방법
    address: '', // 주소
    addressDetail: '', // 상세주소
    message: '', // 배송메세지
    orderPw: '', // 주문 비밀번호
    orderItems: [], // 주문목록
    totalPrice: 0, // 최종금액
    discountAmount: 0, // 할인금액
    agreed: false, // 동의여부(화면단에서만 이용)
    bankCode: '', // 은행코드
    accountNumber: '', // 계좌번호
    accountHolderName: '', // 예금주
    same: false, // 주문자-수령인 동일여부
  };

  /** form과 schema 연결 */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  /**********************************************************************************/
  /** APIs */
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

  /** form onSubmit 핸들러 */
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
  /**********************************************************************************/
  /**
   * React Hooks
   */
  const { addToast } = useToast();

  /** 빵 목록 조회 API */
  const { isLoading, data, error } = useQuery({
    queryKey: ['allBreadList'],
    queryFn: searchBreadList,
  });

  /** 빵 목록 조회 및 설정 */
  useEffect(() => {
    if (data) {
      setBreadList(data.data);
      setOriginBreadList(data.data);
    }

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
    setTotalPrice(price + fee); // 빵 목록 금액의 합 + 배송비

    form.setValue(
      'orderItems',
      paymentList.map((bread) => ({
        breadNo: bread.no,
        quantity: bread.count,
      })),
    );
  }, [paymentList, fee]);

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

          <div className="mt-5 mb-5 mr-10 text-right font-bold text-[18px]">
            <ul className="flex justify-end text-red-700">
              <li className="w-1/3"></li>
              <li className="w-1/3">배송비 :</li>
              <li className="w-xs">{fee.toLocaleString()}원</li>
            </ul>
          </div>

          <div className="mt-5 mb-5 mr-10 text-right font-bold">
            <CardTitle>
              <ul className="flex justify-end">
                <li className="w-1/3"></li>
                <li className="w-1/3">총 금액({totalCount}개) :</li>
                <li className="w-xs">
                  <CardTitle>{totalPrice.toLocaleString()}원</CardTitle>
                </li>
              </ul>
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
            <NonCustomerOrderForm
              form={form}
              onSelectedDeliveryTp={onSelectedDeliveryTp}
              bank={{ bankLoading, bankData: bankData?.data }}
              delivery={{ deliveryLoading, deliveryData: deliveryData?.data }}
              handleOrderSubmit={handleOrderSubmit}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
