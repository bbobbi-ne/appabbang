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
  Label,
} from '@appabbang/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { OrdersDetailData } from '@/api/data-contracts';
import { useGetOrderStatusQuery } from '@/hooks/use-common-code';

export const orderScheme = z.object({
  trackingNumber: z.string(),
});
export type OrderDialogScheme = z.infer<typeof orderScheme>;

function OrderForm({ orderData }: { orderData: OrdersDetailData }) {
  const form = useForm<OrderDialogScheme>({
    defaultValues: {
      trackingNumber: orderData.trackingNumber,
    },
  });
  const { data: ordersStatus } = useGetOrderStatusQuery();

  const ordersStatusName = ordersStatus?.find(({ code }) => code === orderData.orderStatus)?.name;

  return (
    <Form {...form}>
      <div className="flex">
        <div className="flex-1/2">
          <Label className="font-bold text-xs">주문자</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData.ordererName}
          </p>
        </div>
        <div className="flex-1/2">
          <Label className="font-bold text-xs">주문자 전화번호</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData.ordererMobile}
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1/2">
          <Label className="font-bold text-xs">수령인</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData.recipientName}
          </p>
        </div>
        <div className="flex-1/2">
          <Label className="font-bold text-xs">수령인 전화번호</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData.recipientMobile}
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="flex-3/5">
          <Label className="font-bold text-xs">배송지 주소</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData.address}
          </p>
        </div>
        <div className="flex-2/5">
          <Label className="font-bold text-xs">배송지 상세주소</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData.addressDetail} ({orderData.zipcode})
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1/4">
          <Label className="font-bold text-xs">은행명</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData?.payment?.bankCodeName}
          </p>
        </div>
        <div className="flex-2/4">
          <Label className="font-bold text-xs">계좌번호</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData?.payment?.accountNumber}
          </p>
        </div>
        <div className="flex-1/4">
          <Label className="font-bold text-xs">예금주</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData?.payment?.accountHolderName}
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1/4">
          <Label className="font-bold text-xs">배송 방법</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData.deliveryMethodName}
          </p>
        </div>
        <div className="flex-3/4">
          <Label className="font-bold text-xs">배송 메시지</Label>
          <p className="bg-background py-2 text-sm ring-offset-background cursor-not-allowed opacity-50">
            {orderData.message}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
        <FormField
          control={form.control}
          name="trackingNumber"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="text-xs font-semibold" errorCheck={false}>
                  <strong className="text-red-500">*</strong> 송장번호
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="송장번호를 등록해주세요"
                    disabled={ordersStatusName !== '배송중'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
            <Button type="button" variant="outline">
              닫기
            </Button>
          </DialogClose>
          {ordersStatusName === '배송중' && <Button type="submit">저장</Button>}
        </DialogFooter>
      </form>
    </Form>
  );
}

export default OrderForm;
