import { Button } from '@appabbang/ui';

/** TODO: 공통 컴포넌트로 분리 (최소단위 컴포넌트로 작성함.) */

type Props = {
  count: number;
  handleCountChange: (type: 'plus' | 'minus') => void;
};

/** 카운트 버튼 컴포넌트 (현재카운트정보와 카운트 변화함수 주입) */
export const CountButton = ({ count = 0, handleCountChange }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => handleCountChange('minus')}>
        -
      </Button>
      <p className="min-w-8 text-center">{count}</p>
      <Button variant="outline" size="sm" onClick={() => handleCountChange('plus')}>
        +
      </Button>
    </div>
  );
};
