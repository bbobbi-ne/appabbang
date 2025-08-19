/**
 * [비회원 개인정보 수집 및 이용 동의서]
 */

import type { BreadProps } from '@/interface/bread-interface';
import {
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialog,
} from '@appabbang/ui';
import { X } from 'lucide-react';
import ProductsBreadCard from '@/components/products/products-bread-card';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function BreadCardDetail({ bread }: { bread: BreadProps }) {
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
                    src={image?.url ?? '/images/no-image.png'}
                    alt={`빵 이미지 ${i + 1}`}
                    className="h-[100px] object-contain rounded"
                  />
                </div>
              ))}
            </Slider>
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
