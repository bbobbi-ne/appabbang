import styled from 'styled-components';
import { motion, type Variants } from 'framer-motion';

/*** 공통 컨텐츠 div 컨테이너 설정 Start ***/
export const Container = styled.div`
  width: 100%;
  margin-top: 7rem;
`;

/*** 공통 컨텐츠 div 컨테이너 설정 End ***/

/*** 인기 판매 상품 Start ***/
export const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2em;
  width: 100%;
  padding: 0 16vw;
  margin: 0 auto;
  position: relative;
`;

export const Box = styled(motion.div)<{ $bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  width: 16.1em;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

export const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  min-height: 260px;
`;

export const SliderButton = styled.button`
  position: absolute;
  top: 110px;
  left: 65%;
  right: 65%;
  margin: 0 auto;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  z-index: 10;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  &.prev {
    left: 10px;
  }

  &.next {
    right: 10px;
  }
`;

export const boxVars: Variants = {
  normal: { scale: 1 },
  hover: {
    scale: 1.1,
    y: -10,
    transition: {
      delay: 0.2,
      duration: 0.3,
      type: 'tween' as const,
    },
  },
};

export const rowVariants: Variants = {
  hidden: (isBack: boolean) => ({
    x: isBack ? -window.innerWidth : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => ({
    x: isBack ? window.innerWidth : -window.innerWidth,
  }),
};
/*** 인기 판매 상품 End ***/
