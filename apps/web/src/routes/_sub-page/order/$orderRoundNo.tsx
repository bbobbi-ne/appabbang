import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_sub-page/order/$orderRoundNo')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>주문서 parameger 전달</div>;
}
