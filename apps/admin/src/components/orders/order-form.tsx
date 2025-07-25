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
} from '@appabbang/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AdressButton from '../ui/address-button';
import type { OrdersDetailData } from '@/api/data-contracts';
import { useOrderAndStatusAndDliveryTypeQuery } from '@/hooks/use-order';

export const orderScheme = z.object({
  customer_name: z.string().trim().min(1, '주문인의 이름을 입력해주세요'),
  recipient_name: z.string().trim().min(1, '수령인을 입력해주세요'),
  recipient_mobile: z.string().trim().min(1, '수령인 휴대폰번호를 입력해주세요'),
  delivery_no: z.string({
    required_error: '배송방법을 선택해주세요',
  }),
  address: z.string().trim().min(1, '배송지를 입력해주세요'),
  address_detail: z.string().trim().min(1, '상세주소를 입력해주세요'),
  message: z.string(),
  trackingNumber: z.string(),
});
export type OrderDialogScheme = z.infer<typeof orderScheme>;

function OrderForm({ orderData }: { orderData: OrdersDetailData }) {
  const form = useForm<OrderDialogScheme>({
    defaultValues: {
      address: orderData.address.address,
      address_detail: orderData.address.addressDetail,
      delivery_no: orderData.deliveryMethod.name,
      message: orderData.address.message,
      customer_name: orderData.customer.name,
      recipient_mobile: orderData.address.recipientMobile,
      recipient_name: orderData.address.recipientName,
      trackingNumber: orderData.trackingNumber,
    },
  });

  const setFullAddress = (value: string) => {
    form.setValue('address', value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
        <FormField
          control={form.control}
          name="customer_name"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                주문인
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input disabled placeholder="주문자의 이름을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="recipient_name"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                수령인
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input disabled placeholder="수령인 이름을 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipient_mobile"
          render={({ field }) => (
            <FormItem className="flex">
              <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                수령인 전화번호
              </FormLabel>
              <div className="flex-3/4 space-y-1">
                <FormControl>
                  <Input disabled placeholder="수령인 전화번호를 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="delivery_no"
          render={({ field }) => {
            return (
              <FormItem className="flex">
                <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                  배송방법
                </FormLabel>
                <div className="flex-3/4">
                  <FormControl>
                    <Input disabled placeholder="배송방법을 선택해주세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => {
            return (
              <FormItem className="flex">
                <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                  배송지 주소
                </FormLabel>
                <div className="flex-3/4">
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input placeholder="배송지 주소를 입력해주세요" {...field} />
                      <AdressButton setValue={setFullAddress} className="h-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="address_detail"
          render={({ field }) => {
            return (
              <FormItem className="flex">
                <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                  배송지 상세주소
                </FormLabel>
                <div className="flex-3/4">
                  <FormControl>
                    <Input placeholder="배송지 상세주소를 입력해주세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => {
            return (
              <FormItem className="flex">
                <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                  배송 메시지
                </FormLabel>
                <div className="flex-3/4">
                  <FormControl>
                    <Input placeholder="배송 메시지를 입력해주세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="trackingNumber"
          render={({ field }) => {
            return (
              <FormItem className="flex">
                <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                  송장번호
                </FormLabel>
                <div className="flex-3/4">
                  <FormControl>
                    <Input {...field} />
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
          <Button type="submit" className="flex-3/4">
            배송지 변경
          </Button>
          <DialogClose asChild>
            <Button className="flex-1/4" variant="outline">
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default OrderForm;
