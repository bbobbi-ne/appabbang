import { faker } from '@faker-js/faker/locale/ko';

export type Breads = {
  no: number;
  name: string;
  description: string;
  unit_price: number;
  image_url: string;
  bread_status: number;
  updated_at: Date;
};

// ✅ 길이만큼 숫자 배열 생성
const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

// ✅ 단일 빵 데이터 생성 함수
const newBread = (no: number): Breads => {
  return {
    no,
    name: faker.person.fullName() + '빵',
    description: faker.lorem.sentence(),
    unit_price: parseFloat(faker.commerce.price({ min: 1000, max: 20000 })),
    image_url:
      faker.image.urlLoremFlickr({
        category: faker.helpers.arrayElement(['people', 'nature', 'city', 'food']),
        width: faker.number.int({ min: 300, max: 500 }),
        height: faker.number.int({ min: 200, max: 400 }),
      }) + `?lock=${faker.string.uuid()}`,
    bread_status: faker.number.int({ min: 0, max: 2 }), // 예: 0: 품절, 1: 판매중, 2: 준비중
    updated_at: faker.date.recent({ days: 10 }),
  };
};

// ✅ 전체 빵 목록 생성
export function makeBreadsData(len: number): Breads[] {
  return range(len).map((i) => newBread(i + 1)); // no는 1부터 시작
}
