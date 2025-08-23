import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
} from '@appabbang/ui';
import clsx from 'clsx';
import { Info } from 'lucide-react';
import { useState } from 'react';
import useToast from '@/hooks/useToast';
import { useNavigate } from '@tanstack/react-router';

type Props = {
  children: React.ReactNode;
  // data: AddressListData[number] | undefined;
};
function FaqUnregisterDialog({ children }: Props) {
  const [check, setCheck] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  /** 회원탈퇴 */
  const onUnregister = () => {
    if (!check)
      return addToast({
        type: 'error',
        message: '회원 탈퇴 유의사항을 동의해야 탈퇴가 가능합니다.',
      });

    addToast({
      type: 'success',
      message: '그 동안 아빠빵을 이용해주셔서 감사합니다. 🙇‍♀️ 메인페이지로 이동합니다.',
    });

    navigate({ to: '/' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="overflow-y-auto max-h-11/12"
      >
        <DialogHeader>
          <DialogTitle>언제나 반가운 김가나님,</DialogTitle>
          <DialogDescription>
            회원 탈퇴는 언제든 가능하지만, 한 번 더 고민해보시는건 어떠신가요?
          </DialogDescription>
        </DialogHeader>

        <h3 className="text-base font-semibold pt-2">아빠빵 서비스를 그만 받게 된다면 ... 😭</h3>

        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <p className="flex flex-row items-center gap-2">
              <Info className="text-destructive" />
              <span className="text-sm">보유하신 쿠폰이 함께 사라집니다.</span>
            </p>

            <p className="flex flex-row items-center gap-2">
              <Info className="text-destructive" />
              <span className="text-sm">
                해당 계정으로는 더 이상 서비스를 이용하실 수 없습니다.
              </span>
            </p>

            <p className="flex flex-row items-center gap-2">
              <Info className="text-destructive" />
              <span className="text-sm">현재 주문이 진행중인 고객님은 탈퇴가 어렵습니다.</span>
            </p>
          </CardContent>
        </Card>
        <CardDescription>
          <Label className="flex items-center justify-end cursor-pointer ">
            <Checkbox
              id="check"
              className="mr-2"
              checked={check}
              onChange={() => setCheck((prev) => !prev)}
            />
            <span onClick={() => setCheck((prev) => !prev)}>
              회원 탈퇴 유의사항을 확인하였으며, 이에 동의합니다.
            </span>
          </Label>
        </CardDescription>

        {/* 하단 버튼 */}
        <div className="pt-4 flex flex-row gap-5">
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className={clsx('w-full')}
            variant="outline"
          >
            뒤로가기
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
                onClick={(e) => {
                  if (!check) {
                    e.preventDefault();
                    addToast({
                      type: 'error',
                      message: '회원 탈퇴 유의사항을 동의해야 탈퇴가 가능합니다.',
                    });
                  }
                }}
              >
                회원탈퇴
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.preventDefault()}>
              <AlertDialogHeader>
                <AlertDialogTitle>회원탈퇴를 하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction onClick={onUnregister}>탈퇴</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FaqUnregisterDialog;
