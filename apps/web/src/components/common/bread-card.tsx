import {
  Card,
  CardHeader,
  CardContent,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogTitle,
  cn,
} from '@appabbang/ui';
import type { BreadCardProps } from '@/interface/bread-interface';
import Slider from 'react-slick';
import { X } from 'lucide-react';

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
    <>
      <AlertDialogTrigger asChild>
        <Card
          className={cn('mt-4 mb-4', 'min-w-[180px] max-w-[220px]', hoverCard)}
          onClick={() => onClick(bread)}
        >
          <CardHeader className="p-4">{bread.name}</CardHeader>
          <CardContent className="-ml-2">가격 : {bread.unitPrice.toLocaleString()}원</CardContent>

          <div className="mt-5">
            {bread.images[0] ? (
              <img
                className="rounded-2xl m-4 w-40 h-40"
                src={bread.images[0].url}
                alt={bread.name}
              />
            ) : (
              <img
                className="rounded-2xl m-4 w-40 h-40"
                src="/images/no-image.png"
                alt={bread.name}
              />
            )}
          </div>
        </Card>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-3xl overflow-y-auto max-h-[90vh] p-6">
        <AlertDialogTitle className="m-5 flex justify-center">{bread.name}</AlertDialogTitle>

        <AlertDialogCancel className="absolute top-1 right-1 cursor-pointer w-10">
          <X />
        </AlertDialogCancel>

        {/* 이미지 슬라이더 */}
        {bread.images?.length > 0 && (
          <div className="w-full max-w-[500px] mx-auto mb-4">
            {bread.images.length > 1 ? (
              <Slider
                {...{
                  dots: true,
                  infinite: true,
                  speed: 500,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }}
                className="mr-10"
              >
                {bread.images.map((image, i) => (
                  <div key={i} className="flex justify-start items-center w-full">
                    <img
                      src={image.url}
                      alt={`빵 이미지 ${i + 1}`}
                      className="object-contain rounded-2xl"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="w-full flex justify-center items-center">
                <img
                  src={bread.images[0].url}
                  alt="단일 이미지"
                  className="h-[300px] object-contain rounded"
                />
              </div>
            )}
          </div>
        )}

        <AlertDialogDescription className="mb-10">{bread.description}</AlertDialogDescription>

        <h3 className="font-bold">알레르기 유발 요인</h3>
        <AlertDialogDescription className="-mt-2 mb-2">{bread.allergyInfo}</AlertDialogDescription>

        <h3 className="font-bold">원산지 정보</h3>
        <AlertDialogDescription className="-mt-2 mb-2">
          {bread.countryOfOrigin}
        </AlertDialogDescription>
      </AlertDialogContent>
    </>
  );
}

export default BreadCard;
