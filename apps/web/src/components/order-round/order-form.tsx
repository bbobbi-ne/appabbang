import {
  Form,
  FormLabel,
  FormMessage,
  FormItem,
  FormControl,
  Input,
  FormField,
  Label,
  Button,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Badge,
  toast,
  PasswordInput,
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Checkbox,
} from '@appabbang/ui';
import { formatMobile } from '@appabbang/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import DaumPostApi from '../common/daum-post-api';
import {
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressListQuery,
  useUpdateAddressMutation,
} from '@/hooks/use-my';
import { useEffect, useState } from 'react';
import { useGetCommonCodesQuery } from '@/hooks/use-common-code';
import AddressForm from '@/components/mypage/address-form';
import { orderFormSchema, type OrderFormSchema } from '@/validate/order-form-schema';

// TODO: 점검 및 정리 필요 (약관들)
import ServiceIsAgreedDialog from '../join/service-terms-agreed-dialog';
import PrivacyTermsAgreedDialog from '../join/privacy-terms-agreed-dialog';
import PaymentRefundTermsAgreedDialog from '../join/privacy-terms-agreed-dialog';

type Props = {
  isDelivery: boolean;
  myContact: any;
  buttonArea: (props: { form: any }) => React.ReactNode;
};

const labelMinWidth = 'min-w-[120px]';

