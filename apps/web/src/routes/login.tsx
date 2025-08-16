/**
 * * 아빠빵 로그인
 * * 카카오 로그인 API
 */

import { createFileRoute } from '@tanstack/react-router';
import LoginPage from '@/components/pages/login-page';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return <LoginPage />;
}
