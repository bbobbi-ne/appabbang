import useToast from '@/hooks/useToast';
import { getOrderRoundNow } from '@/services/apis';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { User, ScrollText, LogIn, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface IOrderRoundProps {
  no: number;
  name: string;
  startedAt: string;
  endedAt: string;
  minOrderQty: number;
  maxOrderQty: number;
  orderRoundBreads: {
    orderRoundNo: number;
    breadNo: number;
  }[];
}

export default function Header() {
  const [data, setData] = useState<IOrderRoundProps>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const flag = true; // 로그인 세션 정보

  // 현재 진행중인 주문차수 조회
  const {
    isLoading,
    data: getData,
    error,
  } = useQuery({
    queryKey: ['getOrderRoundNow'],
    queryFn: getOrderRoundNow,
  });

  useEffect(() => {
    getData && setData(getData.data);
  }, [getData]);

  const onOrderMove = (no: number) => {
    navigate({
      to: '/order/$orderRoundNo',
      params: { orderRoundNo: String(no) },
    });
  };

  const onAlert = () =>
    addToast({
      message: '현재 진행중인 주문차수 조회 과정에서 문제가 발생했습니다.',
      type: 'error',
    });

  if (error || !data) return <div>주문 정보를 불러오지 못했습니다.</div>;

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-background border-b">
      {/* 헤더 전체 가운데 정렬 */}
      <div className="container mx-auto px-2">
        {/* 1 ROW : 아이콘 메뉴 (주문서, 마이페이지, 로그인, 로그아웃) */}
        <nav className="flex items-center justify-end py-2 bg-background">
          {!isLoading ? (
            <ScrollText
              strokeWidth={1}
              size={16}
              className="text-primary hover:text-foreground cursor-pointer"
              onClick={() => onOrderMove(data.no)}
            />
          ) : null}
          <Link to="/mypage/info" className="px-2 text-xs">
            <User strokeWidth={1} size={16} className="text-primary hover:text-foreground" />
          </Link>

          {flag ? (
            <Link to="/login" className="px-2 text-xs">
              <LogIn strokeWidth={1} size={16} className="text-primary hover:text-foreground" />
            </Link>
          ) : (
            <Link to="/logout" className="px-2 text-xs">
              <LogOut strokeWidth={1} size={16} className="text-primary hover:text-foreground" />
            </Link>
          )}
        </nav>

        {/* 2 ROW : 로고와 메뉴 */}
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <img
            src="/images/appabbang_logo_p.png"
            alt="아빠빵 로고"
            width="70"
            height="70"
            className="cursor-pointer p-1"
            onClick={() => navigate({ to: '/' })}
          />

          {/* 메뉴 */}
          <nav>
            <Link
              to="/brand"
              className="px-2 text-sm text-primary hover:text-foreground whitespace-nowrap"
            >
              브랜드 소개
            </Link>
            <Link
              to="/products"
              className="px-2 text-sm text-primary hover:text-foreground whitespace-nowrap"
            >
              제품 소개
            </Link>
            <Link
              to="/faq"
              className="px-2 text-sm text-primary hover:text-foreground whitespace-nowrap"
            >
              자주묻는질문
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
