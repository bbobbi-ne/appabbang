import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';

import { useCreateBreadMutation } from '@/hooks/use-breads';
import BreadForm from './bread-form';

export function BreadsCreateDialog() {
  const { CreateBreadMutation } = useCreateBreadMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto bg-accent-foreground">빵 추가하기</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-xl overflow-y-auto max-h-full "
      >
        <DialogHeader>
          <DialogTitle>메뉴등록</DialogTitle>
        </DialogHeader>
        <DialogDescription>메뉴를 등록해주세요</DialogDescription>
        <BreadForm submitFn={CreateBreadMutation} />
      </DialogContent>
    </Dialog>
  );
}
