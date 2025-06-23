import { ImageUploadField } from '@/components/Image-upload-field';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from '@appabbang/ui';

import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBreadStatus } from '@/hooks/useBreadStatus';
import {
  useCreateBreadMutation,
  useGetBreadQuery,
  useUpdateBreadMutation,
} from '@/hooks/useBreads';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { breadSchema } from './breads-create-dialog';

type BreadsDailogForm = z.infer<typeof breadSchema>;

interface breadModifyDialogProps {
  children: React.ReactNode;
  no: number;
}

export function BreadModifyDialog({ children, no }: breadModifyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {open && <DialogForm no={no} />}
    </Dialog>
  );
}

function DialogForm({ no }: { no: number }) {
  const { data: breadStatusData } = useBreadStatus();
  const breadStatus = breadStatusData?.breadStatus;
  const closeRef = useRef<HTMLButtonElement>(null);
  const { data: currentData, isPending, isError, isSuccess, isLoading } = useGetBreadQuery(no);
  const { updateBreadMutation } = useUpdateBreadMutation();

  const form = useForm<BreadsDailogForm>({
    resolver: zodResolver(breadSchema),
    defaultValues: {
      name: '',
      description: '',
      image: [],
      unitPrice: '',
      breadStatus: undefined,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const {
        breadStatus: currentBreadStatus,
        description: currentDescription,
        images: currentImages,
        name: currentName,
        unitPrice: currentUnitPrice,
      } = currentData;

      console.log(currentBreadStatus);
      form.setValue('name', currentName);
      form.setValue('breadStatus', currentBreadStatus);
      form.setValue('description', currentDescription);
      form.setValue('image', currentImages);
      form.setValue('unitPrice', String(currentUnitPrice));
    }
  }, [isSuccess]);

  const onSubmit = (data: BreadsDailogForm) => {
    const res = updateBreadMutation({ Bread: data, no: no });

    console.log(res);
  };

  return (
    <DialogContent
      onInteractOutside={(e) => {
        e.preventDefault();
      }}
      className="sm:max-w-xl overflow-y-auto max-h-full "
    >
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-[1px]">
          <Loader2 className="animate-spin w-14 h-14 text-accent-foreground" />
        </div>
      )}

      <DialogHeader>
        <DialogTitle>메뉴수정</DialogTitle>
      </DialogHeader>
      <DialogDescription>메뉴를 수정해주세요</DialogDescription>

      {isSuccess && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                    메뉴명
                  </FormLabel>
                  <div className="flex-3/4 space-y-1">
                    <FormControl>
                      <Input placeholder="메뉴명을 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                    설명
                  </FormLabel>
                  <div className="flex-3/4 space-y-1">
                    <FormControl>
                      <Textarea
                        placeholder="설명을 입력해주세요"
                        className="resize-none w-full break-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unitPrice"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                    단가
                  </FormLabel>
                  <div className="flex-3/4 space-y-1">
                    <FormControl>
                      <Input placeholder="단가를 입력해주세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                    이미지
                  </FormLabel>
                  <div className="flex-3/4 space-y-1">
                    <FormControl>
                      <ImageUploadField field={field} no={currentData.no} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breadStatus"
              render={({ field }) => {
                console.log(field);
                return (
                  <FormItem className="flex">
                    <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                      상태
                    </FormLabel>
                    <div className="flex-3/4">
                      <FormControl>
                        <RadioGroup
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          className="grid grid-cols-2 "
                        >
                          {breadStatus?.map(({ name, code }) => (
                            <FormItem key={code} className="space-x-1">
                              <FormControl>
                                <RadioGroupItem value={code} />
                              </FormControl>
                              <FormLabel>{name}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              {form.formState.errors.root && (
                <p className="text-destructive text-sm self-center mx-auto">
                  {form.formState.errors.root.message}
                </p>
              )}
              <DialogClose asChild>
                <Button ref={closeRef} type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button type="submit">빵등록</Button>
            </DialogFooter>
          </form>
        </Form>
      )}
    </DialogContent>
  );
}
