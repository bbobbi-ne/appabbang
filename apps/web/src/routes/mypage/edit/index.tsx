/**
 * 마이페이지 - 정보수정
 */

import CustomerInfoCard from '@/components/mypage/customer-info-card';
import MenuButton from '@/components/mypage/menu-button';
import { Card, CardContent } from '@appabbang/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/mypage/edit/')({
  component: RouteComponent,
});

function RouteComponent() {
  /** 로그인 유저 세션 조회 */

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center m-14">
        <span className="text-4xl">마이페이지</span>
      </div>

      <div className="flex flex-col">
        <Card className="w-2/3 h-full ml-auto mr-auto">
          <CardContent>
            <CustomerInfoCard id={'test1234'} name={'김가나'} />
          </CardContent>
        </Card>

        <MenuButton />
      </div>
    </div>
  );
}
