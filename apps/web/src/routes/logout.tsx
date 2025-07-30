import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/logout')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>작업 전입니다... "/logout/"!</div>;
}
