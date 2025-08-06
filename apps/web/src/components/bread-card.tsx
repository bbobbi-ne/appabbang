import { Card, CardHeader, CardContent } from '@appabbang/ui';
import type { BreadCardProps } from '@/interface/bread-interface';
import clsx from 'clsx';

/**********************************************************************************/
/** CSS */
const hoverCard = `
  hover:text-[#eeeeee] hover:bg-[#393028] hover:cursor-pointer 
  transition-colors duration-300
`;
/**********************************************************************************/
/** Main Function :: 빵 카드 클릭 시 onClick 콜백 prop 받음 */
function BreadCard({ bread, onClick }: BreadCardProps) {
  return (
    <Card
      className={clsx('mt-4 mb-4', 'min-w-[180px] max-w-[220px]', hoverCard)}
      onClick={() => onClick(bread)}
    >
      <CardHeader className="p-4">{bread.name}</CardHeader>
      <CardContent className="-ml-2">가격 : {bread.unitPrice.toLocaleString()}원</CardContent>

      <div className="mt-5">
        {bread.images[0] ? (
          <img className="rounded-2xl m-4 w-40 h-40" src={bread.images[0].url} alt={bread.name} />
        ) : (
          <img
            className="rounded-2xl m-4 w-40 h-40"
            src="../../../public/images/no_image.jpg"
            alt={bread.name}
          />
        )}
      </div>
    </Card>
  );
}

export default BreadCard;
