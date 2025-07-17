import { refreshCreate } from '@/service/auth-api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
});

function RouteComponent() {
  const test = async () => {
    const test = await refreshCreate();
  };

  return <button onClick={test}>홈화면</button>;
}
