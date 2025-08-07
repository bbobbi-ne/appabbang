import { Card, CardHeader } from '@appabbang/ui';
import type { BreadCardProps } from '@/interface/bread-interface';
import clsx from 'clsx';

/** Main Function :: 빵 카드 클릭 시 onClick 콜백 prop 받음 */
function ProductsBreadCard({ bread, onClick }: BreadCardProps) {
  return (
    <Card
      className={clsx('mt-4 mb-4 w-50 cursor-pointer', 'min-w-[200px] max-w-[300px]')}
      onClick={() => onClick(bread)}
    >
      <div>
        <CardHeader className="ml-2 p-2 text-left">{bread.name}</CardHeader>
        {bread.images[0] ? (
          <img className="rounded-2xl m-4 w-40 h-40" src={bread.images[0].url} alt={bread.name} />
        ) : (
          <img
            className="rounded-2xl m-4 w-40 h-40"
            src="../../../public/images/no_image.jpg"
            alt={bread.name}
          />
        )}
        <CardHeader className="p-2 text-center">{bread.name}</CardHeader>
      </div>
    </Card>
  );
}

export default ProductsBreadCard;
