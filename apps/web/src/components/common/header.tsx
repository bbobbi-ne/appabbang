import { Link, useNavigate } from '@tanstack/react-router';
import useToast from '@/hooks/useToast';
import { useAccessTokenStore } from '@/store/session';
import { User, LogIn, LogOut, NotepadText } from 'lucide-react';
import { useGetOrderRoundCurrentQuery } from '@/hooks/use-order-round';
import { useCheckHasOrderQuery } from '@/hooks/use-my';

export default function Header() {
  const navigate = useNavigate();
  const { accessToken } = useAccessTokenStore();
  const { addToast } = useToast();

  // 현재 진행중인 주문차수 조회
  const { data, isSuccess } = useGetOrderRoundCurrentQuery();
  // 로그인 여부를 확인할 수 있는 다른 방법이 없을지?
  const { data: hasOrder } = useCheckHasOrderQuery(data?.no, data?.no && !!accessToken);

  const moveToOrderRoundDetail = (no: number) => {
    navigate({
      to: '/order-round/$orderRoundNo',
      params: { orderRoundNo: String(no) },
    });
  };

  const moveToMypage = () => {
    if (!accessToken) {
      addToast({
        type: 'warning',
        message: '로그인한 고객님만 접근 가능합니다.',
      });

      return;
    }

    navigate({ to: '/mypage/info' });
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-background border-b">
      {/* 헤더 전체 가운데 정렬 */}
      <div className="container mx-auto px-2">
        {/* 1 ROW : 아이콘 메뉴 (주문서, 마이페이지, 로그인, 로그아웃) */}
        <nav className="flex items-center justify-end gap-2 lg:gap-4 py-2 bg-background">
          {isSuccess && data && !hasOrder ? (
            <NotepadText
              size={20}
              strokeWidth={1}
              className="cursor-pointer"
              onClick={() => moveToOrderRoundDetail(data.no)}
            />
          ) : null}

          {accessToken ? (
            <>
              <User strokeWidth={1} size={20} className="cursor-pointer" onClick={moveToMypage} />
              <Link to="/logout">
                <LogOut strokeWidth={1} size={20} />
              </Link>
            </>
          ) : (
            <Link to="/login">
              <LogIn strokeWidth={1} size={20} />
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
          <nav className="flex items-center gap-4 lg:gap-8">
            <Link
              to="/brand"
              className="text-sm lg:text-base whitespace-nowrap relative transition-all duration-300 ease-in-out group"
            >
              아빠빵 소개
              <span className="absolute bottom-[-4px] left-0 w-0 h-1 bg-secondary rounded-sm transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
            <Link
              to="/products"
              className="text-sm lg:text-base whitespace-nowrap relative transition-all duration-300 ease-in-out group"
            >
              제품 소개
              <span className="absolute bottom-[-4px] left-0 w-0 h-1 bg-secondary rounded-sm transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
            <Link
              to="/faq"
              className="text-sm lg:text-base whitespace-nowrap relative transition-all duration-300 ease-in-out group"
            >
              자주묻는질문
              <span className="absolute bottom-[-4px] left-0 w-0 h-1 bg-secondary rounded-sm transition-all duration-300 ease-in-out group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
