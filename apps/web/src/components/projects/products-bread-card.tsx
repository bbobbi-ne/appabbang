import { Card, CardHeader, cn } from '@appabbang/ui';
import type { BreadCardProps } from '@/interface/bread-interface';

/** Main Function :: 빵 카드 클릭 시 onClick 콜백 prop 받음 */
function ProductsBreadCard({ bread, openBread, onClick }: BreadCardProps) {
  return (
    <Card
      className={cn('mt-4 mb-4 w-50 cursor-pointer', 'min-w-[200px] max-w-[300px]')}
      onClick={() => onClick(bread)}
    >
      <div>
        {openBread && openBread.length > 0 ? (
          <CardHeader className="ml-2 p-2 text-left">주문오픈🔥</CardHeader>
        ) : (
          <CardHeader className="ml-2 p-2 text-left mb-10"></CardHeader>
        )}
        {bread.images && bread.images[0] && bread.images.length > 0 ? (
          <img
            className="rounded-2xl m-4 w-40 h-40 object-contain"
            src={bread.images[0].url}
            alt={bread.name}
          />
        ) : (
          <img
            className="rounded-2xl m-4 w-40 h-40 object-contain"
            src="/images/no_image.jpg"
            alt={bread.name}
          />
        )}
        <CardHeader className="p-2 text-center">{bread.name}</CardHeader>
      </div>
    </Card>
  );
}

export default ProductsBreadCard;
