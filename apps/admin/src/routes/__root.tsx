import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx';

import type { QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { GlobalLoading } from '@/components/loading.tsx';
export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    return (
      <>
        <GlobalLoading />
        <Toaster richColors />
        <Outlet />
        <TanStackRouterDevtools />
        <TanStackQueryLayout />
      </>
    );
  },
});
