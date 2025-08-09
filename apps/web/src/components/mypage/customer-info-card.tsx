/**
 * 고객 정보 Card
 */

import { Card, CardContent } from '@appabbang/ui';
import MenuButton from './menu-button';

interface CustomerProp {
  id: string;
  name: string;
}

function CustomerInfoCard({ id, name }: CustomerProp) {
  return (
    <div className="flex flex-col">
      <Card className="w-full h-full ml-auto mr-auto">
        <CardContent>
          <div className="flex flex-row items-center mt-5">
            <div className="w-6/12 text-center">
              <span className="font-bold">
                {name}({id})
              </span>
              님 안녕하세요.
            </div>
            <div className="w-3/12 *:text-center *:m-5 border-r border-l">
              <p>누적금액</p>
              <p className="font-bold ">1,000,000원</p>
            </div>
            <div className="w-3/12 *:text-center *:m-5">
              <p>총 보유 쿠폰 수</p>
              <p className="font-bold ">2개</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MenuButton />
    </div>
  );
}

export default CustomerInfoCard;
