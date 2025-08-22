import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@appabbang/ui';
import { useEffect, useState } from 'react';
import CouponForm, { type FormType } from './coupon-form';
import {
  useCouponDeleteMutation,
  useCouponDetailQuery,
  useCouponUpdateMutation,
} from '@/hooks/use-coupon';
import { toast } from 'sonner';
import { DialogLayout } from '../ui/dialog-layout';

interface breadModifyDialogProps {
  children: React.ReactNode;
  no: number;
}

export function CouponModifyDialog({ children, no }: breadModifyDialogProps) {
  return (
    <DialogLayout
      height={200}
      trigger={children}
      title="쿠폰 수정"
      description="쿠폰을 수정해주세요"
    >
      {({ close }) => <DialogBody no={no} close={close} />}
    </DialogLayout>
  );
}

function DialogBody({ no, close }: { no: number; close: () => void }) {
  const { data: currentData, isSuccess: currentDataIsSuccess } = useCouponDetailQuery(no);
  const couponsUpdateMutation = useCouponUpdateMutation(no);
  const couponsDeleteMutation = useCouponDeleteMutation(no);
  const [currentValues, setCurrentValues] = useState<FormType | undefined>();

  const deleteFn = async (no: number) => {
    try {
      await couponsDeleteMutation.mutateAsync(no);
      toast.success('삭제가 완료되었습니다.');
      close();
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentDataIsSuccess) {
      const { name, amount, expireAfterDays } = currentData;

      setCurrentValues({
        name,
        amount: String(amount),
        expireAfterDays: String(expireAfterDays),
      });
    }
  }, [currentDataIsSuccess]);

  return (
    <>
      {currentValues && (
        <CouponForm
          onSuccess={close}
          currentValues={currentValues}
          submitFn={couponsUpdateMutation.mutateAsync}
          no={no}
          isRestricted={currentData?.isRestricted}
          deleteFn={deleteFn}
          deleteLoading={couponsDeleteMutation.isPending}
        />
      )}
    </>
  );
}
