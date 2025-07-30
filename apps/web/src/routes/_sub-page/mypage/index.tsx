import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/mypage/')({
  beforeLoad: () => {
    throw redirect({ to: '/mypage/info' });
  },
});
