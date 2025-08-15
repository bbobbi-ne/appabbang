import { Button } from '@appabbang/ui';
import OrderRoundForm from './order-round-form';
import { useOrderRoundCreateMutation } from '@/hooks/use-order-round';
import { DialogLayout } from '../ui/dialog-layout';

function OrderRoundCreateDialog() {
  const { orderRoundCreateMutation } = useOrderRoundCreateMutation();

  return (
    <DialogLayout
      trigger={<Button className="ml-auto">등록</Button>}
      description="주문차수를 등록해주세요"
      title="주문차수 등록"
    >
      {({ close }) => <OrderRoundForm submitFn={orderRoundCreateMutation} onSuccess={close} />}
    </DialogLayout>
  );
}

export default OrderRoundCreateDialog;
