import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@appabbang/ui';

import { useBreadsCreateMutation } from '@/hooks/use-breads';
import BreadForm from './bread-form';

export function BreadCreateDialog() {
  const { breadsCreateMutation } = useBreadsCreateMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto">빵 추가하기</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-xl h-fit p-0"
      >
        <ScrollArea className="h-[700px] p-6">
          <DialogHeader>
            <DialogTitle>메뉴등록</DialogTitle>
          </DialogHeader>
          <DialogDescription>메뉴를 등록해주세요</DialogDescription>
          <BreadForm submitFn={breadsCreateMutation} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
