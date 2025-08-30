import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
  //   Button,
} from '@appabbang/ui';
import { AlertDialogDescription } from '@appabbang/ui';
import { AlertDialog } from '@appabbang/ui';
import { useState } from 'react';

type Props = {
  children: (props: { open: (data: unknown) => void }) => React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: (data: unknown) => void;
  isLoading?: boolean;
  actionText?: string;
};

/** Trigger 없이 children 함수로 외부에서 열도록 콜백 제공 */
export default function ConfirmDialog({
  children,
  title,
  description,
  onConfirm,
  isLoading,
  actionText = '확인',
}: Props) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<unknown>(null);
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        {children({
          open: (data: unknown) => {
            setData(data);
            setOpen(true); // 외부에서 열도록 콜백 제공
          },
        })}

        <AlertDialogContent onClick={(e) => e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={() => onConfirm(data)}>
              {actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
