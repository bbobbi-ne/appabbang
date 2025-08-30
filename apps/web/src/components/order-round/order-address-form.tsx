import { FormControl, FormField, FormItem, FormLabel, FormMessage, Label } from '@appabbang/ui';
import { Input } from '@appabbang/ui';
import { formatMobile } from '@appabbang/utils';
import DaumPostApi from '@/components/common/daum-post-api';

/** 주문서 배송지 정보 입력 폼 */
export const OrderAddressForm = ({
  form,
  isMember,
  labelMinWidth,
}: {
  form: any;
  isMember: boolean;
  labelMinWidth: string;
}) => {
  return (
    <>
      {/* 받으실 분 */}
      <FormField
        control={form.control}
        name="recipientName"
        render={({ field }) => (
          <FormItem className="flex items-center">
            <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
              <span className="text-destructive">*</span> 받으실 분
            </FormLabel>

            <div className="w-full space-y-1">
              <FormControl>
                <Input
                  {...field}
                  placeholder="받으실분의 성함을 입력해주세요"
                  maxLength={10}
                  readOnly={isMember}
                />
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
              <span className="text-destructive">*</span> 연락처
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
                  readOnly={isMember}
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
          <span className="text-destructive">*</span> 배송지 주소
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
                    disabled={isMember}
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
              <span className="text-destructive">*</span> 배송메세지
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
    </>
  );
};
