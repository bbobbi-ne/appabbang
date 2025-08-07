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
  const settings = {
    dots: true,
    infinite: bread.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <AlertDialogTrigger asChild>
        <ProductsBreadCard bread={bread} onClick={onClick} />
      </AlertDialogTrigger>

      <AlertDialogContent className=" overflow-y-auto">
        <AlertDialogTitle className="m-5 flex justify-start">{bread.name}</AlertDialogTitle>

        <AlertDialogCancel className="absolute top-1 right-1 cursor-pointer w-10">
          <X />
        </AlertDialogCancel>

        {/* 이미지 슬라이더 */}
        <Slider {...settings}>
          {bread.images.map((image, i) => (
            <div key={i} className="w-full">
              <img src={image.url} alt={`이미지`} className="w-full h-auto object-cover rounded" />
            </div>
          ))}
        </Slider>

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
