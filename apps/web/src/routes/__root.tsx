import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@appabbang/ui';
import Header from '@/components/common/header.tsx';
import Footer from '@/components/common/footer.tsx';

// 웹 시작 시 무조건 초기화
sessionStorage.removeItem('accessToken');

export interface MyRouterContext {
  queryClient: QueryClient;
}

/*
 !!! 가로 풀사이즈가 아닌 컨텐츠 영역은 container 클래스 로 제한
 !!! container 사용시 mx-auto 와 px-2 (8px)를 사용함.
 !!! 헤더(fixed) 높이만큼 임의의 높이 100px 를 패딩으로 추가함.
*/
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
      {/* <TanStackRouterDevtools /> */}
      <ReactQueryDevtools />
    </>
  ),
});
