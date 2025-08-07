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
} from '@appabbang/ui';
import { X } from 'lucide-react';
import ProductsBreadCard from './products-bread-card';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function BreadCardDetail({ bread, onClick }: { bread: BreadProps; onClick: () => void }) {
  return (
    <>
      <AlertDialogTrigger asChild>
        <ProductsBreadCard bread={bread} onClick={onClick} />
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

export default BreadCardDetail;
