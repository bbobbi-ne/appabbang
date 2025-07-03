import {
  Button,
  //   Button,
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
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@appabbang/ui';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const orderScheme = z.object({
  name: z.string().trim().min(1, '주문인의 이름을 입력해주세요'),
  recipient_name: z.string().trim().min(1, '수령인을 입력해주세요'),
  recipient_mobile: z.string().trim().min(1, '수령인 휴대폰번호를 입력해주세요'),
  delivery_no: z.string({
    required_error: '배송방법을 선택해주세요',
  }),
  address: z.string().trim().min(1, '배송지를 입력해주세요'),
  address_detail: z.string().trim().min(1, '상세주소를 입력해주세요'),
  message: z.string(),
});
export type OrderDialogScheme = z.infer<typeof orderScheme>;

export function OrderDialog({ children }: { children: ReactNode }) {
  const form = useForm<OrderDialogScheme>();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-xl overflow-y-auto max-h-full "
      >
        <DialogHeader>
          <DialogTitle className="flex">
            <h2 className="font-semibold">주문번호</h2>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex space-x-2 text-foreground">
          <p className="font-semibold">100020000ABCD</p>
          <p>[제조중]</p>
        </DialogDescription>
        <DialogTitle>주문정보</DialogTitle>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead>메뉴</TableHead>
              <TableHead>수량</TableHead>
              <TableHead>단가</TableHead>
              <TableHead>총금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="flex-col text-right">
          <p>
            금액 : <strong>87,400</strong>원
          </p>
          <p className="text-red-500">배송비 +3,000원</p>
          <p className="text-sky-500">할인금액 -6,500원</p>
          <p className="text-2xl font-bold">총 금액 : 83,900원</p>
        </div>

        <div className="w-full h-1 bg-muted rounded-r-lg" />

        <DialogTitle>고객정보</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-8 ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel errorCheck={false} className="whitespace-nowrap px-2 py-3 flex-1/4">
                    주문인
                  </FormLabel>
                  <div className="flex-3/4 space-y-1">
                    <FormControl>
                      <Input placeholder="주문자의 이름을 입력해주세요" {...field} />
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
                      <Input placeholder="수령인 이름을 입력해주세요" {...field} />
                      {/* <Textarea
                        placeholder="설명을 입력해주세요"
                        className="resize-none w-full break-all"
                        {...field}
                      /> */}
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
                      <Input placeholder="수령인 전화번호를 입력해주세요" {...field} />
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
                        <Input placeholder="배송방법을 선택해주세요" {...field} />
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
                          <Button variant="outline">주소검색</Button>
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
      </DialogContent>
    </Dialog>
  );
}
