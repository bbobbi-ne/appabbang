import { ImageUploadField } from '@/components/ImageUploadField';
import { z } from 'zod';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
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
  Toaster,
} from '@appabbang/ui';

import { toast } from 'sonner';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBreadStatus } from '@/hooks/useBreadStatus';
import { useCreateBreadMutation } from '@/hooks/useBreads';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

export const breadsDailogSchema = z.object({
  name: z.string().trim().min(1, '메뉴명을 입력해주세요'),
  description: z.string().trim().min(1, '설명을 입력해주세요'),
  unitPrice: z.string().trim().min(1, '가격을 입력해주세요'),
  breadStatus: z.string({
    required_error: '상태를 선택해주세요',
  }),
  image: z.array(z.instanceof(File)).min(1, '최소 1장의 이미지를 업로드해주세요'),
});
type BreadsDailogForm = z.infer<typeof breadsDailogSchema>;

export function BreadsDialog() {
  const { data } = useBreadStatus();
  const breadStatus = data?.breadStatus;
  const { CreateBreadMutation, error, isError, isSuccess, isPending } = useCreateBreadMutation();
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<BreadsDailogForm>({
    resolver: zodResolver(breadsDailogSchema),
    defaultValues: {
      name: '',
      description: '',
      image: [],
      unitPrice: '',
      breadStatus: undefined,
    },
  });

  const onSubmit = (data: BreadsDailogForm) => {
    CreateBreadMutation({ ...data });
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      closeRef.current?.click();
      toast.success('완료!', {
        description: '빵목록이 추가되었습니다!.',
        position: 'top-center',
        action: {
          label: '닫기',
          onClick: () => {},
        },
      });
      return;
    }

    if (isError && error) {
      const message = error.message ?? '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.';

      form.setError('root', {
        type: 'manual',
        message,
      });
      toast.error('에러발생!', {
        description: message,
        position: 'top-center',
        action: {
          label: '닫기',
          onClick: () => {},
        },
      });
    }
  }, [isSuccess, isError, error]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto bg-accent-foreground">추가</Button>
      </DialogTrigger>
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
          <DialogTitle>메뉴등록</DialogTitle>
        </DialogHeader>
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
                      <ImageUploadField {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breadStatus"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                    상태
                  </FormLabel>
                  <div className="flex-3/4">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
              )}
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
      </DialogContent>
    </Dialog>
  );
}
