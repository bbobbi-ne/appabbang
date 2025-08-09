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
import { useState } from 'react';

export function BreadCreateDialog() {
  const { breadsCreateMutation } = useBreadsCreateMutation();
  const [opne, setOpen] = useState(false);

  return (
    <Dialog open={opne} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button className="ml-auto">빵 추가하기</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-xl h-fit p-0"
      >
        <DialogHeader>
          <DialogTitle>빵 등록</DialogTitle>
        </DialogHeader>
        <DialogDescription hidden>메뉴를 등록해주세요</DialogDescription>
        <ScrollArea className="h-[700px] p-6">
          <BreadForm setOpen={setOpen} submitFn={breadsCreateMutation} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
