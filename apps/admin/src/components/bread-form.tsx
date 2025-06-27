import {
  Button,
  DialogClose,
  DialogFooter,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Textarea,
  Form,
} from '@appabbang/ui';

import { useForm } from 'react-hook-form';
import { ImageUploadField } from './Image-upload-field';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBreadStatus } from '@/hooks/use-breads';
import { useEffect, useRef } from 'react';

export const breadSchema = z.object({
  name: z.string().trim().min(1, '메뉴명을 입력해주세요'),
  description: z.string().trim().min(1, '설명을 입력해주세요'),
  unitPrice: z.string().trim().min(1, '가격을 입력해주세요'),
  breadStatus: z.string({
    required_error: '상태를 선택해주세요',
  }),
  image: z.array(
    z.union([
      z.instanceof(File),
      z.object({}).passthrough(), // 어떤 object든 허용
    ]),
  ),
});
export type BreadsDailogForm = z.infer<typeof breadSchema>;

interface BreadFormProps {
  submitFn: (arg: any) => void;
  currentValues?: BreadsDailogForm;
  no?: number;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}

function BreadForm({ submitFn, currentValues, no, isError, error, isSuccess }: BreadFormProps) {
  const breadStatus = useBreadStatus().data;
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<BreadsDailogForm>({
    resolver: zodResolver(breadSchema),
    defaultValues: currentValues
      ? currentValues
      : {
          name: '',
          description: '',
          image: [],
          unitPrice: '',
          breadStatus: undefined,
        },
  });

  const onSubmit = async (data: BreadsDailogForm) => {
    submitFn({
      ...data,
      ...(no !== undefined ? { no } : {}),
    });
    if (isSuccess) {
      form.reset();
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      closeRef.current?.click();
      // toast.success('완료!', {
      //   description: '빵목록이 추가되었습니다!.',
      //   position: 'top-center',
      //   action: {
      //     label: '닫기',
      //     onClick: () => {},
      //   },
      // });
      return;
    }

    if (isError && error) {
      const message = error.message ?? '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.';
      console.log(error);
      form.setError('root', {
        type: 'manual',
        message,
      });
      // toast.error('에러발생!', {
      //   description: message,
      //   position: 'top-center',
      //   action: {
      //     label: '닫기',
      //     onClick: () => {},
      //   },
      // });
      return;
    }
  }, [isSuccess, isError, error]);

  return (
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
                  <ImageUploadField field={field} no={no} />
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
          <DialogClose ref={closeRef} asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button type="submit">빵등록</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default BreadForm;
