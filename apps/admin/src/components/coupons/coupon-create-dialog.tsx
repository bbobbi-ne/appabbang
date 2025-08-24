import { Button } from '@appabbang/ui';

import { useCouponCreateMutation } from '@/hooks/use-coupon';
import CouponForm from './coupon-form';
import { DialogLayout } from '../ui/dialog-layout';

export function CouponCreateDialog() {
  const couponsCreateMutation = useCouponCreateMutation();

  return (
    <DialogLayout
      trigger={<Button>등록</Button>}
      title="쿠폰 등록"
      description="쿠폰을 등록해주세요"
    >
      {({ close }) => <CouponForm submitFn={couponsCreateMutation.mutateAsync} onSuccess={close} />}
    </DialogLayout>
  );
}
