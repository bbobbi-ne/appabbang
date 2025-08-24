import { createFileRoute } from '@tanstack/react-router';
import SubLayout from '@/components/templates/sub-layout';
import AddressPage from '@/components/pages/address-page';
import MypageLayout from '@/components/templates/mypage-layout';

/** 배송지 관리 */
export const Route = createFileRoute('/_sub-page/mypage/address/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="마이페이지">
      <MypageLayout>
        <AddressPage />
      </MypageLayout>
    </SubLayout>
  );
}
