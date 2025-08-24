import {
  Button,
  DialogClose,
  DialogFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PopoverTrigger,
  Popover,
  PopoverContent,
  Calendar,
  cn,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  Label,
  Badge,
  ScrollBar,
  ScrollArea,
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Check } from 'lucide-react';

import { useGetBreadsQuery } from '@/hooks/use-breads';
import BreadPreview from './bread-preview';
import { ImageUpload } from './image-upload';
import { formatDateTime, formatDateTimeToIso } from '@appabbang/utils';

export const orderRoundSchema = z.object({
  name: z.string().trim().min(1, '메뉴명을 입력해주세요'),
  startedAt: z.date({ required_error: '시작일은 필수입니다.' }),
  endedAt: z.date({ required_error: '종료일은 필수입니다.' }),
  orderRoundBreads: z
    .array(
      z.object({
        no: z.number(),
        name: z.string(),
      }),
    )
    .refine((arr) => arr.length > 0, {
      message: '하나 이상의 항목을 선택해주세요.',
    }),
  image: z
    .union([
      z.instanceof(File),
      z.string(),
      z.null(),
      z.object({
        url: z.string(),
        publicId: z.string(),
        order: z.number(),
      }),
    ])
    .optional(),
});
export type OrderRoundDailogForm = z.infer<typeof orderRoundSchema>;

interface OrderRoundFormProps {
  submitFn: (arg: any) => Promise<any>;
  currentValues?: OrderRoundDailogForm;
  no?: number;
  onSuccess: () => void;
}

