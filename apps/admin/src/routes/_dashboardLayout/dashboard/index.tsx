import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboardLayout/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <>홈화면</>;
}
