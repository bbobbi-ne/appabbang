import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@appabbang/ui';
import AddressForm, { type addresssDailogForm } from '@/components/mypage/address-form';
import { MyService } from '@/services/api/my-service';

export default function AddressCreateDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { createAddress } = MyService;

  const createMutation = useMutation({
    mutationFn: (data: addresssDailogForm) => createAddress(data),
    onSuccess: () => {
      toast.success('배송지가 추가되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['getAddresses'] });
      setOpen(false);
    },
  });

  /**
   * 배송지 저장
   */
  const create = async (data: addresssDailogForm) => {
    try {
      await createMutation.mutateAsync(data);
    } catch (error) {
      toast.error('배송지 저장과정에서 오류가 발생했습니다.');
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
        <AddressForm onSubmit={create} isLoading={createMutation.isPending} />
      </DialogContent>
    </Dialog>
  );
}
