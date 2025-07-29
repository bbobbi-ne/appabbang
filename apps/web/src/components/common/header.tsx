import { Link, useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { User, ScrollText, LogIn, LogOut } from 'lucide-react';

const linkCss = `px-2 font-bold w-30`; // 오타 수정: 'font-bol' → 'font-bold'
const imgCss = `w-10 h-10 cursor-pointer`;

export default function Header() {
  const navigate = useNavigate();
  const flag = true; // 로그인 세션 정보

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-2 bg-white text-black flex justify-center">
      <nav
        className={clsx(
          'flex items-center w-full px-30',
          ' *:flex *:flex-row *:items-center *:justify-center',
        )}
      >
        {/* 좌측 링크 메뉴 */}
        <div className={linkCss}>
          <Link to="/">브랜드 소개</Link>
        </div>
        <div className={linkCss}>
          <Link to="/">제품 소개</Link>
        </div>
        <div className={linkCss}>
          <Link to="/">자주묻는질문</Link>
        </div>

        {/* 중앙 로고 */}
        <div className="w-6/12 flex justify-center">
          <img
            src="../../../images/appabbang_logo.png"
            alt="아빠빵 로고"
            width="100"
            height="100"
            className="cursor-pointer"
            onClick={() => navigate({ to: '/' })}
          />
        </div>

        {/* 우측 아이콘 메뉴 */}
        <div className="flex items-center gap-5 ml-auto">
          <Link to="/order/form">
            <ScrollText className={imgCss} />
          </Link>
          <Link to="/mypage/edit">
            <User className={imgCss} />
          </Link>

          {flag ? (
            <Link to="/login">
              <LogIn className={imgCss} />
            </Link>
          ) : (
            <Link to="/logout">
              <LogOut className={imgCss} />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
