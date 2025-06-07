import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboardLayout/dashboard/purchases/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_dashboardLayout/dashboard/purchases/"!</div>;
}
