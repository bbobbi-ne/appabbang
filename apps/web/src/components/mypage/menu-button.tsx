/**
 * 마이페이지 > 메뉴버튼
 * 각 버튼명은 정보수정, 비밀번호 변경, 배송지 관리, 주문내역이 존재한다.
 *
 * 정보수정 : 고객정보를 수정한다.
 * 비밀번호 변경 : 고객정보 중, 비밀번호를 변경한다.
 * 배송지 관리 : 고객정보와 매핑된 배송지 정보를 관리한다.
 * 주문내역 : 고객정보와 매핑된 주문 목록을 관리한다.
 */

import { Button } from '@appabbang/ui';
import { useLocation, useNavigate } from '@tanstack/react-router';

// Custom CSS
const btnCssStr = `bg-[#ffffff] text-[#202020] hover:bg-[#644a40] hover:text-[#ffffff]`;

function MenuButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  console.log(pathname);

  return (
    <div className="flex flex-row gap-10 mt-15 mb-5 m-auto">
      <div>
        <Button
          className={pathname.includes('/edit') ? btnCssStr : ''}
          onClick={() => navigate({ to: '/mypage/edit' })}
        >
          정보수정
        </Button>
      </div>
      <div>
        <Button
          className={pathname.includes('/edit') ? btnCssStr : ''}
          onClick={() => navigate({ to: '/mypage/edit' })}
        >
          비밀번호 수정
        </Button>
      </div>
      <div>
        <Button
          className={pathname.includes('/edit') ? btnCssStr : ''}
          onClick={() => navigate({ to: '/mypage/edit' })}
        >
          배송지 관리
        </Button>
      </div>
      <div>
        <Button
          className={pathname.includes('/edit') ? btnCssStr : ''}
          onClick={() => navigate({ to: '/mypage/edit' })}
        >
          주문내역
        </Button>
      </div>
    </div>
  );
}

export default MenuButton;
