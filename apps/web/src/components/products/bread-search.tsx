import { Button, Input } from '@appabbang/ui';

interface BreadSearchProp {
  keyword: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function BreadSearch({ keyword, onKeyDown, onChange, onClick }: BreadSearchProp) {
  return (
    <div className="w-full max-w-80 flex flex-row gap-2 ml-auto">
      <Input
        type="text"
        placeholder="빵이름을 입력해주세요."
        value={keyword}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="mt-5 mb-5"
      />
      <Button type="submit" className="mt-5 mb-5 hover:cursor-pointer" onClick={onClick}>
        검색
      </Button>
    </div>
  );
}

export default BreadSearch;
