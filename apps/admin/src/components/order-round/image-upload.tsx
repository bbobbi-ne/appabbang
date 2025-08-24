import { useOrderRoundImageDeleteMutation } from '@/hooks/use-order-round';
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
  Input,
} from '@appabbang/ui';
import { X } from 'lucide-react';
import { useRef } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';

export function ImageUpload({
  field,
  no,
}: {
  field: ControllerRenderProps<any, any>;
  no?: number;
}) {
  const { value, onChange } = field;
  const inputRef = useRef<HTMLInputElement>(null);
  const { orderRoundImageDeleteMutation } = useOrderRoundImageDeleteMutation();
  const handleInputClick = () => {
    inputRef.current?.click();
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onChange(file);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onChangeImage = async () => {
    inputRef.current?.click();
  };

  const removeImage = async (e: any) => {
    e.stopPropagation();
    if (value instanceof File) {
      onChange(null);
      return;
    }

    await orderRoundImageDeleteMutation({ no: no!, publicId: value.publicId });
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFiles}
        value={undefined}
        className="hidden"
        ref={inputRef}
      />
      {!value ? (
        <div
          onClick={handleInputClick}
          className="flex items-center justify-center h-40 border-2 border-dashed rounded cursor-pointer text-muted-foreground hover:bg-muted/50 transition"
        >
          이미지 파일을 추가해주세요
        </div>
      ) : (
        <div
          onClick={onChangeImage}
          className="relative border rounded group overflow-hidden cursor-pointer"
        >
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value.url}
            alt="preview"
            className="w-full h-40 rounded object-fill"
          />
          {value instanceof File ? (
            <Button
              onClick={removeImage}
              type="button"
              size="icon"
              className="absolute z-5 top-1 right-1 bg-black/60 text-white rounded opacity-0 group-hover:opacity-100 transition"
            >
              <X size={16} />
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  type="button"
                  size="icon"
                  className="absolute top-1 right-1 bg-black/60 text-white rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>저장된 이미지를 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>삭제시 복구가 어렵습니다.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={removeImage}>확인</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
}
