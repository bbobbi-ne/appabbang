import { getMe } from '@/service/auth-api';
import { Button } from '@appabbang/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboardLayout/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  async function test() {
    const res = await getMe();

    console.log(res);
  }

  return (
    <>
      <Button onClick={test}>Get Me</Button>
    </>
  );
}
