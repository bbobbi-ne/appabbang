import type { IFacMenuButtonProps } from '@/interface/faq-interface';
import { Button, cn } from '@appabbang/ui';

// Custom CSS
export const btnCssStr = `bg-[#ffffff] text-[#202020] hover:bg-[#644a40] hover:text-[#ffffff]`;

function FaqMenuButton({ activeMenu, onChangeActiveMenu }: IFacMenuButtonProps) {
  return (
    <div className="flex flex-row gap-2 my-4 overflow-x-auto">
      <div className="flex-1">
        <Button
          onClick={() => onChangeActiveMenu('all')}
          className={cn('w-full', activeMenu !== 'all' && btnCssStr)}
        >
          전체
        </Button>
      </div>
      <div className="flex-1">
        <Button
          onClick={() => onChangeActiveMenu('product')}
          className={cn('w-full', activeMenu !== 'product' && btnCssStr)}
        >
          제품문의
        </Button>
      </div>
      <div className="flex-1">
        <Button
          onClick={() => onChangeActiveMenu('orderPayment')}
          className={cn('w-full', activeMenu !== 'orderPayment' && btnCssStr)}
        >
          주문 및 결제
        </Button>
      </div>
      <div className="flex-1">
        <Button
          onClick={() => onChangeActiveMenu('deliveryPackage')}
          className={cn('w-full', activeMenu !== 'deliveryPackage' && btnCssStr)}
        >
          배송 및 포장
        </Button>
      </div>
      <div className="flex-1">
        <Button
          onClick={() => onChangeActiveMenu('etc')}
          className={cn('w-full', activeMenu !== 'etc' && btnCssStr)}
        >
          기타
        </Button>
      </div>
    </div>
  );
}

export default FaqMenuButton;
