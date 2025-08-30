import { Card, cn, Badge } from '@appabbang/ui';
import type { WithOrderRoundListData } from '@/api/data-contracts';

/** Main Function :: 빵 카드 클릭 시 onClick 콜백 prop 받음 */
export default function ProductsBreadCard({ bread }: { bread: WithOrderRoundListData[0] }) {
  return (
    <Card
      className={cn(
        'cursor-pointer w-full h-full hover:border-primary lg:hover:border-2 transition-all duration-100',
      )}
    >
      <img
        className={cn(
          'object-cover aspect-square',
          bread?.images?.[0]?.url ?? 'p-4 object-contain',
        )}
        src={bread?.images?.[0]?.url ?? '/images/no-image.png'}
        alt={bread?.name ?? '빵 이미지'}
      />
      <div className="flex flex-col items-center gap-2 p-4">
        {bread.isCurrentOrderRound && <Badge variant="secondary">OEPN !</Badge>}
        <p className="text-base lg:text-lg text-left break-keep">{bread?.name}</p>
      </div>
    </Card>
  );
}
