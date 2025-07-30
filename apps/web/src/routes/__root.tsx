import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@appabbang/ui';
import Header from '@/components/common/header.tsx';
import Footer from '@/components/common/footer.tsx';

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
        <Footer />
      </div>

      {/* 레이아웃과 관련 없는 컴포넌트들 */}
      <Toaster richColors position="top-center" duration={3000} />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  ),
});
