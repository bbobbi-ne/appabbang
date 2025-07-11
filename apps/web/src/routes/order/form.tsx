/**
 * [ 주문서 ]
 * 로그인 세션을 서버로부터 호출하여 세션 존재유무에 따라 보여지는 화면.
 */

import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardHeader, CardTitle, CardContent, Input, Label } from '@appabbang/ui';
import RequiredBar from '@/components/RequiredBar';
import BreadCard from '@/components/BreadCard';
import { searchBreadList } from '@/services/apis';
import type { BreadProps } from '@/interface/BreadInterface';
import OrderFormSkeleton from '@/components/OrderFormSkeleton';
import BreadSearch from '@/components/BreadSearch';
import CardMent from '@/components/CardComment';
import Payment from '@/components/Payment';
import GuestPrivacyAgreement from '@/components/GuestPrivacyAgreement';
import { useForm } from 'react-hook-form';

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
  const { register, watch, handleSubmit, formState } = useForm(); // 비회원정보 Form
  const pattern = /^[가-힣+$]/;

  /**********************************************************************************/
  /** Function */
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
  /**********************************************************************************/
  /** React Hooks */
  /** 빵 목록 조회 API */
  const { isLoading, data, error } = useQuery({
    queryKey: ['allBreadList'],
    queryFn: searchBreadList,
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
              <CardMent
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

          <div className="m-auto h-20" />

          {/* 비회원 정보 입력 form */}
          <div className="m-5">
            <CardContent>
              <CardMent
                title="2. 비회원 정보를 입력 해주세요."
                comment="필수항목을 입력해야 주문이 진행됩니다."
              />
            </CardContent>
            <form>
              <Label>
                <span className="text-red-700">*</span> 주문자
              </Label>
              <Input
                type="text"
                {...register('customer', {
                  required: '비회원 주문자 성함을 입력바랍니다.',
                  pattern: {
                    value: pattern,
                    message: '비회원 주문자 성함은 최소 한글 1자 이상이어야 합니다.',
                  },
                })}
                placeholder="주문자 이름 입력"
              />

              <Label>
                <span className="text-red-700">*</span> 수령인
              </Label>
              <Input
                type="text"
                {...register('recipient', {
                  required: '수령인 성함을 입력바랍니다.',
                  pattern: {
                    value: pattern,
                    message: '수령인 성함은 최소 한글 1자 이상이어야 합니다.',
                  },
                })}
              />
            </form>
          </div>

          <GuestPrivacyAgreement onAgreed={onAgreed} />

          <Button className="relative top-10 ">주문하기</Button>
        </Card>
      </div>

      {/* <Button className="absolute -top-10 right-0 ml-auto">주문</Button> */}
    </div>
  );
}
