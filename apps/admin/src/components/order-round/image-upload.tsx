import { useOrderRoundImageDeleteMutation } from '@/hooks/use-order-round';
import { Input } from '@appabbang/ui';
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

  const removeImage = () => {
    if (value instanceof File) {
      inputRef.current?.click();
      return;
    }
    orderRoundImageDeleteMutation({ no: no!, publicId: value.publicId });
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
        <div onClick={removeImage} className="border rounded overflow-hidden cursor-pointer">
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            alt="preview"
            className="w-full h-40 rounded object-fill"
          />
        </div>
      )}
    </div>
  );
}
