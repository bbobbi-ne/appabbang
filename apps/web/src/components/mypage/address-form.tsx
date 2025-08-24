import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from '@appabbang/ui';
import DaumPostApi from '@/components/common/daum-post-api';
import type { AddressesListData } from '@/api/data-contracts';
import { toast } from 'sonner';
import { formatMobile } from '@appabbang/utils';
import { addressSchema, type addresssDailogForm } from '@/validate/address-form.schema';

const labelMinWidth = 'min-w-[120px]';

type Props = {
  currentValues?: AddressesListData[number] | undefined;
  onSubmit: (body: addresssDailogForm) => Promise<void>;
  isLoading: boolean;
  deleteAddress?: (no: number) => Promise<void>;
  deleteLoading?: boolean;
  isHidden?: boolean; // 주문배송지수정에는 기본배송지여부와 삭제버튼을 숨길 수 있도록 추가됨.
};

export default function AddressForm({
  currentValues,
  onSubmit,
  isLoading,
  deleteAddress,
  deleteLoading,
  isHidden,
}: Props) {
  // 폼 선언
  const form = useForm<addresssDailogForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: currentValues
      ? currentValues
      : {
          recipientName: '',
          recipientMobile: '',
          address: '',
          addressDetail: '',
          zipcode: '',
          message: '',
          isDefault: false,
        },
  });

  // 배송지 등록
  const handleSubmit = async (data: addresssDailogForm) => {
    if (currentValues?.isDefault && !data.isDefault) {
      toast.error('다른 배송지를 기본 배송지로 추가해주세요.');
      return;
    }

    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* 받으실 분 */}
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 받으실 분
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="받으실분의 성함을 입력해주세요" maxLength={10} />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 연락처 */}
        <FormField
          control={form.control}
          name="recipientMobile"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 연락처
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="받으실분의 연락처를 입력해주세요"
                    onChange={(e) => {
                      const formattedValue = formatMobile(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    maxLength={13}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 주소 */}
        <div className="flex items-center">
          <Label className={`${labelMinWidth} whitespace-nowrap`}>
            <span className="text-red-700">*</span> 배송지 주소
          </Label>

          {/* 우편번호 + 주소 검색 */}
          <div className="w-full flex flex-col gap-2">
            <div>
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem className="flex gap-2">
                    <FormControl>
                      <Input {...field} placeholder="우편 번호" disabled className="mb-0" />
                    </FormControl>

                    <DaumPostApi
                      setAddress={(data) => {
                        if (!data) return;
                        form.setValue('zipcode', data[0] ?? '');
                        form.setValue('address', data[1] ?? '');
                        // form.setValue('addressDetail', data[2] ?? '');
                      }}
                      variant="secondary"
                    />
                  </FormItem>
                )}
              />
            </div>

            {/* 주소 */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <div className="w-full space-y-1">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input {...field} placeholder="배송지 주소" disabled />
                      </FormControl>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* 상세 주소 */}
            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <div className="w-full space-y-1">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="배송지 상세 주소"
                          disabled={!form.watch('zipcode')}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* 배송 메세지 */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 배송메세지
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="배송메세지를 입력해주세요." />
                </FormControl>

                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 기본 배송지 여부  */}
        {!currentValues?.isDefault && !isHidden && (
          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mb-0"
                  />
                </FormControl>
                <FormLabel
                  errorCheck={false}
                  className={`${labelMinWidth} whitespace-nowrap cursor-pointer`}
                >
                  기본배송지 여부
                </FormLabel>
              </FormItem>
            )}
          />
        )}

        <div className="mt-8 flex gap-2">
          {currentValues && !currentValues?.isDefault && !isHidden && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.preventDefault()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>배송지를 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deleteLoading}
                      className="bg-destructive"
                      onClick={() => deleteAddress?.(currentValues?.no ?? 0)}
                    >
                      삭제
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            저장하기
          </Button>
        </div>
      </form>
    </Form>
  );
}
