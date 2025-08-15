import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  ScrollArea,
} from '@appabbang/ui';
import { useState, type ReactNode } from 'react';

/**
 * 🔹 DialogLayoutProps
 * @param trigger - 다이얼로그를 여는 버튼 또는 요소
 * @param title - 다이얼로그 제목 불필요시 ""
 * @param description - 다이얼로그 설명 불필요시 ""
 * @param children - 다이얼로그 내용. close 함수를 받아 다이얼로그를 닫을 수 있음
 */
export interface DialogLayoutProps {
  trigger: ReactNode;
  title: string;
  description: string;
  children: (props: { close: () => void }) => ReactNode;
}

/**
 * 🔹 DialogLayout 컴포넌트
 * 공통 다이얼로그 레이아웃으로 사용
 * - trigger 클릭 시 다이얼로그 오픈
 * - title, description 표시
 * - ScrollArea로 내용 스크롤 가능
 * - children에 close 함수를 전달하여 다이얼로그 닫기 가능
 */
export function DialogLayout({ trigger, title, description, children }: DialogLayoutProps) {
  const [open, setOpen] = useState(false); // 다이얼로그 오픈 상태
  const close = () => setOpen(false); // 다이얼로그 닫기 함수

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 다이얼로그 트리거 요소 */}
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {/* 다이얼로그가 열려 있을 때만 렌더링 */}
      {open && (
        <DialogContent
          className="pr-0 pl-6"
          onInteractOutside={(e) => {
            e.preventDefault(); // 다이얼로그 외부 클릭 시 닫기 방지
          }}
        >
          <DialogHeader>
            {/* 다이얼로그 제목 */}
            <DialogTitle>{title}</DialogTitle>
            {/* 다이얼로그 설명 (hidden 처리) */}
            <DialogDescription hidden>{description}</DialogDescription>
          </DialogHeader>

          {/* 스크롤 가능한 영역에 children 렌더링 */}
          <ScrollArea className="h-[700px] pr-6">{children({ close })}</ScrollArea>
        </DialogContent>
      )}
    </Dialog>
  );
}
