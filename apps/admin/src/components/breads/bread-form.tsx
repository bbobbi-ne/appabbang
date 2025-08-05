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
  ScrollArea,
} from '@appabbang/ui';

import { useForm } from 'react-hook-form';
import { ImageUploadField } from './Image-upload-field';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetBreadsAndStatusQuery } from '@/hooks/use-breads';
import { useRef } from 'react';
import { formatKR } from '@/utils/format';

export const breadSchema = z.object({
  name: z.string().trim().min(1, '메뉴명을 입력해주세요'),
  description: z.string().trim().min(1, '설명을 입력해주세요'),
  countryOfOrigin: z.string().trim().min(1, '원산지를 입력해주세요'),
  allergyInfo: z.string(),
  unitPrice: z
    .string()
    .trim()
    .refine(
      (val) => {
        const num = Number(val.replace(/,/g, ''));
        return !isNaN(num) && num >= 1000 && num < 100000;
      },
      {
        message: '단가는 1,000원 이상 100,000원 미만의 숫자로 입력해주세요.',
      },
    ),
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
  submitFn: (arg: any) => Promise<any>;
  currentValues?: BreadsDailogForm;
  no?: number;
}

function BreadForm({ submitFn, currentValues, no }: BreadFormProps) {
  const breadStatus = useGetBreadsAndStatusQuery().breadStatus;
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
          breadStatus: '10',
          allergyInfo: '',
          countryOfOrigin: '',
        },
  });

  const onSubmit = async (data: BreadsDailogForm) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('unitPrice', data.unitPrice);
    formData.append('breadStatus', data.breadStatus);
    formData.append('allergyInfo', data.allergyInfo);
    formData.append('countryOfOrigin', data.countryOfOrigin);

    data.image.forEach((file) => {
      if (file instanceof File) {
        formData.append('image', file);
      }
    });

    if (no !== undefined) {
      formData.append('no', String(no));
    }

    try {
      await submitFn({ formData: formData, no: no || {} });

      form.reset();
      closeRef.current?.click();
    } catch (error: any) {
      const message = error.message ?? '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.';

      form.setError('root', {
        type: 'manual',
        message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4 pr-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 빵 이름
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
          name="image"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 이미지
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
          name="unitPrice"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 단가(원)
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input
                    className="text-right"
                    inputMode="numeric"
                    placeholder="단가를 입력해주세요"
                    {...field}
                    value={formatKR(field.value)}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      if (onlyDigits.length > 5) {
                        form.setError('unitPrice', {
                          type: 'manual',
                          message: '단가는 최대 100,000원까지만 입력할 수 있습니다.',
                        });
                      } else {
                        form.clearErrors('unitPrice');
                        field.onChange(onlyDigits);
                      }
                    }}
                    onFocus={(e) => {
                      const val = e.target.value;
                      setTimeout(() => {
                        e.target.setSelectionRange(val.length, val.length);
                      }, 0);
                    }}
                  />
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
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 설명
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <ScrollArea className="h-[150px]">
                    <Textarea
                      placeholder="설명을 입력해주세요"
                      className="resize-none h-[150px]"
                      {...field}
                    />
                  </ScrollArea>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 원산지 정보
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <ScrollArea className="h-[100px]">
                    <Textarea
                      placeholder="원산지 정보를 입력해주세요"
                      className="resize-none h-[100px]"
                      {...field}
                    />
                  </ScrollArea>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allergyInfo"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                알레르기 정보
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <ScrollArea className="h-[80px]">
                    <Textarea
                      placeholder="알레르기 정보를 입력해주세요"
                      className="resize-none h-[80px]"
                      {...field}
                    />
                  </ScrollArea>
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
              <FormItem className="hidden">
                <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                  <strong className="text-red-500">*</strong> 상태
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
