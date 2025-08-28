/**
 * 로그아웃 화면
 * 따로 화면을 구현하지는 않고, 기능만 구현하도록 처리함.
 */

import { useEffect } from 'react';
import Loading from '../common/loading';
import { useLogoutMutation } from '@/hooks/use-auth';
import useToast from '@/hooks/useToast';

export default function LogoutPage() {
  const logOutMutaion = useLogoutMutation();
  const { addToast } = useToast();

  useEffect(() => {
    async () => {
      try {
        await logOutMutaion.mutateAsync();
        addToast({
          type: 'success',
          message: '정상적으로 로그아웃되었습니다. 다음에 다시 만나요!',
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return <Loading title="로그아웃" />;
}
