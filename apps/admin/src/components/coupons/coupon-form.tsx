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
  Form,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@appabbang/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCurrencyKR } from '@/utils/format';

export const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '쿠폰명을 입력해주세요')
    .max(30, '최대 30자까지 입력할 수 있습니다.'),
  amount: z.string().trim().min(1, '쿠폰금액을 입력해주세요'),
  expireAfterDays: z.string().trim().min(1, '만료일을 입력해주세요'),
});
export type FormType = z.infer<typeof schema>;

interface Props {
  submitFn: (arg: any) => Promise<any>;
  currentValues?: FormType;
  no?: number;
  onSuccess: () => void;
  isRestricted?: boolean;
  deleteFn?: (no: number) => Promise<void>;
  deleteLoading?: boolean;
}

export default function BreadForm({
  submitFn,
  currentValues,
  no,
  onSuccess,
  isRestricted,
  deleteFn,
  deleteLoading,
}: Props) {
  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: currentValues
      ? currentValues
      : {
          name: '',
          amount: '',
          expireAfterDays: '',
        },
  });

  const onSubmit = async (data: FormType) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('amount', data.amount);
    formData.append('expireAfterDays', data.expireAfterDays);

    try {
      await submitFn(formData);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4 pr-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 쿠폰 이름
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input {...field} placeholder="쿠폰 이름을 입력해주세요" maxLength={30} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 쿠폰 금액
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input
                    {...field}
                    className="text-left"
                    inputMode="numeric"
                    placeholder="쿠폰 금액을 입력해주세요"
                    value={formatCurrencyKR(field.value)}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      if (Number(onlyDigits) > 50001) {
                        form.setError('amount', {
                          type: 'manual',
                          message: '쿠폰금액은 최대 50,000원까지만 입력할 수 있습니다.',
                        });
                        return;
                      }
                      if (Number(onlyDigits) % 100 !== 0) {
                        field.onChange(onlyDigits);
                        form.setError('amount', {
                          type: 'manual',
                          message: '쿠폰금액은 100원 단위로 입력해주세요.',
                        });
                        return;
                      } else {
                        form.clearErrors('amount');
                        field.onChange(onlyDigits);
                      }
                    }}
                    onFocus={(e) => {
                      const val = e.target.value;
                      setTimeout(() => {
                        e.target.setSelectionRange(val.length, val.length);
                      }, 0);
                    }}
                    disabled={isRestricted}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expireAfterDays"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap pr-2 py-3 flex-1/4">
                <strong className="text-red-500">*</strong> 만료일
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl className="relative">
                  <Input
                    {...field}
                    className="text-left"
                    inputMode="numeric"
                    placeholder="만료일을 입력해주세요 (발급일로부터 N일 후 만료)"
                    value={field.value}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      if (onlyDigits.length > 5) {
                        form.setError('expireAfterDays', {
                          type: 'manual',
                          message: '만료일은 최대 99999일까지만 입력할 수 있습니다.',
                        });
                      } else {
                        form.clearErrors('expireAfterDays');
                        field.onChange(onlyDigits);
                      }
                    }}
                    onFocus={(e) => {
                      const val = e.target.value;
                      setTimeout(() => {
                        e.target.setSelectionRange(val.length, val.length);
                      }, 0);
                    }}
                    disabled={isRestricted}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        {isRestricted && (
          <div>
            <p className="text-xs text-gray-500">
              * 이미 발급된 쿠폰은 금액이나 만료일을 수정할 수 없습니다.
            </p>
            <p className="text-xs text-gray-500">* 이미 발급된 쿠폰은 삭제할 수 없습니다.</p>
          </div>
        )}
        <DialogFooter>
          {form.formState.errors.root && (
            <p className="text-destructive text-sm self-center mx-auto">
              {form.formState.errors.root.message}
            </p>
          )}

          {no && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isRestricted}>
                    삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.preventDefault()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>쿠폰을 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deleteLoading}
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={async () => await deleteFn?.(no ?? 0)}
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          <div className="w-full" />

          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button type="submit">{no ? '수정' : '등록'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
