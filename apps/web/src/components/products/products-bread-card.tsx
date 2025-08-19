import { Card, cn } from '@appabbang/ui';
import type { BreadCardProps } from '@/interface/bread-interface';
import clsx from 'clsx';

/** Main Function :: 빵 카드 클릭 시 onClick 콜백 prop 받음 */
export default function ProductsBreadCard({ bread }: BreadCardProps) {
  return (
    <Card
      className={clsx(
        'cursor-pointer w-full h-full hover:border-primary lg:hover:border-2 transition-all duration-100',
      )}
    >
      <img
        className={cn('object-cover aspect-square', bread?.images[0]?.url ?? 'p-4 object-contain')}
        src={bread?.images[0]?.url ?? '/images/no-image.png'}
        alt={bread?.name ?? '빵 이미지'}
      />
      <p className="p-4 text-base lg:text-lg text-left break-keep">{bread?.name}</p>
    </Card>
  );
}
