import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import CouponForm, { type FormType } from './coupon-form';
import { useCouponDetailQuery, useCouponUpdateMutation } from '@/hooks/use-coupon';

interface breadModifyDialogProps {
  children: React.ReactNode;
  no: number;
}

export function CouponModifyDialog({ children, no }: breadModifyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {open && <DialogBody no={no} setOpen={setOpen} />}
    </Dialog>
  );
}

function DialogBody({ no, setOpen }: { no: number; setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { data: currentData, isSuccess: currentDataIsSuccess } = useCouponDetailQuery(no);
  const couponsUpdateMutation = useCouponUpdateMutation(no);
  const [currentValues, setCurrentValues] = useState<FormType | undefined>();

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
    <DialogContent
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
      className="overflow-y-auto max-h-11/12"
    >
      <DialogHeader>
        <DialogTitle>쿠폰 수정</DialogTitle>
      </DialogHeader>
      <DialogDescription hidden>쿠폰을 수정해주세요</DialogDescription>

      {currentValues && (
        <CouponForm
          setOpen={setOpen}
          currentValues={currentValues}
          submitFn={couponsUpdateMutation.mutateAsync}
          no={no}
          isRestricted={currentData?.isRestricted}
        />
      )}
    </DialogContent>
  );
}
