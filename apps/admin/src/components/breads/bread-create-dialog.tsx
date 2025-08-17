import { useCreateBreadMutation } from '@/hooks/use-breads';
import BreadForm from './bread-form';
import { DialogLayout } from '@/components/ui/dialog-layout';
import { Button } from '@appabbang/ui';

export function BreadCreateDialog() {
  const { createBread } = useCreateBreadMutation();

  return (
    <DialogLayout
      trigger={<Button>빵 추가하기</Button>}
      title="빵 등록"
      description="메뉴를 등록해주세요"
    >
      {({ close }) => <BreadForm submitFn={createBread} onSuccess={close} />}
    </DialogLayout>
  );
}
