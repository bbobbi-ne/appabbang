import { Container } from '@/styles/home';
import TitleContent from './title-content';
import { Card, CardDescription, CardTitle } from '@appabbang/ui';

export default function Infomation() {
  return (
    <Container className="mb-[10%]">
      <TitleContent title="정보" />
      <div className="grid grid-cols-3 grid-rows-1 h-40 ml-[16%] mr-[16%] gap-10">
        <Card className="p-5 cursor-pointer hover:shadow-2xl">
          <CardTitle className="text-[16px] mb-10">Q. 아빠빵은 어떤 브랜드인가요?</CardTitle>
          <CardDescription>
            자세한 답변은? <br /> 브랜드 소개로 이동하기
          </CardDescription>
        </Card>
        <Card className="p-5 cursor-pointer hover:shadow-2xl">
          <CardTitle className="text-[16px] mb-10">Q. 주문서를 어떻게 작성하나요?</CardTitle>
          <CardDescription>
            자세한 답변은? <br /> FAQ로 이동하기
          </CardDescription>
        </Card>
        <Card className="p-5 cursor-pointer hover:shadow-2xl">
          <CardTitle className="text-[16px] mb-10">Q. 공지사항은 어디서 보나요?</CardTitle>
          <CardDescription>
            자세한 답변은? <br /> 공지사항으로 이동하기
          </CardDescription>
        </Card>
      </div>
    </Container>
  );
}
