import { useGetBreadDetailQuery } from '@/hooks/use-breads';
import { formatCurrencyKR } from '@appabbang/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@appabbang/ui';

function BreadPreview({ no }: { no: number }) {
  const { data, isLoading } = useGetBreadDetailQuery(no);

  if (isLoading) return;

  return (
    <Card className="fixed right-0 translate-x-[100%] w-[300px] ">
      <CardHeader className="pb-0">
        <CardTitle className="text-center text-sm">{data!.name}</CardTitle>
        <CardDescription hidden>빵에대한 상세설명입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          alt={data?.name}
          className="h-full w-full max-h-44 rounded-lg object-fill "
          src={data?.images[0]?.url || '/images/no_image.png'}
        />
        <div className="space-y-1">
          <div className="flex text-xs">
            <p className="flex-2/5">가격 : </p>
            <p className="flex-4/5">{formatCurrencyKR(data!.unitPrice)}원</p>
          </div>
          <div className="flex text-xs">
            <p className="flex-2/5">알레르기 정보 : </p>
            <p className="flex-4/5">{data!.allergyInfo}</p>
          </div>
          <div className="flex text-xs">
            <p className="flex-2/5">원산지 정보 : </p>
            <p className="flex-4/5">{data!.countryOfOrigin}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BreadPreview;
