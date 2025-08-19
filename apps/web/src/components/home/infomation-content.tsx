import { Link } from '@tanstack/react-router';
import { Card, CardDescription, CardTitle } from '@appabbang/ui';

export default function Infomation() {
  return (
    <>
      <div className="bg-secondary pt-20 pb-40">
        <div className="container mx-auto px-2">
          <h3 className="text-2xl sm:text-4xl font-bold text-primary py-4 ml-8">정보</h3>
          {/* 내용 */}
          <div className="flex flex-row gap-4 mx-8">
            <Link to="/brand">
              <Card className="p-5 cursor-pointer hover:shadow-2xl">
                <CardTitle className="text-[16px] mb-10">Q. 아빠빵은 어떤 브랜드인가요?</CardTitle>
                <CardDescription>
                  자세한 답변은? <br /> 브랜드 소개로 이동하기
                </CardDescription>
              </Card>
            </Link>
            <Link to="/faq">
              <Card className="p-5 cursor-pointer hover:shadow-2xl">
                <CardTitle className="text-[16px] mb-10">Q. 주문서를 어떻게 작성하나요?</CardTitle>
                <CardDescription>
                  자세한 답변은? <br /> FAQ로 이동하기
                </CardDescription>
              </Card>
            </Link>
            {/* <Link to="/">
        <Card className="p-5 cursor-pointer hover:shadow-2xl">
          <CardTitle className="text-[16px] mb-10">Q. 공지사항은 어디서 보나요?</CardTitle>
          <CardDescription>
            자세한 답변은? <br /> 공지사항으로 이동하기
          </CardDescription>
        </Card>
        
        </Link> */}
          </div>
        </div>
      </div>
    </>
  );
}
