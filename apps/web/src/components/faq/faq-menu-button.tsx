import type { IFacMenuButtonProps } from '@/interface/faq-interface';
import { Button } from '@appabbang/ui';

// Custom CSS
const btnCssStr = `bg-[#ffffff] text-[#202020] hover:bg-[#644a40] hover:text-[#ffffff]`;

function FaqMenuButton({ activeMenu, onChangeActiveMenu }: IFacMenuButtonProps) {
  return (
    <div className="flex flex-row gap-10 mt-15 mb-5 m-auto">
      <div>
        <Button
          onClick={() => onChangeActiveMenu('all')}
          className={activeMenu === 'all' ? '' : btnCssStr}
        >
          전체
        </Button>
      </div>
      <div>
        <Button
          onClick={() => onChangeActiveMenu('product')}
          className={activeMenu === 'product' ? '' : btnCssStr}
        >
          제품문의
        </Button>
      </div>
      <div>
        <Button
          onClick={() => onChangeActiveMenu('orderPayment')}
          className={activeMenu === 'orderPayment' ? '' : btnCssStr}
        >
          주문 및 결제
        </Button>
      </div>
      <div>
        <Button
          onClick={() => onChangeActiveMenu('deliveryPackage')}
          className={activeMenu === 'deliveryPackage' ? '' : btnCssStr}
        >
          배송 및 포장
        </Button>
      </div>
      <div>
        <Button
          onClick={() => onChangeActiveMenu('etc')}
          className={activeMenu === 'etc' ? '' : btnCssStr}
        >
          기타
        </Button>
      </div>
    </div>
  );
}

export default FaqMenuButton;
