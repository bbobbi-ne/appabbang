/**
 * 카카오 로그인 API :: Redirect_URI 영역
 *
 * 로그인을 수행하기 위해 인가 코드를 넘겨받는 화면.
 * 인가 코드가 있어야 토큰 발급을 받을 수 있고 토큰이 있어야 사용자의 정보를 확인할 수 있다.
 */

import Loading from '@/components/loading';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';

export const Route = createFileRoute('/callback/kakao')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  /**
   * @description 로그인하기
   */
  const fetchLogin = useCallback(
    async (code: string) => {
      try {
        const response = await (
          await fetch('http://localhost:4000/auth/kakao/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }), // string으로 전달해야함
          })
        ).json();

        console.log(response);
        navigate({ to: '/order/form' }); // 주문서 폼으로 이동
      } catch (error) {
        alert('Function fetchLogin error!');
        console.error(error);
      }
    },
    [navigate],
  );

  /**
   * @description
   * 카카오 API로부터 인가코드를 전달받는다.
   * 카카오톡 인가코드가 존재하면 token 발급 받아서 로그인한다.
   */
  useEffect(() => {
    const ADDRESS = new URL(window.location.href); // url 가져오기
    const code = ADDRESS.searchParams.get('code') || ''; // 👈 code value

    code && fetchLogin(code);
  }, [fetchLogin]);

  return <Loading title="카카오톡 로그인중입니다." />;
}
