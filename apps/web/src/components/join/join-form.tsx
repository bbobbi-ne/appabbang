import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
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
  ScrollArea,
} from '@appabbang/ui';
import DaumPostApi from '@/components/common/daum-post-api';
import { getFormattedMobile } from '@/utils';

export const joinSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, '받으실 분의 성함을 입력해주세요')
    .max(10, '최대 10자 이내로 입력해주세요'),
  pw: z.string().trim().min(1, '비밀번호를 입력해주세요'),
  pwchk: z.string().trim().min(1, '비밀번호를 입력해주세요'),
  mobileNumber: z
    .string()
    .trim()
    .min(1, '받으실 분의 연락처를 입력해주세요')
    .refine((val) => /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/.test(val), {
      message: '휴대폰번호 형식이 올바르지 않습니다.',
    }),
  address: z.string().trim().min(1, '주소를 입력해주세요'),
  addressDetail: z
    .string()
    .trim()
    .min(1, '주소를 입력해주세요')
    .max(30, '최대 30자 이내로 입력해주세요'),
  zipcode: z.string().trim().min(1, '주소를 입력해주세요'),
  message: z
    .string()
    .trim()
    .min(1, '배송메세지를 입력해주세요')
    .max(30, '최대 30자 이내로 입력해주세요'),
  isAgree: z.boolean(),
});
export type JoinSchemaType = z.infer<typeof joinSchema>;

const labelMinWidth = 'min-w-[120px]';

type Props = {
  onSubmit: (data: JoinSchemaType) => Promise<void>;
  isLoading: boolean;
};

export default function JoinForm({ onSubmit, isLoading }: Props) {
  // 폼 선언
  const form = useForm<JoinSchemaType>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      id: '',
      pw: '',
      pwchk: '',
      mobileNumber: '',
      address: '',
      addressDetail: '',
      zipcode: '',
      message: '',
      isAgree: false,
    },
  });

  const handleSubmit = async (data: JoinSchemaType) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* 받으실 분 */}
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 아이디
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="아이디를 입력해주세요" maxLength={10} />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 비밀번호 */}
        <FormField
          control={form.control}
          name="pw"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 비밀번호
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="비밀번호를 입력해주세요" maxLength={10} />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 비밀번호 확인 */}
        <FormField
          control={form.control}
          name="pwchk"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 비밀번호 확인
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="비밀번호를 재입력해주세요" maxLength={10} />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 연락처 */}
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-red-700">*</span> 연락처
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="연락처를 입력해주세요"
                    onChange={(e) => {
                      const formattedValue = getFormattedMobile(e.target.value);
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
            <span className="text-red-700">*</span> 주소
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
                        <Input {...field} placeholder="주소" disabled />
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
                          placeholder="상세 주소"
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

        {/* 동의 여부 */}
        <FormField
          control={form.control}
          name="isAgree"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mb-0"
                    />
                  </FormControl>

                  <FormLabel
                    errorCheck={false}
                    className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                  >
                    아빠빵 이용약관 및 개인정보 처리방침에 동의합니다.
                  </FormLabel>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-xs p-0" type="button">
                      약관 보기
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    onInteractOutside={(e) => {
                      e.preventDefault();
                    }}
                    className="overflow-y-auto max-h-11/12 p-0"
                  >
                    <ScrollArea className="h-[600px] p-8">
                      <DialogHeader>
                        <DialogTitle hidden>약관</DialogTitle>
                      </DialogHeader>
                      <DialogDescription hidden>약관</DialogDescription>
                      <JoinAgreeDialog />
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </FormItem>
          )}
        />

        <div className="mt-8 flex gap-2 pb-10">
          <Button type="submit" className="w-full" disabled={isLoading}>
            가입하기
          </Button>
        </div>
      </form>
    </Form>
  );
}

const JoinAgreeDialog = () => {
  return (
    <div>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
      <p>이곳은 약관입니다.</p>
    </div>
  );
};
