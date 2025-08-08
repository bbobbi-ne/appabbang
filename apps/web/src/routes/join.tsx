/**
 * 회원가입 화면
 */

import JoinPage from '@/components/pages/join-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/join')({
  component: JoinPage,
});