function OrderRoundForm({ currentValues, no, onSuccess, submitFn }: OrderRoundFormProps) {
  const form = useForm<OrderRoundDailogForm>({
    resolver: zodResolver(orderRoundSchema),
    defaultValues: currentValues
      ? currentValues
      : {
          name: '',
          image: undefined,
          orderRoundBreads: [],
          startedAt: undefined,
          endedAt: undefined,
        },
  });
  useEffect(() => {
    if (currentValues) {
      setSelectedBreads(currentValues.orderRoundBreads);
    }
  }, [currentValues]);

  const startedAt = form.watch('startedAt');
  const { data: breads, isError, isLoading } = useGetBreadsQuery();
  const [selectedBreads, setSelectedBreads] = useState<{ no: number; name: string }[] | []>([]);

  const onSubmit = async (data: OrderRoundDailogForm) => {
    const formData = new FormData();
    const startedAt = formatDateTimeToIso(data.startedAt);
    const endedAt = formatDateTimeToIso(data.endedAt);
    const orderRoundBreads = JSON.stringify(
      data.orderRoundBreads.map((item) => {
        return { no: item.no };
      }),
    );

    formData.append('name', data.name);
    formData.append('startedAt', startedAt);
    formData.append('endedAt', endedAt);
    formData.append('orderRoundBreads', orderRoundBreads);
    formData.append('minOrderQty', '1');
    formData.append('maxOrderQty', '99');

    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    if (no !== undefined) {
      formData.append('no', String(no));
      formData.append('seq', String(no));
    }

    try {
      await submitFn({ formData: formData, no: no || {} });
      form.reset();
      onSuccess();
    } catch (error: any) {
      const message = error.message ?? '알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.';
      form.setError('root', {
        type: 'manual',
        message,
      });
    }
  };

  const [hoverBread, setHoverBread] = useState<number | undefined>();
  const onMouseEnterBread = (no: number | undefined) => {
    setHoverBread(no);
  };

  function handleTimeChange(
    type: 'hour' | 'minute' | 'ampm',
    value: string,
    name: 'startedAt' | 'endedAt',
  ) {
    const currentDate = form.getValues('startedAt') || new Date();
    let newDate = new Date(currentDate);

    if (type === 'hour') {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === 'ampm') {
      const hours = newDate.getHours();
      if (value === 'AM' && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === 'PM' && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue(name, newDate);
  }

  function handleDateSelect(date: Date | undefined, name: 'startedAt' | 'endedAt') {
    if (date) {
      form.setValue(name, date);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4 pr-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 주문차수명
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
          name="orderRoundBreads"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 빵 판매목록
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Command className="rounded-lg border shadow-md group relative">
                    {hoverBread && <BreadPreview no={hoverBread} />}
                    <CommandInput placeholder="빵 이름을 검색해주세요" />
                    <CommandList className="absolute inset-0 top-full pt-1 h-[150px] z-20 hidden group-focus-within:block bg-background border rounded shadow">
                      <CommandEmpty>일치하는 빵이 없습니다.</CommandEmpty>
                      {breads ? (
                        breads.map((bread) => {
                          const isSelected = field.value?.some((b: any) => b.no === bread.no);
                          return (
                            <CommandItem
                              onMouseEnter={() => onMouseEnterBread(bread.no)}
                              onMouseLeave={() => onMouseEnterBread(undefined)}
                              className="flex justify-between items-center"
                              onSelect={() => {
                                const isSelected = field.value?.some((b: any) => b.no === bread.no);
                                const updatedList = isSelected
                                  ? field.value.filter((b: any) => b.no !== bread.no)
                                  : [...(field.value || []), { no: bread.no, name: bread.name }];
                                field.onChange(updatedList);
                                setSelectedBreads(updatedList);
                              }}
                              key={bread.no}
                              value={`${bread.no}-${bread.name}`}
                            >
                              <span>{bread.name}</span>
                              {isSelected && <Check className="w-4 h-4 text-green-500" />}
                            </CommandItem>
                          );
                        })
                      ) : (
                        <CommandItem>...로딩중</CommandItem>
                      )}
                    </CommandList>
                  </Command>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        {selectedBreads.length > 0 && (
          <div className="flex items-center">
            <Label className="flex-1/4 pr-2 py-3">선택된 빵 목록</Label>
            <div className="flex-3/4 space-x-0.5 space-y-0.5">
              {selectedBreads.map((item) => {
                return (
                  <Badge
                    onMouseEnter={() => onMouseEnterBread(item.no)}
                    onMouseLeave={() => onMouseEnterBread(undefined)}
                    key={item.no}
                    className="cursor-pointer"
                    onClick={() => {
                      const updatedList = form
                        .getValues('orderRoundBreads')
                        .filter((b) => b.no !== item.no);
                      form.setValue('orderRoundBreads', updatedList);
                      setSelectedBreads(updatedList);
                      onMouseEnterBread(undefined);
                    }}
                    variant={'outline'}
                  >
                    {item.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="startedAt"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 시작일
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          formatDateTime(field.value)
                        ) : (
                          <span>시작일을 선택해주세요</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date <= today;
                        }}
                        mode="single"
                        selected={field.value}
                        onSelect={(v) => handleDateSelect(v, 'startedAt')}
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i + 1)
                              .reverse()
                              .map((hour) => (
                                <Button
                                  key={hour}
                                  size="icon"
                                  variant={
                                    field.value && field.value.getHours() % 12 === hour % 12
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange('hour', hour.toString(), 'startedAt')
                                  }
                                >
                                  {hour}
                                </Button>
                              ))}
                          </div>
                          <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  field.value && field.value.getMinutes() === minute
                                    ? 'default'
                                    : 'ghost'
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange('minute', minute.toString(), 'startedAt')
                                }
                              >
                                {minute.toString().padStart(2, '0')}
                              </Button>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="">
                          <div className="flex sm:flex-col p-2">
                            {['AM', 'PM'].map((ampm) => (
                              <Button
                                key={ampm}
                                size="icon"
                                variant={
                                  field.value &&
                                  ((ampm === 'AM' && field.value.getHours() < 12) ||
                                    (ampm === 'PM' && field.value.getHours() >= 12))
                                    ? 'default'
                                    : 'ghost'
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() => handleTimeChange('ampm', ampm, 'startedAt')}
                              >
                                {ampm}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endedAt"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 종료일
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={!startedAt}
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          formatDateTime(field.value)
                        ) : (
                          <span>종료일을 선택해주세요</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        disabled={(date) => {
                          const startDate = form.getValues().startedAt;
                          if (!startDate) return true;

                          const minDate = new Date(startDate);
                          minDate.setDate(minDate.getDate() + 1);

                          const maxDate = new Date(startDate);
                          maxDate.setDate(maxDate.getDate() + 7);

                          return date < minDate || date > maxDate;
                        }}
                        mode="single"
                        selected={field.value}
                        onSelect={(v) => handleDateSelect(v, 'endedAt')}
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i + 1)
                              .reverse()
                              .map((hour) => (
                                <Button
                                  key={hour}
                                  size="icon"
                                  variant={
                                    field.value && field.value.getHours() % 12 === hour % 12
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange('hour', hour.toString(), 'endedAt')
                                  }
                                >
                                  {hour}
                                </Button>
                              ))}
                          </div>
                          <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  field.value && field.value.getMinutes() === minute
                                    ? 'default'
                                    : 'ghost'
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange('minute', minute.toString(), 'endedAt')
                                }
                              >
                                {minute.toString().padStart(2, '0')}
                              </Button>
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="">
                          <div className="flex sm:flex-col p-2">
                            {['AM', 'PM'].map((ampm) => (
                              <Button
                                key={ampm}
                                size="icon"
                                variant={
                                  field.value &&
                                  ((ampm === 'AM' && field.value.getHours() < 12) ||
                                    (ampm === 'PM' && field.value.getHours() >= 12))
                                    ? 'default'
                                    : 'ghost'
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() => handleTimeChange('ampm', ampm, 'endedAt')}
                              >
                                {ampm}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                주문차수 이미지
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <ImageUpload field={field} no={no} />
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
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button type="submit">등록</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default OrderRoundForm;
