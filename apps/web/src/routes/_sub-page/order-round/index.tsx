import { createFileRoute, redirect } from '@tanstack/react-router';

/** 없는 페이지 /order-round 접근시 메인페이지로 리다이렉트 */
export const Route = createFileRoute('/_sub-page/order-round/')({
  beforeLoad: async () => {
    throw redirect({ to: '/' });
  },
});
