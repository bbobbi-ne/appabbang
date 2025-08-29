import { useGetBreadQuery } from '@/hooks/use-breads';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@appabbang/ui';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

// **** BreadCardDetail 컴포넌트를 참고하여 가져옴.
// 제품소개의 모달과 재사용 가능성 확인 필요
// diglog 내에서 오픈되었을때만 상세 정보 호출
export const BreadDialog = ({
  children,
  bread: breadData,
}: {
  children: React.ReactNode;
  bread: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBreadNo, setSelectedBreadNo] = useState<number>(0);
  const { data: bread } = useGetBreadQuery(selectedBreadNo);

  useEffect(() => {
    if (isOpen) {
      setSelectedBreadNo(breadData.no);
    } else {
      setSelectedBreadNo(0);
    }
  }, [isOpen]);

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

        <AlertDialogContent className="w-full max-w-3xl overflow-y-auto max-h-[90vh]">
          <AlertDialogCancel className="absolute top-1 right-1 cursor-pointer w-4">
            <X />
          </AlertDialogCancel>

          <AlertDialogTitle className="text-2xl text-center break-keep py-2">
            {bread?.name}
          </AlertDialogTitle>
          <AlertDialogDescription hidden>{bread?.description}</AlertDialogDescription>

          {/* 이미지 슬라이더 */}
          <div className="w-full max-w-[500px] mx-auto">
            <div className="w-full flex justify-center items-center">
              <img
                src={bread?.images?.[0]?.url ?? '/images/no-image.png'}
                alt="단일 이미지"
                className="h-[150px] object-contain rounded"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold">알레르기 유발 요인</h3>
            <p className="text-sm text-gray-500 break-keep">{bread?.allergyInfo}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold">원산지 정보</h3>
            <p className="text-sm text-gray-500 break-keep">{bread?.countryOfOrigin}</p>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
