import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useLoadingStore } from '@/stores/loadingStore';

// ✅ 로딩 UI 컴포넌트
export function GlobalLoading() {
  const isFetching = useIsFetching(); // 쿼리 로딩 상태 개수
  const isMutating = useIsMutating(); // 뮤테이션 로딩 상태 개수
  const isLoading = useLoadingStore((s) => s.isLoading);
  const show = useLoadingStore((s) => s.show);
  const hide = useLoadingStore((s) => s.hide);

  useEffect(() => {
    if (isFetching > 0 || isMutating > 0) {
      show();
    } else {
      hide();
    }
  }, [isFetching, isMutating, show, hide]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20">
      <Loader2 className="w-10 h-10 text-white animate-spin" />
    </div>,
    document.body,
  );
}
