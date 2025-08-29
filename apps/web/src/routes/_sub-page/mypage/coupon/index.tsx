import CouponPage from '@/components/pages/coupon-page';
import MypageLayout from '@/components/templates/mypage-layout';
import SubLayout from '@/components/templates/sub-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/mypage/coupon/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="마이페이지">
      <MypageLayout>
        <CouponPage />
      </MypageLayout>
    </SubLayout>
  );
}
