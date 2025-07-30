import { Link, useNavigate } from '@tanstack/react-router';
import { User, ScrollText, LogIn, LogOut } from 'lucide-react';

// const linkCss = `px-2 font-bold w-30`; // 오타 수정: 'font-bol' → 'font-bold'
// const imgCss = `w-10 h-10 cursor-pointer`;

export default function Header() {
  const navigate = useNavigate();
  const flag = true; // 로그인 세션 정보

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 bg-background border-b">
      {/* 헤더 전체 가운데 정렬 */}
      <div className="container mx-auto px-2">
        {/* 1 ROW : 아이콘 메뉴 (주문서, 마이페이지, 로그인, 로그아웃) */}
        <nav className="flex items-center justify-end py-2 bg-background">
          <Link to="/order/form" className="px-2 text-xs">
            <ScrollText strokeWidth={1} size={16} className="text-primary hover:text-foreground" />
          </Link>
          <Link to="/mypage/edit" className="px-2 text-xs">
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
              to="/"
              className="px-2 text-sm text-primary hover:text-foreground whitespace-nowrap"
            >
              브랜드 소개
            </Link>
            <Link
              to="/"
              className="px-2 text-sm text-primary hover:text-foreground whitespace-nowrap"
            >
              제품 소개
            </Link>
            <Link
              to="/"
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
