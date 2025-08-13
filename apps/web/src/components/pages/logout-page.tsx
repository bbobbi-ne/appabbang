/**
 * 로그아웃 화면
 * 따로 화면을 구현하지는 않고, 기능만 구현하도록 처리함.
 */

import { logout } from '@/services/customer-apis';
import { useAccessTokenStore } from '@/store/session';
import { useEffect } from 'react';

export default function LogoutPage() {
  const { accessToken, reset } = useAccessTokenStore();

  /**
   * 로그아웃, sessionStorage 리셋
   */
  useEffect(() => {
    logout(accessToken, reset);
  }, []);

  return <></>;
}
