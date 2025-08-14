import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';

import { useCouponCreateMutation } from '@/hooks/use-coupon';
import CouponForm from './coupon-form';
import { useState } from 'react';

export function CouponCreateDialog() {
  const couponsCreateMutation = useCouponCreateMutation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button className="ml-auto">등록</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12"
      >
        <DialogHeader>
          <DialogTitle>쿠폰 등록</DialogTitle>
        </DialogHeader>
        <DialogDescription hidden>쿠폰을 등록해주세요</DialogDescription>
        <CouponForm setOpen={setOpen} submitFn={couponsCreateMutation.mutateAsync} />
      </DialogContent>
    </Dialog>
  );
}
