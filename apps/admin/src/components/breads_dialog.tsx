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
} from '@appabbang/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const breadsDailogSchema = z.object({
  menu: z.string().trim().min(1, '메뉴명을 입력해주세요'),
  description: z.string().trim().min(1, '설명을 입력해주세요'),
  price: z.string().trim().min(1, '가격을 입력해주세요'),
  image: z.array(z.instanceof(File)).min(1, '최소 1장의 이미지를 업로드해주세요'),
  state: z.enum(['0', '1', '2', '3'], { required_error: '상태를 선택해주세요' }),
});
type BreadsDailogForm = z.infer<typeof breadsDailogSchema>;

export function BreadsDialog() {
  const form = useForm<BreadsDailogForm>({
    resolver: zodResolver(breadsDailogSchema),
    defaultValues: {
      menu: '',
      description: '',
      image: [],
      price: '',
      state: undefined,
    },
  });

  const onSubmit = (data: BreadsDailogForm) => {
    console.log(data);
  };

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
        <DialogHeader>
          <DialogTitle>메뉴등록</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              control={form.control}
              name="menu"
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
              name="price"
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
              name="state"
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
                        <FormItem className="space-x-1">
                          <FormControl>
                            <RadioGroupItem value="0" />
                          </FormControl>
                          <FormLabel>판매중</FormLabel>
                        </FormItem>
                        <FormItem className="space-x-1">
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel>미판매</FormLabel>
                        </FormItem>
                        <FormItem className="space-x-1">
                          <FormControl>
                            <RadioGroupItem value="2" />
                          </FormControl>
                          <FormLabel>대기</FormLabel>
                        </FormItem>
                        <FormItem className="space-x-1">
                          <FormControl>
                            <RadioGroupItem value="3" />
                          </FormControl>
                          <FormLabel>임시저장</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
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
