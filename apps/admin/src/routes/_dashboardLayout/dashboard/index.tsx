import { getMe } from '@/service/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@appabbang/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboardLayout/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const accessToken = useAuthStore.getState().accessToken;

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
