import { Card, CardContent } from '@appabbang/ui';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';

export default function SellPopularProducts() {
  let list = [
    {
      id: 7,
      title: '인기상품 네모식빵7',
      image: '/images/단팥빵.png',
    },
    {
      id: 8,
      title: '인기상품 네모식빵8',
      image: '/images/발효버터소금빵.jpg',
    },
    {
      id: 9,
      title: '인기상품 네모식빵9',
      image: '/images/초코마카롱.png',
    },
    {
      id: 10,
      title: '인기상품 네모식빵10',
      image: '/images/초콜릿머핀.jpg',
    },
    {
      id: 11,
      title: '인기상품 네모식빵11',
      image: '/images/햄에그모닝.jpg',
    },
    {
      id: 12,
      title: '인기상품 네모식빵12',
      image: '/images/블랙올리브치즈베이글.jpg',
    },
    {
      id: 1,
      title: '인기상품 네모식빵1',
      image: '/images/라부부1.jpg',
    },
    {
      id: 2,
      title: '인기상품 네모식빵2',
      image: '/images/라부부2.png',
    },
    {
      id: 3,
      title: '인기상품 네모식빵3',
      image: '/images/라부부3.jpg',
    },
    {
      id: 4,
      title: '인기상품 네모식빵4',
      image: '/images/라부부5.jpg',
    },
    {
      id: 5,
      title: '인기상품 네모식빵5',
      image: '/images/굿모닝롤.jpg',
    },
    {
      id: 6,
      title: '인기상품 네모식빵6',
      image: '/images/라부부7.jpg',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-secondary pt-20 pb-30">
      <div className="container mx-auto px-2">
        <h3 className="text-2xl sm:text-4xl font-bold text-primary py-4 ml-8">인기 판매 상품</h3>
        {/* 내용 */}
        <Slider {...settings} className="mx-8">
          {list.map((item) => (
            <div key={item.id} className="px-1">
              <Card>
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '8px 8px 0 0',
                  }}
                />
                <CardContent>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{item.title}</h3>
                </CardContent>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
