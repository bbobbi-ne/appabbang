/**
 * 다음 주소 API
 */

import { Button } from '@appabbang/ui';
import { useDaumPostcodePopup } from 'react-daum-postcode';

interface ParamsProp {
  setAddress: (address: string[]) => void;
}

interface ResultPostProp {
  address: string;
  addressEnglish: string;
  addressType: string;
  apartment: string;
  autoJibunAddress: string;
  autoJibunAddressEnglish: string;
  autoRoadAddress: string;
  autoRoadAddressEnglish: string;
  bcode: string;
  bname: string;
  bname1: string;
  bname1English: string;
  bname2: string;
  bname2English: string;
  bnameEnglish: string;
  buildingCode: string;
  buildingName: string;
  hname: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  noSelected: string;
  postcode: string;
  postcode1: string;
  postcode2: string;
  postcodeSeq: string;
  query: string;
  roadAddress: string;
  roadAddressEnglish: string;
  roadname: string;
  roadnameCode: string;
  roadnameEnglish: string;
  sido: string;
  sidoEnglish: string;
  sigungu: string;
  sigunguCode: string;
  sigunguEnglish: string;
  userLanguageType: string;
  userSelectedType: string;
  zonecode: string;
}

function DaumPostApi({ setAddress }: ParamsProp) {
  //클릭 시 수행될 팝업 생성 함수
  const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  /** 핸들러 */
  const onComplete = (data: ResultPostProp) => {
    // let fullAddress = data.address;
    // let extraAddress = ''; //추가될 주소

    // //주소타입이 도로명주소일 경우
    // if (data.addressType === 'R') {
    //   data.bname !== '' && (extraAddress += data.bname); // 법정동, 법정리
    //   data.buildingName !== '' &&
    //     (extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName); // 건물명

    //   fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    // }

    const addrList = [data.zonecode, data.address, data.bname]; // 우편주소, 기본주소, 상세주소
    setAddress(addrList); // setAddress를 호출하여 부모 컴포넌트의 상태 업데이트
  };

  /** 주소 검색 버튼 클릭 시 활성화되는 이벤트 - 결과 주소를 클릭하면 해당 함수가 수행된다 */
  const handleClick = () => open({ onComplete: onComplete as any });

  return (
    <>
      <Button type="button" className="w-20 ml-2" onClick={handleClick}>
        주소검색
      </Button>
    </>
  );
}

export default DaumPostApi;
