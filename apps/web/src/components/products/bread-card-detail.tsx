/**
 * [비회원 개인정보 수집 및 이용 동의서]
 */

import {
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialog,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '@appabbang/ui';
import { X } from 'lucide-react';
import ProductsBreadCard from '@/components/products/products-bread-card';
import type { BreadsDetailData } from '@/api/data-contracts';

function BreadCardDetail({ bread }: { bread: BreadsDetailData }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="">
          <ProductsBreadCard bread={bread} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <AlertDialogCancel className="absolute top-1 right-1 cursor-pointer w-4">
          <X />
        </AlertDialogCancel>

        <AlertDialogTitle className="text-2xl text-center break-keep py-2">
          {bread.name}
        </AlertDialogTitle>
        <AlertDialogDescription hidden>{bread.description}</AlertDialogDescription>

        {/* 이미지 슬라이더 */}
        <div className="w-full max-w-[500px] mx-auto">
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
                        className="h-[100px] object-contain rounded"
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
                src={bread?.images[0]?.url ?? '/images/no-image.png'}
                alt="단일 이미지"
                className="h-[150px] object-contain rounded"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold">알레르기 유발 요인</h3>
          <p className="text-sm text-gray-500 break-keep">{bread.allergyInfo}</p>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-semibold">원산지 정보</h3>
          <p className="text-sm text-gray-500 break-keep">{bread.countryOfOrigin}</p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BreadCardDetail;
