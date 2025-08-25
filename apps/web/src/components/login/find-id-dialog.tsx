import useToast from '@/hooks/useToast';
import { compareCode, getEmail, getId, sendEmail } from '@/services/customer-apis';
import { useEmailCodeStore } from '@/store/session';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../common/loading';

type Props = {
  children: React.ReactNode;
};

function FindIdDialog({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { code, set: setEmailCode } = useEmailCodeStore();
  const [email, setEmail] = useState<string>('');
  const { addToast } = useToast();
  const { reset: emailCodeReset } = useEmailCodeStore();

  const { isLoading, data } = useQuery({
    queryKey: ['getId', email],
    queryFn: () => getId(email, emailCodeReset),
    enabled: success && !!email, // 조건부 실행
  });

  const form = useForm({
    resolver: zodResolver(findIdSchema),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  // 모든 상태값과 form을 초기화
  const resetAllStates = () => {
    setShowCode(false);
    setSuccess(false);
    setEmail('');
    setEmailCode('');
    form.reset();
  };

  /** 이메일 인증코드 전송 */
  const emailMutation = useMutation({
    mutationFn: (targetEmail: string) => sendEmail(targetEmail, setEmailCode),
    onSuccess: (status) => {
      if (status === 200) {
        form.setError('email', { type: 'required', message: '' });
        setShowCode(true);
      } else addToast({ type: 'error', message: '이메일 전송이 실패되었습니다.' });
    },
    onError: (error) => addToast({ type: 'error', message: error.message }),
  });

  /** 이메일 인증하기 버튼(뱃지) 클릭 */
  const authEmail = async () => {
    const email = form.getValues('email');

    const validFlag = findIdValidEmail(email, form); // 이메일만 유효성 검증
    if (!validFlag) return;

    // 이메일 확인
    const response = await getEmail(email);
    if (!response.email) {
      addToast({ type: 'error', message: '존재하지 않는 이메일입니다.' });
      return;
    }

    // 이메일로 인증코드 전달 (공백이 아닐 때만 전송)
    setEmail(email);
    email.trim() !== '' && emailMutation.mutateAsync(email);
  };

  /** 인증번호 확인 */
  const onSubmit = async () => {
    if (success) return;

    const inputCode = form.getValues('code');
    if (!inputCode)
      form.setError('code', { type: 'required', message: '인증번호를 입력 바랍니다.' });
    else {
      const data = await compareCode(inputCode, code);
      if (data.code === 200) {
        // 인증성공
        setSuccess(true);
        setEmail(form.getValues('email'));
      } else {
        // 인증실패
        addToast({ type: 'error', message: '인증번호가 일치하지 않습니다.' });
        setSuccess(false);
        setEmail('');
      }
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
              {data && typeof data === 'object' && 'id' in data ? (
                <p>
                  고객님의 아이디는 <strong>{String(data.id.id)}</strong>입니다.
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
