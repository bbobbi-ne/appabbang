import useToast from '@/hooks/useToast';
import { getIdEmail, modifyPw, sendEmail } from '@/services/customer-apis';
import { useEmailCodeStore } from '@/store/session';
import { findPwSchema, pwModifyFormSchema } from '@/validate/find-pw-form-schema';
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
  PasswordInput,
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
  const { code, set: setEmailCode } = useEmailCodeStore();
  const { addToast } = useToast();
  const { reset: emailCodeReset } = useEmailCodeStore();

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
    setEmailCode('');
    form.reset();
    pwForm.reset();
  };

  /** 이메일 인증하기 버튼(뱃지) 클릭 */
  const authEmail = async () => {
    const id = form.getValues('id');
    const email = form.getValues('email');

    if (!id) {
      form.setError('id', { type: 'required', message: '아이디를 입력해주세요.' });
      return;
    }

    const idRegexp = /^[a-zA-Z0-9]{5,30}$/;
    if (!idRegexp.test(id)) {
      form.setError('id', { type: 'regex', message: '유효한 아이디 형식이 아닙니다.' });
      return;
    }

    if (!email) {
      form.setError('email', { type: 'required', message: '이메일을 입력해주세요.' });
      return;
    }

    const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g;
    if (!regexp.test(email)) {
      form.setError('email', { type: 'regex', message: '유효한 이메일 형식이 아닙니다.' });
      return;
    }

    // 아이디와 이메일 확인
    const response = await getIdEmail(id, email);
    if (!response.id || !response.email) {
      addToast({ type: 'error', message: '존재하지 않는 정보입니다.' });
      return;
    }

    form.setError('id', { type: 'required', message: '' });
    form.setError('email', { type: 'required', message: '' });
    setShowCode(true);

    // 이메일 전달
    await sendEmail(form.getValues('email'), setEmailCode);
  };

  /** 인증번호 확인 */
  const onSubmit = () => {
    const inputCode = form.getValues('code');
    if (code === inputCode) {
      setSuccess(true);
    } else {
      addToast({ type: 'error', message: '인증번호가 일치하지 않습니다.' });
      setSuccess(false);
    }
  };

  /** 아이디, 이메일 정보의 비밀번호 변경 */
  const modifyPassword = async () => {
    const data = {
      id: form.getValues('id'),
      email: form.getValues('email'),
      pw: pwForm.getValues('pwModify'),
    };

    // 비밀번호 변경
    await modifyPw(data);
    emailCodeReset();
    setOpen(false);
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
                          disabled={success} // 인증 완료되고나면 수정불가
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
              <CardTitle className="text-lg">새로운 비밀번호를 입력하세요.</CardTitle>
              <CardDescription className="hidden" />
            </CardHeader>
            <CardContent>
              <Form {...pwForm}>
                <form
                  onSubmit={pwForm.handleSubmit(() => modifyPassword())}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={pwForm.control}
                    name="pwModify"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel
                          htmlFor="pwModify"
                          errorCheck={false}
                          className={`min-w-[120px] whitespace-nowrap`}
                        >
                          <span className="text-red-700">*</span> 새 비밀번호
                        </FormLabel>

                        <div className="w-full space-y-1">
                          <FormControl>
                            <PasswordInput
                              id="pwModify"
                              placeholder="새 비밀번호 입력"
                              {...field}
                              onChange={(e) => field.onChange(e)}
                              maxLength={30}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={pwForm.control}
                    name="pwConfirm"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel
                          htmlFor="pwConfirm"
                          errorCheck={false}
                          className={`min-w-[120px] whitespace-nowrap`}
                        >
                          <span className="text-red-700">*</span> 비밀번호 확인
                        </FormLabel>

                        <div className="w-full space-y-1">
                          <FormControl>
                            <PasswordInput
                              id="pwConfirm"
                              placeholder="비밀번호 확인 입력"
                              {...field}
                              onChange={(e) => field.onChange(e)}
                              maxLength={30}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    비밀변호 변경
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default FindPwDialog;
