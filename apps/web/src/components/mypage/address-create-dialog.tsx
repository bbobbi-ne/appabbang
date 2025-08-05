import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';
import AddressForm, { type addresssDailogForm } from '@/components/mypage/address-form';

export default function AddressCreateDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: addresssDailogForm) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 2000);
      });
    },
  });

  const create = async (data: addresssDailogForm) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('배송지가 추가되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['address'] });
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto">배송지 추가</Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12"
      >
        <DialogHeader>
          <DialogTitle>배송지 추가</DialogTitle>
        </DialogHeader>
        <AddressForm onSubmit={create} isLoading={createMutation.isPending} />
      </DialogContent>
    </Dialog>
  );
}
