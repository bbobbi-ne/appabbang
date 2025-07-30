import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@appabbang/ui';
import TitleContent from './title-content';
import {
  Box,
  boxVars,
  Container,
  Row,
  rowVariants,
  SliderButton,
  SliderContainer,
} from '@/styles/home';

export default function SellPopularProducts() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [leaving, setLeaving] = useState<boolean>(false);
  const [isBack, setIsBack] = useState<boolean>(false);

  let list = [
    {
      id: 1,
      title: '인기상품 네모식빵1',
      image: 'https://via.placeholder.com/300x200?text=Bread1',
    },
    {
      id: 2,
      title: '인기상품 네모식빵2',
      image: 'https://via.placeholder.com/300x200?text=Bread2',
    },
    {
      id: 3,
      title: '인기상품 네모식빵3',
      image: 'https://via.placeholder.com/300x200?text=Bread3',
    },
    {
      id: 4,
      title: '인기상품 네모식빵4',
      image: 'https://via.placeholder.com/300x200?text=Bread4',
    },
    {
      id: 5,
      title: '인기상품 네모식빵5',
      image: 'https://via.placeholder.com/300x200?text=Bread5',
    },
    {
      id: 6,
      title: '인기상품 네모식빵6',
      image: 'https://via.placeholder.com/300x200?text=Bread6',
    },
    {
      id: 7,
      title: '인기상품 네모식빵7',
      image: 'https://via.placeholder.com/300x200?text=Bread7',
    },
    {
      id: 8,
      title: '인기상품 네모식빵8',
      image: 'https://via.placeholder.com/300x200?text=Bread8',
    },
    {
      id: 9,
      title: '인기상품 네모식빵9',
      image: 'https://via.placeholder.com/300x200?text=Bread9',
    },
    {
      id: 10,
      title: '인기상품 네모식빵10',
      image: 'https://via.placeholder.com/300x200?text=Bread10',
    },
    {
      id: 11,
      title: '인기상품 네모식빵11',
      image: 'https://via.placeholder.com/300x200?text=Bread11',
    },
    {
      id: 12,
      title: '인기상품 네모식빵12',
      image: 'https://via.placeholder.com/300x200?text=Bread12',
    },
  ];

  // list = [];

  const offset = 4; // 화면에 보여지는 아이템 최대건수

  /**
   * 슬라이드 기능
   */
  const increaseIndex = () => {
    if (list.length > 0) {
      if (leaving) return;
      setIsBack(false);
      setLeaving(true);
      const totalItems = list.length;
      const maxIndex = Math.floor(totalItems / offset) - 1;
      setSlideIdx((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const decreaseIndex = () => {
    if (list.length > 0) {
      if (leaving) return;
      setIsBack(true);
      setLeaving(true);
      const totalItems = list.length;
      const maxIndex = Math.floor(totalItems / offset) - 1;
      setSlideIdx((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  // exit 이벤트가 끝날때 실행됨. 상태값 변경
  const toggleLeaving = () => setLeaving((prev) => !prev);

  // 현재 슬라이드에 표시할 아이템들 계산
  const currentItems = list.slice(slideIdx * offset, slideIdx * offset + offset);

  return (
    <Container>
      <TitleContent title="인기 판매 상품" />
      <SliderContainer>
        <SliderButton className="prev" onClick={decreaseIndex}>
          ‹
        </SliderButton>
        <SliderButton className="next" onClick={increaseIndex}>
          ›
        </SliderButton>

        <AnimatePresence initial={false} onExitComplete={toggleLeaving} custom={isBack}>
          <Row
            key={slideIdx}
            custom={isBack}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', duration: 0.5 }}
          >
            {currentItems.map((item) => (
              <Card key={item.id}>
                <Box
                  className="w-50 h-50"
                  layoutId={String(item.id)}
                  variants={boxVars}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: 'tween' }}
                  $bgPhoto={item.image}
                />
                <CardContent>{item.title}</CardContent>
              </Card>
            ))}
          </Row>
        </AnimatePresence>
      </SliderContainer>
    </Container>
  );
}
