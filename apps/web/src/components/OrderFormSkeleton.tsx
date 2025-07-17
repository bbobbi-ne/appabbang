// 주문서 스켈레톤
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
} from '@appabbang/ui';
import PageTitle from './PageTitle';
import CardComment from './CardComment';

function OrderFormSkeleton() {
  return (
    <div>
      <PageTitle />

      <div className="relative flex w-6xl h-auto m-auto">
        <Button className="absolute -top-10 right-0 ml-auto">주문</Button>

        <Card className="w-full bg-[#fcfcfc]">
          <div className="p-5">
            <CardTitle className="pt-5 flex flex-row items-start mb-6">
              <div className="mr-2 w-25 h-6 bg-gray-300 rounded animate-pulse" />
              <div className="pr-2 w-15 h-6 bg-gray-300 rounded animate-pulse" />
            </CardTitle>
            <CardDescription className="mt-2 w-80 h-4 bg-gray-300 rounded animate-pulse" />
            <CardDescription className="mt-2 w-60 h-4 bg-gray-300 rounded animate-pulse" />
          </div>

          <div className="m-5">
            <CardContent>
              <CardComment
                title="구매할 빵을 검색하고 선택하세요."
                comment="최소 1건 이상 선택해야 주문서 작성이 진행됩니다."
              />

              <div className="w-72 flex flex-row gap-2">
                <Input type="text" placeholder="빵이름을 입력하세요." className="mt-5 mb-5" />
                <Button type="submit" className="mt-5 mb-5">
                  검색
                </Button>
              </div>

              <div className="flex flex-row flex-wrap gap-5 justify-start">
                {[...Array(10)].map((_, index) => (
                  <Card key={index} className="mt-4 mb-4 min-w-[180px] max-w-[220px]">
                    <CardHeader>
                      <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                      <div className="w-full h-3 bg-gray-300 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-32 bg-gray-300 rounded animate-pulse mb-2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default OrderFormSkeleton;