export const OrderForm = ({ isDelivery, myContact, buttonArea }: Props) => {
  /** 은행 목록 API */
  const { data: bankData } = useGetCommonCodesQuery('bank_code');

  // 폼 선언
  const form = useForm<OrderFormSchema>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      ordererName: '',
      ordererMobile: '',
      recipientName: '',
      recipientMobile: '',
      address: '',
      addressDetail: '',
      zipcode: '',
      message: '',
      bankCode: '',
      accountNumber: '',
      accountHolderName: '',
      orderPw: '',
      isServiceTermsAgreed: false,
      isPrivacyTermsAgreed: false,
      isPaymentRefundTermsAgreed: false,
      isDelivery: isDelivery,
      isMember: !!myContact,
    },
  });

  const handleSelectAddress = (item: any) => {
    form.setValue('recipientName', item.recipientName);
    form.setValue('recipientMobile', item.recipientMobile);
    form.setValue('address', item.address);
    form.setValue('addressDetail', item.addressDetail);
    form.setValue('zipcode', item.zipcode);
    form.setValue('message', item.message);

    form.clearErrors('recipientName');
    form.clearErrors('recipientMobile');
    form.clearErrors('address');
    form.clearErrors('addressDetail');
    form.clearErrors('zipcode');
    form.clearErrors('message');
  };
  // // 주문 생성
  // const createOrder = async (data: any) => {
  //   await onSubmit(data);
  // };

  useEffect(() => {
    if (!isDelivery) {
      form.setValue('isDelivery', false);
      // 배송정보 초기화
      form.setValue('recipientName', '');
      form.setValue('recipientMobile', '');
      form.setValue('address', '');
      form.setValue('addressDetail', '');
      form.setValue('zipcode', '');
      form.setValue('message', '');
    } else {
      form.setValue('isDelivery', true);
    }
  }, [isDelivery]);

  useEffect(() => {
    if (myContact) {
      form.setValue('isMember', true);
      form.setValue('ordererName', myContact.name);
      form.setValue('ordererMobile', myContact.mobileNumber);
    } else {
      form.setValue('isMember', false);
      form.setValue('ordererName', '');
      form.setValue('ordererMobile', '');
    }
  }, [myContact]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        {/* 주문자 이름 */}
        <FormField
          control={form.control}
          name="ordererName"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-destructive">*</span> 주문자 이름
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="주문자 이름을 입력해주세요"
                    maxLength={10}
                    readOnly={!!myContact}
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
          name="ordererMobile"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-destructive">*</span> 주문자 연락처
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="주문자 연락처를 입력해주세요"
                    onChange={(e) => {
                      const formattedValue = formatMobile(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    maxLength={13}
                    readOnly={!!myContact}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <div className="pt-2" />

        {myContact && isDelivery && (
          <div>
            <MyAddressListDialog handleSelectAddress={handleSelectAddress}>
              <Button className="flex ml-auto">나의 배송지 목록 불러오기</Button>
            </MyAddressListDialog>
            <p className="text-sm">
              <u>나의 배송지 정보를 불러와주세요</u>
            </p>
          </div>
        )}

        {!myContact && isDelivery && (
          <p className="text-sm">
            <u>배송지 정보를 입력해주세요.</u>
          </p>
        )}

        {isDelivery && <OrderAddressForm form={form} isMember={!!myContact} />}

        <div className="pt-2" />

        <p className="text-sm">
          <u>환불 받으실 계좌 정보를 입력해주세요.</u>
          <br />
          <span className="text-xs text-muted-foreground">
            (입금 계좌와 동일한 계좌로 환불 받으실 수 있습니다.)
          </span>
        </p>

        {/* 은행 정보 */}
        <FormField
          control={form.control}
          name="bankCode"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel
                htmlFor="bankCode"
                errorCheck={false}
                className={`${labelMinWidth} whitespace-nowrap`}
              >
                <span className="text-destructive">*</span> 은행
              </FormLabel>

              <div className="w-full space-y-1">
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="bankCode" className="w-full">
                      <SelectValue placeholder="은행을 선택해주세요." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>은행</SelectLabel>
                        {bankData?.map((bank: any, idx: number) => {
                          return (
                            <SelectItem
                              key={`bank-${bank.code}-${idx}`}
                              // {...field}
                              // {...form.register('bankCode')}
                              value={bank.code}
                            >
                              {bank.name}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 계좌번호  */}
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-destructive">*</span> 계좌번호
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="계좌번호를 입력해주세요" />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {/* 예금주  */}
        <FormField
          control={form.control}
          name="accountHolderName"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                <span className="text-destructive">*</span> 예금주
              </FormLabel>
              <div className="w-full space-y-1">
                <FormControl>
                  <Input {...field} placeholder="예금주를 입력해주세요" />
                </FormControl>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        {!myContact && (
          <>
            <div className="pt-2" />
            <p className="text-sm">
              <u>주문서 비밀번호를 입력해주세요.</u>
            </p>

            <FormField
              control={form.control}
              name="orderPw"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`${labelMinWidth} whitespace-nowrap`}>
                    <span className="text-destructive">*</span> 주문서 비밀번호
                  </FormLabel>
                  <div className="w-full space-y-1">
                    <FormControl>
                      <PasswordInput {...field} placeholder="주문서 비밀번호를 입력해주세요" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />
          </>
        )}
        <div className="pt-2" />

        <p className="text-sm">
          <u>약관 동의</u>
        </p>

        {/* 비회원 약관 동의  */}
        {!myContact && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 h-8">
              <Checkbox
                id="allAgreed"
                checked={
                  form.watch('isServiceTermsAgreed') &&
                  form.watch('isPrivacyTermsAgreed') &&
                  form.watch('isPaymentRefundTermsAgreed')
                }
                onCheckedChange={(checked: boolean) => {
                  form.setValue('isServiceTermsAgreed', checked);
                  form.setValue('isPrivacyTermsAgreed', checked);
                  form.setValue('isPaymentRefundTermsAgreed', checked);
                }}
              />
              <Label
                htmlFor="allAgreed"
                className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
              >
                아래 이용약관을 전체 동의합니다.
              </Label>
            </div>

            {/* 서비스 이용약관 동의여부 */}
            <FormField
              control={form.control}
              name="isServiceTermsAgreed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>

                      <FormLabel
                        errorCheck={false}
                        className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                      >
                        [필수] 아빠빵 서비스 이용약관 처리방침에 동의합니다.
                      </FormLabel>
                    </div>

                    <div className="flex-shrink-0">
                      <ServiceIsAgreedDialog>
                        <Button type="button" variant="link" className="text-xs p-0">
                          약관보기
                        </Button>
                      </ServiceIsAgreedDialog>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* 개인정보 수집, 이용 동의여부 */}
            <FormField
              control={form.control}
              name="isPrivacyTermsAgreed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>

                      <FormLabel
                        errorCheck={false}
                        className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                      >
                        [필수] 아빠빵 개인정보 수집 및 이용 처리방침에 동의합니다.
                      </FormLabel>
                    </div>

                    <PrivacyTermsAgreedDialog>
                      <Button type="button" variant="link" className="text-xs p-0">
                        약관보기
                      </Button>
                    </PrivacyTermsAgreedDialog>
                  </div>
                </FormItem>
              )}
            />

            {/* 결제 환불 약관 동의여부 */}
            <FormField
              control={form.control}
              name="isPaymentRefundTermsAgreed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>

                      <FormLabel
                        errorCheck={false}
                        className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                      >
                        [필수] 아빠빵 결제 환불 처리방침에 동의합니다.
                      </FormLabel>
                    </div>

                    <div className="flex-shrink-0">
                      <PaymentRefundTermsAgreedDialog>
                        <Button type="button" variant="link" className="text-xs p-0">
                          약관보기
                        </Button>
                      </PaymentRefundTermsAgreedDialog>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        {/* 회원 약관 동의  */}
        {myContact && (
          <div>
            {/* 결제 환불 약관 동의여부 */}
            <FormField
              control={form.control}
              name="isPaymentRefundTermsAgreed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: boolean) => {
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>

                      <FormLabel
                        errorCheck={false}
                        className={`${labelMinWidth} whitespace-nowrap cursor-pointer text-xs`}
                      >
                        [필수] 아빠빵 결제 환불 처리방침에 동의합니다.
                      </FormLabel>
                    </div>

                    <div className="flex-shrink-0">
                      <ServiceIsAgreedDialog>
                        <Button type="button" variant="link" className="text-xs p-0">
                          약관보기
                        </Button>
                      </ServiceIsAgreedDialog>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="pt-4" />

        {buttonArea({ form })}
      </form>
    </Form>
  );
};

const OrderAddressForm = ({ form, isMember }: { form: any; isMember: boolean }) => {
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

const MyAddressListDialog = ({
  children,
  handleSelectAddress,
}: {
  children: React.ReactNode;
  handleSelectAddress: (item: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: addressList } = useGetAddressListQuery();

  const selectAddress = (item: any) => {
    handleSelectAddress(item);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="overflow-y-auto max-h-11/12"
        >
          <DialogHeader>
            <DialogTitle className="text-left">나의 배송지</DialogTitle>
          </DialogHeader>
          <DialogDescription className="hidden" />

          <MyAddressList addressList={addressList} selectAddress={selectAddress} />
        </DialogContent>
      </Dialog>
    </>
  );
};

const MyAddressList = ({
  addressList,
  selectAddress,
}: {
  addressList: any;
  selectAddress: (item: any) => void;
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentValues, setCurrentValues] = useState<any>(null);
  const createAddressMutation = useCreateAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  const openEdit = (item?: any) => {
    setCurrentValues(item);
    setIsClicked(true);
  };

  const closeEdit = () => {
    setIsClicked(false);
    setCurrentValues(null);
  };

  const createAddress = async (data: any) => {
    try {
      await createAddressMutation.mutateAsync(data);
      toast.success('배송지 등록 완료');
      closeEdit();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateAddress = async (data: any) => {
    try {
      await updateAddressMutation.mutateAsync({ no: currentValues.no, data });
      toast.success('배송지 수정 완료');
      closeEdit();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteAddress = async (no: number) => {
    try {
      await deleteAddressMutation.mutateAsync(no);
      toast.success('배송지 삭제 완료');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      {!isClicked && !currentValues && (
        <Button size="sm" className="mb-2" onClick={() => openEdit()}>
          배송지 추가하기
        </Button>
      )}
      {isClicked ? (
        <div>
          <AddressForm
            onSubmit={!currentValues ? createAddress : updateAddress}
            isLoading={
              !currentValues ? createAddressMutation.isPending : updateAddressMutation.isPending
            }
            currentValues={currentValues}
            onCancel={closeEdit}
            {...(currentValues && {
              deleteAddress,
              deleteLoading: deleteAddressMutation.isPending,
            })}
          />
        </div>
      ) : (
        addressList?.map((item: any) => (
          <div
            key={`address-${item.no}`}
            className="border-b p-2 cursor-pointer flex flex-col gap-2 hover:bg-muted"
            onClick={() => {
              selectAddress(item);
            }}
          >
            <div className="flex items-center gap-4">
              <p className="font-bold">{item.recipientName}</p>

              {item.isDefault && <Badge variant="secondary">기본배송지</Badge>}
            </div>
            <p>
              {item.address},&nbsp;{item.addressDetail}({item.zipcode})
            </p>
            <p className="text-sm">{formatMobile(item.recipientMobile ?? '')}</p>

            <p className="text-sm text-muted-foreground">배송메세지: {item.message}</p>
            <Button variant="outline" size="sm" onClick={() => openEdit(item)} className="w-fit">
              수정하기
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
