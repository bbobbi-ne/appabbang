import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Header from '@/components/header.tsx';
import { Toaster } from '@appabbang/ui';
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx';
import type { QueryClient } from '@tanstack/react-query';
import LayoutSidebar from '@/components/layout-sidebar.tsx';

export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <LayoutSidebar>
        <Header />
        <Toaster richColors position="top-center" duration={3000} />
        <Outlet />
      </LayoutSidebar>

      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  ),
});
