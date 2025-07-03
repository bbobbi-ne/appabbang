/**
 * [ 주문서 ]
 *
 * 로그인 세션을 서버로부터 호출하여 세션 존재유무에 따라 보여지는 화면.
 * CSS는 twakcn으로 처리한다.
 */

import { createFileRoute } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
} from '@appabbang/ui';
import RequiredBar from '../../components/RequiredBar';
import BreadCard from '../../components/BreadCard';
import { client } from '../../services/apis';
import type { BreadProps } from '../../interface/BreadInterface';

/**********************************************************************************/
/** Route */
export const Route = createFileRoute('/order/form')({
  component: RouteComponent,
});

/** Main Function */
function RouteComponent() {
  const [breadList, setBreadList] = useState<BreadProps[]>([]); // 빵 목록
  const [originBreadList, setOriginBreadList] = useState<BreadProps[]>([]); // 빵 목록(origin)
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [paymentList, setPaymentList] = useState<BreadProps[]>([]); // 결제목록
  const [errMsg, setErrMsg] = useState<string>(''); // 에러메세지
  const [keyword, setKeyword] = useState<string>(''); // 빵 키워드

  /**********************************************************************************/
  /** Function */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.key === 'Enter' && checkSearch();
  };

  /** 키워드 검색 onChange 함수 */
  const checkSearch = () => {
    const regExp = /^[가-힣+$]/g; // 한글 + 1글자 이상 입력된 경우
    const tmpList = Array<BreadProps>();

    // 빈 값으로 검색할 경우 모든 리스트 보여주기
    if (keyword.length === 0) {
      console.log(keyword);
      console.log(originBreadList);
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
            tmpBread.no === tmpBread.no ? null : tmpList.push(data);
          });
        }
      });

      // 임시 빵 목록 삽입
      setBreadList(tmpList);
    } else return false;
  };

  /** 빵 카드 click시 하단 결제목록 컴포넌트에 추가될 빵 list를 삽입함. */
  const handleBreadClick = (bread: BreadProps) => {
    setPaymentList((prev) => [...prev, bread]);
  };
  /**********************************************************************************/
  /** React Hooks */
  /** 빵 목록 조회 */
  useEffect(() => {
    client
      .get('/breads', {
        params: {
          breadStatus: 10,
        },
      })
      .then((response) => {
        setBreadList(response.data);
        setOriginBreadList(response.data);
        setLoading(false);
      })
      .catch(() => {
        setErrMsg('빵 목록을 조회하는 데 문제가 발생했습니다.');
        setLoading(true);
      });
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center m-14">
        <span className="text-4xl">주문서</span>
      </div>

      <div className="relative flex w-6xl h-auto m-auto">
        <Button className="absolute -top-10 right-0 ml-auto">주문</Button>
        {/* 회원 / 비회원에 따른 보여지는 카드가 달라짐 */}
        {/* 비회원 */}
        {/* <div>
          <p>비회원일 경우, 개인정보처리방침 동의가 필요합니다.</p> <Button>확인 전</Button>
          </div>
          <Card>ㄴㅇ런이</Card> 
        */}

        <Card className="w-full bg-[#fcfcfc]">
          <div className="p-5">
            <CardTitle className="pt-5">
              <span className="pr-2">김가나</span>
              <span className="text-lg">test01</span>
            </CardTitle>
            <CardDescription className="mt-2">010-1234-5656</CardDescription>
            <CardDescription className="mt-2">
              경기도 성남시 수정구 신흥1동 6729번지 1층
            </CardDescription>
          </div>

          <div className="m-5">
            <RequiredBar />
            <CardContent>
              <CardTitle className="mt-10 mb-2">구매할 빵을 검색하고 선택하세요.</CardTitle>
              <CardDescription>최소 1건 이상 선택해야 주문서 작성이 진행됩니다.</CardDescription>

              {/* 검색창 */}
              <div className="w-72 flex flex-row gap-2">
                <Input
                  type="text"
                  placeholder="빵이름을 입력하세요."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mt-5 mb-5"
                />
                <Button
                  type="submit"
                  className="mt-5 mb-5 hover:cursor-pointer"
                  onClick={checkSearch}
                >
                  검색
                </Button>
              </div>

              <div className="flex flex-row flex-wrap gap-5 justify-start">
                {loading ? (
                  <Card>
                    <CardHeader>
                      빵 목록을 조회하는 데 실패했습니다. 잠시 후에 시도하세요.
                    </CardHeader>
                    <CardContent>{errMsg}</CardContent>
                  </Card>
                ) : (
                  // 빵 목록
                  breadList?.map((data, i) => (
                    <BreadCard key={i} idx={i} bread={data} onClick={handleBreadClick} />
                  ))
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
