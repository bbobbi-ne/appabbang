/**
 * 유저 - 마이페이지 :: 대시보드
 *
 * 로그인 세션 값에 따라 보여져야 하는 화면.
 * [회원]
 *   - 대시보드의 모든 내용이 보여져야 함.
 *   - 주문상태 건수 확인 : 전체 // 접수완료 - 입금 - 제조중 - 배송중 - 배송완료 / 접수취소
 *   - 장바구니 목록 (table)
 *   - 주문내역 목록 (table)
 *   - 보유 할인 목록 (table)
 * [비회원]
 *   - 아래의 내용이 보이기 전에 주문자명 + 휴대폰 조회 👉🏻 마이페이지 진입되도록. (일부만)
 *   - 주문상태 건수 확인 불가.
 *   - 장바구니 목록 확인 불가.
 *   - 주문내역 목록 확인 가능
 */

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@appabbang/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/mypage/')({
  component: RouteComponent,
});

let paymentList = [
  {
    invoice: '1',
    paymentStatus: '김순자',
    recipient: '김말자',
    paymentMethod: '미입금',
    totalAmount: 103500,
  },
  {
    invoice: '2',
    paymentStatus: '김순자',
    recipient: '김말자',
    paymentMethod: '입금완료',
    totalAmount: 12500,
  },
  {
    invoice: '3',
    paymentStatus: '김순자',
    recipient: '김말자',
    paymentMethod: '입금완료',
    totalAmount: 27800,
  },
  {
    invoice: '4',
    paymentStatus: '김순자',
    recipient: '김말자',
    paymentMethod: '입금완료',
    totalAmount: 36900,
  },
];

let saleList = [
  { no: 1, saleName: '특가! 오늘만 쌉니다!', count: 2, saleAmount: 10000 },
  { no: 2, saleName: '정말 죄송합니다. 가장 저렴한 할인금액이에요.', count: 1, saleAmount: 100000 },
  { no: 3, saleName: '여름특가할인금액', count: 2, saleAmount: 5000 },
  { no: 4, saleName: '빵돌아! 빵순아! 빵 사오렴!', count: 2, saleAmount: 20000 },
];

paymentList = [];
saleList = [];

function RouteComponent() {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    paymentList.map((item) => {
      setTotalPrice((prev) => prev + item.totalAmount);
    });

    saleList.map((sale) => {
      setTotalCount((prev) => prev + sale.count);
    });
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center m-14">
        <span className="text-4xl">대시보드</span>
      </div>

      <div className="flex flex-row">
        <Card className="w-1/3 h-full ml-5">
          <CardContent className="mt-5">
            <CardTitle>내 정보</CardTitle>

            {/* 비회원인 경우, 회원가입을 유도하도록 보여줘야 함. */}
            <div className="flex items-center justify-center text-center h-[400px] m-auto ">
              <CardDescription>
                현재 회원님의 정보를 확인할 수 없습니다. <br />
                새로 회원가입하시겠습니까? <br />
                <Button type="button" className="m-2" onClick={() => navigate({ to: '/join' })}>
                  회원가입
                </Button>
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-row w-full mt-20 mb-5">
        <div className="w-1/2 mr-5">
          <p className="m-2">주문내역</p>
          <Card>
            <Table className="h-auto table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead>주문자</TableHead>
                  <TableHead>수령인</TableHead>
                  <TableHead>입금확인여부</TableHead>
                  <TableHead className="text-right">금액</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentList.length === 0 ? (
                  <TableRow key="1">
                    <TableCell colSpan={5} className="p-4 text-center">
                      할인정보가 존재하지 않습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  paymentList.map((item) => (
                    <TableRow key={item.invoice}>
                      <TableCell className="font-medium">{item.invoice}</TableCell>
                      <TableCell>{item.paymentStatus}</TableCell>
                      <TableCell>{item.recipient}</TableCell>
                      <TableCell>{item.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        {item.totalAmount.toLocaleString()}원
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell className="text-right">{totalPrice.toLocaleString()}원</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
        </div>

        <div className="w-1/2 mr-5">
          <p className="m-2">보유 할인목록</p>
          <Card>
            <Table className="h-auto table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead className="w-80">할인명</TableHead>
                  <TableHead>수량</TableHead>
                  <TableHead className="text-right">할인금액</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 주문내역이 존재하지 않을 경우 */}
                {saleList.length === 0 ? (
                  <TableRow key="1">
                    <TableCell colSpan={4} className="p-4 text-center">
                      할인정보가 존재하지 않습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  saleList.map((sale) => (
                    <TableRow key={sale.no}>
                      <TableCell className="font-medium">{sale.no}</TableCell>
                      <TableCell>{sale.saleName}</TableCell>
                      <TableCell>{sale.count}</TableCell>
                      <TableCell className="text-right">
                        {sale.saleAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell colSpan={1}>{totalCount}개</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
