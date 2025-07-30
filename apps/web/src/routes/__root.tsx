import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from '@appabbang/ui';
import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx';
import type { QueryClient } from '@tanstack/react-query';
import Header from '@/components/common/header.tsx';

export interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <Header />
        <div className="pb-[100px]" />

        {/* Content */}
        <Outlet />
        <div className="flex-grow" />

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500">
          Copyright 2025. Appabbang Co. All rights reserved
        </footer>
      </div>

      {/* 레이아웃과 관련 없는 컴포넌트들 */}
      <Toaster richColors position="top-center" duration={3000} />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  ),
});
