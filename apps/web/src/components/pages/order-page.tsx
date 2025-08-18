import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, AlertDialog } from '@appabbang/ui';
import BreadCard from '@/components/common/bread-card';
import type { BreadProps } from '@/interface/bread-interface';
import OrderFormSkeleton from '@/components/order/order-form-skeleton';
import CardComment from '@/components/common/card-comment';
import Payment from '@/components/order/Payment';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerOrderFormSchema, formSchema } from '@/validate/order-form-schema';
import NonCustomerOrderForm from '@/components/order/non-customer-order-form';
import { insertOrders, searchBankList, searchDeliveryList } from '@/services/order-apis';
import { getOrderRound } from '@/services/order-round-apis';
import type { CustomerOrderFormSchema, FormSchema } from '@/validate/order-form-schema';
import useToast from '@/hooks/useToast';
import { useParams } from '@tanstack/react-router';
import { useAccessTokenStore } from '@/store/session';
import CustomerOrderForm from '../order/customer-order-form';

/** Main Function */
export default function OrderPage() {
  const [orderRoundBreads, setOrderRoundBreads] = useState<BreadProps[]>([]); // 빵 목록
  const [paymentList, setPaymentList] = useState<BreadProps[]>([]); // 결제목록
  const [errMsg, setErrMsg] = useState<string>(''); // 에러메세지
  const [fee, setFee] = useState<number>(0); // 배송비
  const [totalCount, setTotalCount] = useState<number>(0); // 최종 수량
  const [totalPrice, setTotalPrice] = useState<number>(0); // 최종 금액
  const [min, setMin] = useState<number>(0); // 최소주문수량
  const [max, setMax] = useState<number>(0); // 최대주문수량
  // 메인페이지에서 넘어온 주문차수 파라미터
  const { orderRoundNo } = useParams({ from: '/_sub-page/order/$orderRoundNo' });
  const { accessToken } = useAccessTokenStore();
  const { addToast } = useToast();
  const [save, setSave] = useState<boolean>(false); // 저장여부

  /**********************************************************************************/
  /** Functions */
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

  /** 우체국 한정으로 배송비 4,000원 추가 */
  const onSelectedDeliveryTp = (value: string) => (value === '10' ? setFee(4000) : setFee(0));

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

  /** 주문차수 상세 조회 API */
  const {
    isLoading: orderRoundLoading,
    data: orderRoundData,
    error: orderRoundErr,
  } = useQuery({
    queryKey: ['getOrderRound'],
    queryFn: () => getOrderRound(Number(orderRoundNo)),
  });
  /**********************************************************************************/
  /** form submit */
  /** 비회원 form : form과 schema 연결 */
  const nonCustomerForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ordererName: '', // 주문자명
      ordererMobile: '', // 주문자 전화번호
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
      bankCode: '', // 은행코드
      accountNumber: '', // 계좌번호
      accountHolderName: '', // 예금주
      same: false, // 주문자-수령인 동일여부
      isServiceTermsAgreed: false, // 서비스 이용약관
      isPrivacyTermsAgreed: false, // 개인정보 이용약관
      isPaymentRefundTermsAgreed: false, // 결제 및 환불 약관
      orderRoundNo: Number(orderRoundNo), // 주문차수
    },
  });

  /** 고객 form */
  const customerForm = useForm({
    resolver: zodResolver(customerOrderFormSchema),
    defaultValues: {
      ordererName: '', // 주문자명
      recipientName: '', // 수령인명
      recipientMobile: '', // 수령인 전화번호
      zipcode: '', // 우편번호
      deliveryMethodNo: '', // 배송방법
      address: '', // 주소
      addressDetail: '', // 상세주소
      orderItems: [], // 주문목록
      totalPrice: 0, // 최종금액
      discountAmount: 0, // 할인금액
      bankCode: '', // 은행코드
      accountNumber: '', // 계좌번호
      accountHolderName: '', // 예금주
      same: false, // 주문자-수령인 동일여부
      isServiceTermsAgreed: false, // 서비스 이용약관
      isPrivacyTermsAgreed: false, // 개인정보 이용약관
      isPaymentRefundTermsAgreed: false, // 결제 및 환불 약관
      orderRoundNo: Number(orderRoundNo), // 주문차수
    },
  });

  /**
   * form onSubmit 핸들러
   * 조건 1. 비회원은 accessToken이 존재하지 않으면서, 개인정보 수집 이용 동의가 되어야 함.
   * 조건 2. 주문 건이 1건 이상 존재해야 함. (고객/비회원 둘다)
   */
  const handleOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paymentList.length === 0) {
      addToast({ message: '빵 결제목록이 1개 이상 선택돼야 주문이 가능합니다.', type: 'error' });
      return;
    }

    // customerForm / nonCustomerForm totalPrice 설정
    if (accessToken && accessToken.length > 0) {
      customerForm.setValue('totalPrice', totalPrice);
      customerForm.setValue(
        'orderItems',
        paymentList.map((bread) => ({
          breadNo: bread.no,
          quantity: bread.count,
        })),
      );
      customerForm.setValue('orderRoundNo', 1);

      customerForm.handleSubmit(customerOnSubmit, (error) => console.log(error))();
    } else {
      nonCustomerForm.setValue('totalPrice', totalPrice);

      nonCustomerForm.setValue(
        'orderItems',
        paymentList.map((bread) => ({
          breadNo: bread.no,
          quantity: bread.count,
        })),
      );

      nonCustomerForm.handleSubmit(nonCustomerOnSubmit, (error) => console.log(error))();
    }
  };

  /** 고객 주문서 저장 */
  const customerOnSubmit: SubmitHandler<CustomerOrderFormSchema> = async (data) => {
    await insertOrder.mutateAsync(data); // 주문서 등록(고객)
  };

  /** 비회원 주문서 저장 */
  const nonCustomerOnSubmit: SubmitHandler<FormSchema> = async (data) => {
    await insert.mutateAsync(data); // 주문서 등록(비회원)
  };

  /** mutation : 주문서 등록(고객) */
  const insertOrder = useMutation({
    mutationFn: (data: CustomerOrderFormSchema) => insertOrders(data),
    onSuccess: () => {
      addToast({ message: '주문이 등록되었습니다.', type: 'success' });
      setSave(true);
    },
    onError: (error) => addToast({ message: error.message, type: 'error' }),
  });

  /** mutation : 주문서 등록(비회원) */
  const insert = useMutation({
    mutationFn: (data: FormSchema) => insertOrders(data),
    onSuccess: () => {
      addToast({ message: '주문이 등록되었습니다.', type: 'success' });
      setSave(true);
    },
    onError: (error) => addToast({ message: error.message, type: 'error' }),
  });
  /**********************************************************************************/

  /** 주문차수 빵 목록 조회 및 설정 */
  useEffect(() => {
    if (orderRoundData) {
      setOrderRoundBreads(orderRoundData.data.orderRoundBreads);
      setMin(orderRoundData.data.minOrderQty);
      setMax(orderRoundData.data.maxOrderQty);
    }
    orderRoundErr && setErrMsg('빵 목록을 조회하는 데 문제가 발생했습니다.');
  }, [orderRoundData, orderRoundErr]);

  /** 빵 결제목록의 총 개수, 총 금액 계산 */
  useEffect(() => {
    const count = paymentList.reduce((sum, bread) => sum + (bread.count ?? 0), 0);
    const price = paymentList.reduce(
      (sum, bread) => sum + (bread.unitPrice ?? 0) * (bread.count ?? 0),
      0,
    );

    setTotalCount(count);
    setTotalPrice(price + fee); // 빵 목록 금액의 합 + 배송비
  }, [paymentList, fee]);

  /**********************************************************************************/

  // if (isLoading) return <Loading />;

  return orderRoundLoading ? (
    <OrderFormSkeleton />
  ) : (
    <div>
      <div className="relative flex h-auto m-auto">
        <Card className="w-full bg-[#fcfcfc]">
          <div className="m-5 mt-10">
            <CardContent>
              <CardComment
                title="1. 이번 주문서에 포함된 빵을 확인하세요!"
                comment="현재 주문서에 포함된 빵 목록은 다음과 같습니다. 카드를 클릭하면 빵 결제목록에 담을 수 있습니다."
              />

              {/* 주문차수 빵 목록 */}
              <div className="flex flex-row flex-wrap gap-5 justify-start">
                {orderRoundLoading ? (
                  <Card>
                    <CardHeader className="text-red-600">{errMsg}</CardHeader>
                  </Card>
                ) : (
                  orderRoundBreads?.map((data, i) => (
                    <AlertDialog key={i}>
                      <BreadCard bread={data} onClick={handleBreadClick} />
                    </AlertDialog>
                  ))
                )}
              </div>
            </CardContent>

            {paymentList.length === 0
              ? null
              : paymentList.map((data, i) => (
                  <Payment key={i} bread={data} min={min} max={max} handlers={handlers} />
                ))}
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
              {accessToken && accessToken.length > 0 ? (
                <CardComment
                  title="2. 고객 정보를 입력 해주세요."
                  comment="필수항목을 입력해야 주문이 진행됩니다."
                />
              ) : (
                <CardComment
                  title="2. 비회원 정보를 입력 해주세요."
                  comment="필수항목을 입력해야 주문이 진행됩니다."
                />
              )}
            </CardContent>

            <div className="flex justify-center w-full">
              {accessToken && accessToken.length > 0 ? (
                // 고객 전용 폼
                <CustomerOrderForm
                  form={customerForm}
                  onSelectedDeliveryTp={onSelectedDeliveryTp}
                  bank={{ bankLoading, bankData: bankData?.data }}
                  delivery={{ deliveryLoading, deliveryData: deliveryData?.data }}
                  handleOrderSubmit={handleOrderSubmit}
                  save={save}
                />
              ) : (
                // 비회원 전용 폼
                <NonCustomerOrderForm
                  form={nonCustomerForm}
                  onSelectedDeliveryTp={onSelectedDeliveryTp}
                  bank={{ bankLoading, bankData: bankData?.data }}
                  delivery={{ deliveryLoading, deliveryData: deliveryData?.data }}
                  handleOrderSubmit={handleOrderSubmit}
                  save={save}
                />
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
