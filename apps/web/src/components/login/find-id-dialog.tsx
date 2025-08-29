import useToast from '@/hooks/useToast';
import { findIdSchema, findIdValidEmail } from '@/validate/find-id-form-schema';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
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
} from '@appabbang/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Loading from '../common/loading';
import { CustomerService } from '@/services/api/customer-service';
import {
  useCompareEmailCodeMutation,
  useGetEmailMutation,
  useSendEmailMutation,
} from '@/hooks/use-customer';

type Props = {
  children: React.ReactNode;
};

function FindIdDialog({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const { addToast } = useToast();
  const { getId } = CustomerService;
  const [hashedCode, setHashedCode] = useState<string>();

  const { isLoading, data } = useQuery({
    queryKey: ['getId', email],
    queryFn: () => getId({ email }),
    enabled: success && !!email, // 조건부 실행
    select: (res) => res.id,
  });

  useEffect(() => {
    // 아이디 값이 있으면 임시보관한 이메일 인증코드 리셋
    data && setHashedCode('');
  }, [isLoading, data]);

  const form = useForm({
    resolver: zodResolver(findIdSchema),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const getEmail = useGetEmailMutation();
  const sendEmail = useSendEmailMutation();
  const compareEmailCode = useCompareEmailCodeMutation();

  /*************************************************************************/

  // 모든 상태값과 form을 초기화
  const resetAllStates = () => {
    setShowCode(false);
    setSuccess(false);
    setEmail('');
    setHashedCode('');
    form.reset();
  };

  /** 이메일 인증하기 버튼(뱃지) 클릭 */
  const authEmail = async () => {
    const email = form.getValues('email');

    const validFlag = findIdValidEmail(email, form); // 이메일만 유효성 검증
    if (!validFlag) return;

    try {
      const response = await getEmail.mutateAsync({ email });
      if (!response.email) {
        addToast({ type: 'error', message: '존재하지 않는 이메일입니다.' });
        return;
      }

      // 이메일로 인증코드 전달 (공백이 아닐 때만 전송)
      setEmail(email);
      const result = await sendEmail.mutateAsync({ email });
      form.clearErrors('email');
      setShowCode(true);
      setHashedCode(result.code);
    } catch (e) {
      addToast({ type: 'error', message: '이메일 인증하는 과정에서 오류가 발생했습니다.' });
    }
  };

  /** 인증번호 확인 */
  const onSubmit = async () => {
    if (success) return;

    const code = form.getValues('code');
    if (!code) {
      form.setError('code', { type: 'required', message: '인증번호를 입력 바랍니다.' });
      return;
    }

    const result = hashedCode && (await compareEmailCode.mutateAsync({ code, hashedCode }));
    if (result && Number(result.code) === 200) {
      setSuccess(true);
      setEmail(form.getValues('email'));
    } else {
      addToast({ type: 'error', message: '인증번호가 일치하지 않습니다.' });
      setSuccess(false);
      setEmail('');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        !newOpen && resetAllStates(); // dialog가 닫힐 때만 초기화
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12 flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="leading-8">
            <span className="text-[18px] font-bold">아이디 찾기</span>
          </DialogTitle>
          <DialogDescription className="-mt-2">
            회원가입 시 등록했던 이메일을 인증해야 아이디 확인이 가능합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`min-w-[120px] whitespace-nowrap`}>
                    <span className="text-red-700">*</span> 이메일
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <div className="flex flex-row relative">
                        <Input
                          type="email"
                          {...field}
                          placeholder="이메일 입력"
                          maxLength={50}
                          disabled={success} // 인증 완료되고나면 수정불가
                        />
                        <Badge
                          variant="secondary"
                          onClick={authEmail}
                          className={cn(
                            'cursor-pointer absolute right-2 top-1/2 -translate-y-1/2',
                            showCode
                              ? 'bg-gray-300 text-white dark:bg-gray-300'
                              : 'bg-green-700 text-white dark:bg-green-700',
                          )}
                        >
                          인증
                        </Badge>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

            {showCode ? (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel
                      htmlFor="code"
                      errorCheck={false}
                      className={`min-w-[120px] whitespace-nowrap`}
                    >
                      <span className="text-red-700">*</span> 인증번호
                    </FormLabel>

                    <div className="w-full space-y-1">
                      <FormControl>
                        <div className="flex flex-row relative">
                          <Input
                            type="text"
                            id="code"
                            disabled={success}
                            {...field}
                            placeholder="인증번호 입력"
                            maxLength={50}
                            onChange={(e) => field.onChange(e)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />
            ) : null}

            <Button type="button" disabled={success} onClick={onSubmit} className="w-full">
              인증번호 확인
            </Button>
          </form>
        </Form>

        {success ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">아이디를 찾았습니다!</CardTitle>
              <CardDescription>
                고객님의 잃어버린 아이디를 찾았습니다. 해당 아이디로 로그인을 시도하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {typeof data === 'string' && data ? (
                <p>
                  고객님의 아이디는 <strong>{data}</strong>입니다.
                </p>
              ) : (
                <p>아이디를 불러오는 중입니다...</p>
              )}
            </CardContent>
          </Card>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default FindIdDialog;
