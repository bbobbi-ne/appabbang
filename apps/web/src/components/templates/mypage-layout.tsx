import { Card, CardContent } from '@appabbang/ui';
import { useCustomerStore } from '@/store/customer';
import { ToggleMenuButton } from '@/components/common/toggle-menu-button';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useGetCustomerInfoQuery } from '@/hooks/use-my';

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  const {
    customer: { id, name },
  } = useCustomerStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { data } = useGetCustomerInfoQuery();

  const menuList = [
    { label: '정보수정', value: '/mypage/info' },
    { label: '비밀번호 수정', value: '/mypage/password' },
    { label: '배송지 관리', value: '/mypage/address' },
    { label: '주문내역', value: '/mypage/order-list' },
  ];

  const onChangeActiveMenu = (value: string) => {
    navigate({ to: value });
  };

  return (
    <div className="pb-20">
      <Card className="mb-10">
        <CardContent className="pt-6 flex flex-row justify-between items-center">
          <p>
            <b>
              {name}({id})
            </b>{' '}
            님 안녕하세요.
          </p>
          <div className="flex">
            <p className="flex flex-col items-center gap-2 border-r border-l px-8">
              <b>주문 누적금액</b> <span>{data?.totalAmount || 0}원</span>
            </p>
            <p className="flex flex-col items-center gap-2 px-8">
              <b>총 보유 쿠폰 수</b> <span>{data?.coupon.length || 0}개</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <ToggleMenuButton
        list={menuList}
        activeMenu={pathname}
        onChangeActiveMenu={onChangeActiveMenu}
      />

      {children}
    </div>
  );
}
