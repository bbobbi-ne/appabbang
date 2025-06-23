import { Button, Input } from '@appabbang/ui';
import type { ControllerRenderProps } from 'react-hook-form';
import { useCallback, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { useDeleteBreadImgMutation } from '@/hooks/useBreads';

interface CloudinaryFile {
  name: string;
  order: number;
  publicId: string;
  url: string;
}

export function ImageUploadField({
  field,
  no,
}: {
  field: ControllerRenderProps<any, any>;
  no?: number;
}) {
  const { value = [], onChange } = field;
  const inputRef = useRef<HTMLInputElement>(null);
  const { deleteBreadImgMutation } = useDeleteBreadImgMutation();

  const handleInputClick = () => {
    inputRef.current?.click();
  };

  const handleFiles = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
      if (files.length > 0) {
        onChange([...value, ...files]);
      }
      // 같은 파일 다시 선택 가능하도록 초기화
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [value, onChange],
  );

  const removeImage = (file: File | CloudinaryFile, index: number) => {
    const isFile = typeof file === 'object' && file instanceof File;

    if (!isFile) {
      deleteBreadImgMutation({ no: no!, publicId: file.publicId });
    }

    const newImageArray = value.filter((file: File | CloudinaryFile, i: number) => i !== index);

    onChange(newImageArray);
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFiles}
        value={undefined}
        className="hidden"
        ref={inputRef}
      />
      {value.length === 0 ? (
        <div
          onClick={handleInputClick}
          className="flex items-center justify-center h-28 border-2 border-dashed rounded cursor-pointer text-muted-foreground hover:bg-muted/50 transition"
        >
          이미지 파일을 추가해주세요
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 p-2 border-2 border-dashed rounded">
          {value.map((file: File | CloudinaryFile, index: number) => {
            const preview =
              typeof file === 'object' && file instanceof File
                ? URL.createObjectURL(file)
                : file?.url;

            return (
              <div key={index} className="relative group border rounded overflow-hidden">
                <img src={preview} alt="preview" className="object-cover w-full h-28 rounded" />
                {index === 0 && (
                  <span className="absolute top-1 left-1 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                    대표
                  </span>
                )}
                <Button
                  type="button"
                  onClick={() => removeImage(file, index)}
                  size="icon"
                  className="absolute top-1 right-1 bg-black/60 text-white rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </Button>
              </div>
            );
          })}

          <Button
            type="button"
            onClick={handleInputClick}
            className="flex-col h-28 w-full text-sm  "
          >
            <Plus className="w-5 h-5 mb-1" />
            이미지 추가
          </Button>
        </div>
      )}
    </div>
  );
}
