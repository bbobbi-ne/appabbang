import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import TanStackQueryLayout from '@/integrations/tanstack-query/layout.tsx';

import type { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@appabbang/ui';
import { GlobalLoading } from '@/components/ui/loading.tsx';
import { useThemeStore } from '@/stores/theme-store';
export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const theme = useThemeStore((s) => s.theme);

    return (
      <>
        <GlobalLoading />
        <Toaster richColors theme={theme} />
        <Outlet />
        {/* <TanStackRouterDevtools /> */}
        <TanStackQueryLayout />
      </>
    );
  },
});
