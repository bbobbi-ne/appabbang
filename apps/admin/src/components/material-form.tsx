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
  Form,
} from '@appabbang/ui';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef } from 'react';
import { useMaterialAndTypeQuery } from '@/hooks/use-material';

export const breadSchema = z.object({
  name: z.string().trim().min(1, '메뉴명을 입력해주세요'),
  quantity: z.string().trim().min(1, '재고 수량을 입력해주세요'),
  unit: z.string().trim().min(1, '단위를 입력해주세요'),
  type: z.string({
    required_error: '재료타입을 선택해주세요',
  }),
});
export type BreadsDailogForm = z.infer<typeof breadSchema>;

function MaterialForm() {
  const closeRef = useRef<HTMLButtonElement>(null);
  const materialType = useMaterialAndTypeQuery().materialType;

  const form = useForm<BreadsDailogForm>({
    resolver: zodResolver(breadSchema),
    defaultValues: {
      name: '',
      quantity: '',
      unit: '',
      type: undefined,
    },
  });

  const onSubmit = async (data: any) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => {
            return (
              <FormItem className="flex">
                <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                  재료 타입
                </FormLabel>
                <div className="flex-3/4">
                  <FormControl>
                    <RadioGroup
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      className="grid grid-cols-3 "
                    >
                      {materialType?.map(({ name, code }) => (
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

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                재료명
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input placeholder="재료명을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                단위
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input placeholder="단위를 입력해주세요 kg,개,1봉지 ..." {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                재고수량
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input placeholder="재고수량을 입력해주세요" {...field} />
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
          <DialogClose ref={closeRef} asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button type="submit">재료등록</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default MaterialForm;
