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

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/mypage/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/mypage/"!</div>;
}
