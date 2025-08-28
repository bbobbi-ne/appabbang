import { useGetBreadQuery } from '@/hooks/use-breads';
import type { BreadsListItem } from '@/services/api/breads-service';
import {
  Card,
  CardHeader,
  CardContent,
  cn,
  CarouselDots,
  CarouselNext,
  CarouselPrevious,
  CarouselItem,
  CarouselContent,
  Carousel,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@appabbang/ui';
import { X } from 'lucide-react';
import { useState } from 'react';

/**********************************************************************************/
/** CSS */
const hoverCard = `
  hover:text-[#eeeeee] hover:bg-[#393028] hover:cursor-pointer 
  transition-colors duration-300
`;
/**********************************************************************************/
/** Main Function :: 빵 카드 클릭 시 onClick 콜백 prop 받음 */
function BreadCard({ bread }: { bread: BreadsListItem }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(vale) => {
          setOpen(vale);
        }}
      >
        <DialogTrigger asChild>
          <Card className={cn('mt-4 mb-4', 'min-w-[180px] max-w-[220px]', hoverCard)}>
            <CardHeader className="p-4">{bread.name}</CardHeader>
            <CardContent className="-ml-2">가격 : {bread.unitPrice.toLocaleString()}원</CardContent>

            <div className="mt-5">
              {bread.images ? (
                <img
                  className="rounded-2xl m-4 w-40 h-40"
                  src={bread.images.url}
                  alt={bread.name}
                />
              ) : (
                <img
                  className="rounded-2xl m-4 w-40 h-40"
                  src="../../../public/images/no_image.jpg"
                  alt={bread.name}
                />
              )}
            </div>
          </Card>
        </DialogTrigger>
        {open && <BreadCardDialogBody no={bread.no} />}
      </Dialog>
    </>
  );
}

function BreadCardDialogBody({ no }: { no: number }) {
  const { data: bread, isLoading } = useGetBreadQuery(no);

  if (isLoading) return;

  if (!bread) return;

  return (
    <DialogContent className="w-full max-w-3xl overflow-y-auto max-h-[90vh] p-6">
      <DialogTitle className="m-5 flex justify-center">{bread.name}</DialogTitle>

      <DialogClose className="absolute top-1 right-1 cursor-pointer w-10">
        <X />
      </DialogClose>

      {/* 이미지 슬라이더 */}
      {bread.images?.length > 0 && (
        <div className="w-full max-w-[500px] mx-auto mb-4">
          {bread.images.length > 1 ? (
            <Carousel
              opts={{
                loop: true,
                align: 'start',
                slidesToScroll: 1,
                containScroll: 'trimSnaps',
              }}
              className="mr-10"
            >
              <CarouselContent>
                {bread.images.map((image, i) => (
                  <CarouselItem key={i}>
                    <div key={i} className="flex justify-start items-center w-full">
                      <img
                        src={image.url}
                        alt={`빵 이미지 ${i + 1}`}
                        className="object-contain rounded-2xl"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious />
              <CarouselNext />
              <CarouselDots />
            </Carousel>
          ) : (
            <div className="w-full flex justify-center items-center">
              <img
                src={bread.images[0]?.url}
                alt="단일 이미지"
                className="h-[300px] object-contain rounded"
              />
            </div>
          )}
        </div>
      )}

      <DialogDescription className="mb-10">{bread.description}</DialogDescription>

      <h3 className="font-bold">알레르기 유발 요인</h3>
      <DialogDescription className="-mt-2 mb-2">{bread.allergyInfo}</DialogDescription>

      <h3 className="font-bold">원산지 정보</h3>
      <DialogDescription className="-mt-2 mb-2">{bread.countryOfOrigin}</DialogDescription>
    </DialogContent>
  );
}

export default BreadCard;
