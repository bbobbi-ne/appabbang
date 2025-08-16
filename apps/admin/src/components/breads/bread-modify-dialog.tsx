import { useState, useEffect } from 'react';
import { useGetBreadDetailQuery, useUpdateBreadMutation } from '@/hooks/use-breads';
import { DialogLayout } from '@/components/ui/dialog-layout';
import BreadForm, { type BreadsDailogForm } from './bread-form';

interface BreadModifyDialogProps {
  children: React.ReactNode;
  no: number;
}

export function BreadModifyDialog({ children, no }: BreadModifyDialogProps) {
  return (
    <DialogLayout trigger={children} title="빵 수정" description="메뉴를 수정해주세요">
      {({ close }) => <DialogBody no={no} close={close} />}
    </DialogLayout>
  );
}

interface DialogBodyProps {
  no: number;
  close: () => void;
}

function DialogBody({ no, close }: DialogBodyProps) {
  const { data, isSuccess } = useGetBreadDetailQuery(no);
  const { updateBread } = useUpdateBreadMutation();
  const [currentValues, setCurrentValues] = useState<BreadsDailogForm>();

  useEffect(() => {
    if (isSuccess && data) {
      setCurrentValues({
        breadStatus: data.breadStatus,
        description: data.description ?? '',
        image: data.images?.map((img) => ({ url: img.url, publicId: img.publicId })),
        name: data.name,
        countryOfOrigin: data.countryOfOrigin,
        allergyInfo: data.allergyInfo,
        unitPrice: String(data.unitPrice),
      });
    }
  }, [isSuccess, data, setCurrentValues]);

  if (!currentValues) return <p>Loading...</p>;

  return (
    <BreadForm currentValues={currentValues} submitFn={updateBread} no={no} onSuccess={close} />
  );
}
