import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useLoadingStore } from '@/stores/loading-store';

/**
 * 🔹 GlobalLoading 컴포넌트
 * - 전역 로딩 상태를 표시하는 UI
 * - React Query의 fetch/mutation 상태와 전역 로딩 스토어 상태를 기반으로 표시
 * - 포탈을 사용하여 body 최상단에 렌더링
 */
export function GlobalLoading() {
  const isFetching = useIsFetching(); // 현재 진행 중인 쿼리 요청 개수
  const isMutating = useIsMutating(); // 현재 진행 중인 뮤테이션 요청 개수
  const isLoading = useLoadingStore((s) => s.isLoading); // 전역 로딩 상태
  const show = useLoadingStore((s) => s.show); // 로딩 시작 함수
  const hide = useLoadingStore((s) => s.hide); // 로딩 종료 함수

  // React Query 요청 상태에 따라 전역 로딩 상태를 갱신
  useEffect(() => {
    if (isFetching > 0 || isMutating > 0) {
      show(); // 요청이 하나라도 있으면 로딩 시작
    } else {
      hide(); // 요청이 없으면 로딩 종료
    }
  }, [isFetching, isMutating, show, hide]);

  // 포탈 렌더링을 위해 마운트 상태 관리
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true); // 컴포넌트 마운트 후 포탈 렌더링 가능
  }, []);

  // 마운트되지 않았거나 로딩이 아니면 렌더링하지 않음
  if (!mounted || !isLoading) return null;

  // 포탈을 사용하여 body 최상단에 로딩 UI 렌더링
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 pointer-events-auto">
      <Loader2 className="w-10 h-10 text-white animate-spin pointer-events-none" />
      {/* 로딩 스피너 */}
    </div>,
    document.body,
  );
}
