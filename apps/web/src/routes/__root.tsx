import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import Header from '../components/Header';
import { Toaster } from '@appabbang/ui';
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx';
import type { QueryClient } from '@tanstack/react-query';

export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Header />
      <Toaster richColors position="top-center" duration={3000} />
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  ),
});
