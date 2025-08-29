import { useState } from 'react';
import { toast } from 'sonner';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';
import type { addresssDailogForm } from '@/validate/address-form.schema';
import AddressForm from './address-form';
import { useCreateAddressMutation } from '@/hooks/use-my';

export default function AddressCreateDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateAddressMutation();

  /**
   * 배송지 저장
   */
  const create = async (data: addresssDailogForm) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('배송지가 추가되었습니다.');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">배송지 추가</Button>
      </DialogTrigger>
      <DialogDescription className="hidden" />
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12"
      >
        <DialogHeader>
          <DialogTitle>배송지 추가</DialogTitle>
        </DialogHeader>
        <AddressForm
          onSubmit={create}
          isLoading={createMutation.isPending}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
