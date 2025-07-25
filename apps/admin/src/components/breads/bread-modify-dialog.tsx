import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@appabbang/ui';
import { useBreadsDetailQuery, useBreadsUpdateMutation } from '@/hooks/use-breads';
import { useEffect, useState } from 'react';
import BreadForm, { type BreadsDailogForm } from './bread-form';

interface breadModifyDialogProps {
  children: React.ReactNode;
  no: number;
}

export function BreadModifyDialog({ children, no }: breadModifyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {open && <DialogBody no={no} />}
    </Dialog>
  );
}

function DialogBody({ no }: { no: number }) {
  const { data: currentData, isSuccess: currentDataIsSuccess } = useBreadsDetailQuery(no);
  const { breadsUpdateMutation } = useBreadsUpdateMutation();
  const [currentValues, setCurrentValues] = useState<BreadsDailogForm | undefined>();

  useEffect(() => {
    if (currentDataIsSuccess) {
      const { breadStatus, description, images, name, unitPrice } = currentData;

      const mappedImages = images?.map((img) => ({
        url: img.url,
        publicId: img.publicId,
      }));

      setCurrentValues({
        breadStatus,
        description,
        image: mappedImages,
        name,
        unitPrice: String(unitPrice),
      });
    }
  }, [currentDataIsSuccess]);

  return (
    <DialogContent
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
      className="sm:max-w-xl h-fit p-0"
    >
      <ScrollArea className="h-[700px] p-6">
        <DialogHeader>
          <DialogTitle>메뉴수정</DialogTitle>
        </DialogHeader>
        <DialogDescription>메뉴를 수정해주세요</DialogDescription>

        {currentValues && (
          <BreadForm currentValues={currentValues} submitFn={breadsUpdateMutation} no={no} />
        )}
      </ScrollArea>
    </DialogContent>
  );
}
