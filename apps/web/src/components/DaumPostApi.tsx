/**
 * 다음 주소 API
 */

import { Button } from '@appabbang/ui';
import { useDaumPostcodePopup } from 'react-daum-postcode';

function DaumPostApi({ setAddress }: any) {
  //클릭 시 수행될 팝업 생성 함수
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  /** 핸들러 */
  const onComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = ''; //추가될 주소

    //주소타입이 도로명주소일 경우
    if (data.addressType === 'R') {
      data.bname !== '' && (extraAddress += data.bname); // 법정동, 법정리
      data.buildingName !== '' &&
        (extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName); // 건물명

      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setAddress(fullAddress); // setAddress를 호출하여 부모 컴포넌트의 상태 업데이트
  };

  /** 주소 검색 버튼 클릭 시 활성화되는 이벤트 - 결과 주소를 클릭하면 해당 함수가 수행된다 */
  const handleClick = () => open({ onComplete });

  return (
    <>
      <Button type="button" className="w-20 ml-2" onClick={handleClick}>
        주소검색
      </Button>
    </>
  );
}

export default DaumPostApi;
