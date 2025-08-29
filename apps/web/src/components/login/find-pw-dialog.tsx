import {
  useCompareEmailCodeMutation,
  useGetIdEmailMutation,
  useSendEmailMutation,
} from '@/hooks/use-customer';
import useToast from '@/hooks/useToast';
import { findPwSchema, findPwValidEmail, pwModifyFormSchema } from '@/validate/find-pw-form-schema';
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

type Props = {
  children: React.ReactNode;
};

function FindPwDialog({ children }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const { addToast } = useToast();
  const [hashedCode, setHashedCode] = useState<string>();

  const sendEmail = useSendEmailMutation();
  const getIdEmail = useGetIdEmailMutation();
  const compareEmailCode = useCompareEmailCodeMutation();

  const form = useForm({
    resolver: zodResolver(findPwSchema),
    defaultValues: {
      id: '',
      email: '',
      code: '',
    },
  });

  const pwForm = useForm({
    resolver: zodResolver(pwModifyFormSchema),
    defaultValues: {
      pwModify: '',
      pwConfirm: '',
    },
  });

  // 모든 상태값과 form을 초기화
  const resetAllStates = () => {
    setShowCode(false);
    setSuccess(false);
    setHashedCode('');
    form.reset();
    pwForm.reset();
  };

  /** 이메일 인증하기 버튼(뱃지) 클릭 */
  const authEmail = async () => {
    if (sendEmail.isPending) return; // 이미 실행중이면 리턴

    const id = form.getValues('id');
    const email = form.getValues('email');

    try {
      const validFlag = findPwValidEmail(id, email, form); // 아이디, 이메일 유효성 검증
      if (!validFlag) return;

      // 아이디와 이메일 확인
      const response = await getIdEmail.mutateAsync({ id, email });
      if (!response) {
        addToast({ type: 'error', message: '존재하지 않는 정보입니다.' });
        return;
      }

      // 이메일로 인증코드 전달
      const result = await sendEmail.mutateAsync({ email });
      setHashedCode(result.code);
      form.clearErrors('id');
      form.clearErrors('email');
      setShowCode(true);
    } catch (e) {
      addToast({ type: 'error', message: '이메일 인증 과정에서 오류가 발생했습니다.' });
    }
  };

  /** 인증번호 확인 */
  const onSubmit = async () => {
    if (compareEmailCode.isPending) return; // 이미 실행중이면 리턴

    const code = form.getValues('code');
    if (code && hashedCode) {
      const id = form.getValues('id');
      const email = form.getValues('email');

      try {
        const result = await compareEmailCode.mutateAsync({ code, hashedCode, id, email });
        if (Number(result.code) === 200) {
          setSuccess(true);
          setHashedCode('');
        } else {
          addToast({ type: 'error', message: '인증번호가 일치하지 않습니다.' });
          setSuccess(false);
        }
      } catch (e) {
        addToast({ type: 'error', message: '이메일 인증번호 확인 과정에서 오류가 발생했습니다.' });
      }

      // compareMutation.mutateAsync({ inputCode, code, id, email });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        resetAllStates(); // dialog 열릴 때와 닫힐 때 모두 초기화
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
            <span className="text-[18px] font-bold">비밀번호 찾기</span>
          </DialogTitle>
          <DialogDescription className="-mt-2">
            회원가입 시 등록했던 아이디와 이메일을 인증해야 비밀번호 확인이 가능합니다.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel errorCheck={false} className={`min-w-[120px] whitespace-nowrap`}>
                    <span className="text-red-700">*</span> 아이디
                  </FormLabel>

                  <div className="w-full space-y-1">
                    <FormControl>
                      <div className="flex flex-row relative">
                        <Input
                          type="text"
                          {...field}
                          placeholder="아이디 입력"
                          maxLength={50}
                          disabled={showCode} // 인증 완료되고나면 수정불가
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </div>
                </FormItem>
              )}
            />

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
                          disabled={showCode} // 인증 완료되고나면 수정불가
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
              <CardTitle className="text-lg">임시 비밀번호를 전달합니다!</CardTitle>
              <CardDescription>
                고객님의 잃어버린 비밀번호는 임시 비밀번호를 대체되었습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              입력한 이메일({form.getValues('email')})로 임시 비밀번호를 전달합니다. 해당 임시
              비밀번호로 로그인을 시도하세요.
            </CardContent>
          </Card>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default FindPwDialog;
