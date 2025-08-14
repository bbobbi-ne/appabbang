/**
 * 회원가입 화면
 */

import JoinPage from '@/components/pages/join-page';
import SubLayout from '@/components/templates/sub-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/join')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SubLayout title="회원가입">
      <JoinPage />
    </SubLayout>
  );
}
