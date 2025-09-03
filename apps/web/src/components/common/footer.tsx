import { Link } from '@tanstack/react-router';

const VITE_TOS_URL = (import.meta as any).env.VITE_TOS_URL;
const VITE_PP_URL = (import.meta as any).env.VITE_PP_URL;

export default function Footer() {
  return (
    <footer className="w-full bg-primary">
      <div className="container mx-auto px-2 py-2 flex flex-col items-center md:flex-row md:justify-center md:gap-4">
        <div className="flex items-center gap-2">
          <img src="/images/appabbang_logo_w.png" alt="아빠빵 로고" width="20" height="20" />
          <p className="text-center text-xs text-background font-light">
            Copyright 2025. Appabbang Co. All rights reserved
          </p>
        </div>

        <div className="flex items-center gap-2 py-1">
          <Link
            to={VITE_TOS_URL}
            className="text-xs text-background font-light hover:text-background/80"
            target="_blank"
          >
            서비스 이용약관
          </Link>
          <Link
            to={VITE_PP_URL}
            className="text-xs text-background font-light hover:text-background/80"
            target="_blank"
          >
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
