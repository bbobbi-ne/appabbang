import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@appabbang/ui';
import Title from '../common/title';
import { useMediaQuery } from '@appabbang/utils';

export default function SellPopularProducts() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const slidesToScroll = isMobile ? 1 : isTablet ? 2 : 4;

  let list = [
    { id: 7, title: '인기상품 네모식빵7', image: '/images/단팥빵.png' },
    { id: 8, title: '인기상품 네모식빵8', image: '/images/발효버터소금빵.jpg' },
    { id: 9, title: '인기상품 네모식빵9', image: '/images/초코마카롱.png' },
    { id: 10, title: '인기상품 네모식빵10', image: '/images/초콜릿머핀.jpg' },
    { id: 11, title: '인기상품 네모식빵11', image: '/images/햄에그모닝.jpg' },
    { id: 12, title: '인기상품 네모식빵12', image: '/images/블랙올리브치즈베이글.jpg' },
    { id: 1, title: '인기상품 네모식빵1', image: '/images/라부부1.jpg' },
    { id: 2, title: '인기상품 네모식빵2', image: '/images/라부부2.png' },
    { id: 3, title: '인기상품 네모식빵3', image: '/images/라부부3.jpg' },
    { id: 4, title: '인기상품 네모식빵4', image: '/images/라부부5.jpg' },
    { id: 5, title: '인기상품 네모식빵5', image: '/images/굿모닝롤.jpg' },
    { id: 6, title: '인기상품 네모식빵6', image: '/images/라부부7.jpg' },
  ];

  return (
    <div className="bg-secondary pt-20 pb-30">
      <div className="container mx-auto px-2">
        <Title title="인기 판매 상품" className="ml-8 text-left" />

        <Carousel
          opts={{
            loop: true,
            align: 'start',
            slidesToScroll,
            containScroll: 'trimSnaps',
          }}
          className="mx-8"
        >
          <CarouselContent>
            {list.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
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
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                      {item.title}
                    </h3>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots />
        </Carousel>
      </div>
    </div>
  );
}
