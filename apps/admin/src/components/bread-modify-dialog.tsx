import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';
import { useGetBreadQuery, useUpdateBreadMutation } from '@/hooks/useBreads';
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
      {open && <DialogForm no={no} />}
    </Dialog>
  );
}

function DialogForm({ no }: { no: number }) {
  const { data: currentData, isSuccess: currentDataIsSuccess } = useGetBreadQuery(no);
  const { updateBreadMutation, isError, isSuccess, error } = useUpdateBreadMutation();
  const [currentValues, setCurrentValues] = useState<BreadsDailogForm | undefined>();

  useEffect(() => {
    if (currentDataIsSuccess) {
      const { breadStatus, description, images, name, unitPrice } = currentData;

      const mappedImages = images.map((img) => ({
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
      className="sm:max-w-xl overflow-y-auto max-h-full "
    >
      <DialogHeader>
        <DialogTitle>메뉴수정</DialogTitle>
      </DialogHeader>
      <DialogDescription>메뉴를 수정해주세요</DialogDescription>

      {currentValues && (
        <BreadForm
          currentValues={currentValues}
          submitFn={updateBreadMutation}
          error={error}
          isError={isError}
          no={no}
          isSuccess={isSuccess}
        />
      )}
    </DialogContent>
  );
}
