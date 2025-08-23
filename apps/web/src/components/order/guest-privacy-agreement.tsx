/**
 * [비회원 개인정보 수집 및 이용 동의서]
 */

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  cn,
} from '@appabbang/ui';
import React from 'react';
import { X } from 'lucide-react';

interface AgreedProps {
  onAgreed: (flag: boolean) => void;
  agreed: boolean;
  setAgreed: (flag: boolean) => void;
}

export const termsOfService = `
  1. 서비스의 제공 등
  (가) 아빠빵은 여러 가지 각종 제품, 이벤트 정보 및 리워드 서비스 등을 제공하며 필요에 따라 그 내용이 추가, 변경 및 정지될 수 있습니다.
      또한 아빠빵은 천재지변 또는 중계선 고장 등의 불가피한 사정으로 인하여 서비스를 중단할 수 있습니다.
  (나) 아빠빵은 긴급한 사정, 회원의 정당한 권리 침해 방지 등을 위해 필요한 경우, 별도의 사전 동의 없이 홈페이지 및 모바일 App을 통해 고지 할 수 있습니다.
  
  2. "비회원"에 대한 고지 
  (가) 아빠빵이 약관의 변경 또는 비회원에 대한 통지를 하는 경우 아래의 규정된 방법 중 1가지 이상의 방법으로 비회원에게 고지 하되, 비회원 전체에 대한 통지의 경우 NN일 전 아빠빵의 게시판에 게시하도록 한다.
    - 아빠빵의 홈페이지 또는 앱 등을 통한 게시
    - 전자우편 또는 전화연락을 통한 통지
    - 아빠빵의 매장 게시
  (나) 본 조의 고지방법은 이 약관에서 달리 규정하지 않는 한, 이 약관의 각 조항에서 규정하는 통보 또는 통지의 경우에 이를 준용한다. 
      
  3. 정보의 제공 및 광고의 게재 
  (가) "아빠빵"은 "비회원"이 "서비스" 이용 중 필요하다고 인정되는 다양한 정보를 공지사항 등의 방법으로 "비회원"에게 제공할 수 있습니다. 
  (나) 제1항의 정보를 전화 및 모사전송기기에 의하여 전송하려고 하는 경우에는 "비회원"의 사전 동의를 받아서 전송합니다. 
      다만, "비회원"의 거래관련 정보 및 고객문의 등에 대한 회신에 있어서는 제외됩니다.
`;

export const personalInfoCollectAndUsed = `
  1. 개인정보 수집목적 및 이용목적 : 비회원 구매 서비스 제공

  2. 수집하는 개인정보 항목
  - 주문 시, 성명, 주소, 전화번호, 결제정보, 비회원 결제 비밀번호
  - 취소/교환/반품 신청 시, 환불계좌정보(은행명, 계좌번호, 예금주)

  3. 개인정보의 보유기간 및 이용기간
  원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
  (가) 회사 내부 방침에 의한 정보 보유 사유· 부정거래 방지 및 쇼핑몰 운영방침에 따른 보관 : 5년
  (나) 관련 법령에 의한 정보보유 사유

  o 계약 또는 청약철회 등에 관한 기록
  -보존이유 : 전자상거래등에서의소비자보호에관한법률
  -보존기간 : 5년

  o 대금 결제 및 재화 등의 공급에 관한 기록
  -보존이유: 전자상거래등에서의소비자보호에관한법률
  -보존기간 : 5년

  o 소비자 불만 또는 분쟁처리에 관한 기록
  -보존이유 : 전자상거래등에서의소비자보호에관한법률
  -보존기간 : 3년

  o 로그 기록
  -보존이유: 통신비밀보호법
  -보존기간 : 3개월

※ 동의를 거부할 수 있으나 거부 시 아빠빵 서비스 이용이 불가능합니다.
`;

export const withdrawalOfSubscription = `
  1. 청약철회 등 및 환불
  ‘아빠빵’(이하 “업체”)은 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 및 같은 법 시행령 제21조에 따라, 식품의 특성상 청약철회(주문 취소 및 환불)가 제한됨을 안내드립니다.
  업체는 아래와 같은 경우에 한하여 환불 처리를 지원합니다.

  제1항. 청약철회 제한 사유
  다음 각 호에 해당하는 경우에는 전자상거래법상 허용된 청약철회 기간(수령 후 7일 이내)이라 하더라도 청약철회(환불)가 제한됩니다.
  (1) 단순 변심, 맛·향 등의 주관적 사유로 인한 환불 요청
  (2) 고객의 보관 부주의로 인해 제품이 변질되었거나 훼손된 경우
  (3) 일부 소비하거나 포장을 개봉한 이후 남은 잔량에 대한 환불 요청
  (4) 주문 제작 등으로 재판매가 어려운 제품으로서, 청약철회 불가에 대해 사전 고지 및 동의를 받은 경우

  제2항. 환불이 가능한 경우
  다음 각 호에 해당하는 경우에는 상품 수령일로부터 7일 이내 또는 그 사실을 알게 된 날로부터 30일 이내에 청약철회를 요청하실 수 있습니다.
  (1) 배송 중 심각하게 훼손되어 섭취가 불가능한 경우
  (2) 주문한 내용과 명백히 다른 상품이 배송된 경우
  (3) 유통기한이 이미 지난 제품이 배송된 경우

  제3항. 환불 절차 및 비용
  (1) 업체 귀책 사유로 인한 환불(제2항 해당) 시, 반품에 필요한 배송비는 업체가 부담합니다.
  (2) 고객 사유로 인한 반품(예: 단순 변심)은 불가합니다.
  (3) 환불은 청약철회 접수일로부터 3영업일 이내 처리되며, 신용카드 등으로 결제된 경우 지체 없이 승인 취소 또는 정정 요청이 진행됩니다. 지연 시 「전자상거래법」에 따라 연 15%의 지연이자가 적용될 수 있습니다.
  (4) 업체는 포장비, 인건비, 보관비, 위약금 등 명목의 별도 비용을 청구하지 않습니다.
  (5) 이용자가 직접 상품을 수령할 경우는 무료배송 취급을 하며, 그 외에는 최초 배송비는 4,000원이 발생할 수 있습니다. 
  (6) 업체는 휴업 또는 영업 정지 중이라도 고객 응대, 환불 및 청약철회 처리 업무를 지속적으로 수행하여야 하며, 이를 이행하지 않을 경우 관계법령에 따라 제재를 받을 수 있습니다.
  (7) 단순변심에 의한 청약철회 시 업체에서 부담하지 않습니다.

  제4항. 주문 상태에 따른 환불 제한 안내
  (1) 업체는 다음의 주문 절차를 이행하고 이용자는 특이사항 한정으로 환불이 가능합니다.
  (2) 이용자가 접수 요청을 완료하고 계좌이체 이전인 경우, 이용자가 직접 홈페이지에서 주문을 취소할 수 있습니다.
  (3) 이용자가 접수 요청을 완료하고 계좌이체 이후인 경우, 이용자는 직접 홈페이지에서 주문을 취소하고 관리자는 안내된 시간 내에 환불 절차를 이행합니다.
  (4) 이용자가 접수 완료한 주문이 이미 ‘제조중’ 상태인 경우, 업체는 제조를 진행하고 있으므로 환불이 불가합니다.
  (5) 이용자가 접수 완료한 주문이 이미 ‘배송중’ 상태인 경우, 배송이 진행 중이므로 환불이 불가합니다. 다만, 배송 지연이 된 경우에는 환불이 가능합니다. (총 주문금액과 배송비가 환불됩니다.)
  (6) 이용자가 접수 완료한 주문이 이미 ‘수령대기중' 상태인 경우, 배송이 진행 중이므로 환불이 불가합니다.
  (7) 이용자가 접수 완료한 주문이 이미 ‘완료' 상태인 경우, 배송이 완료되었으므로 환불이 불가합니다. 다만, 상품에 이상이 있는 경우는 제 2항에 해당합니다.
`;

function GuestPrivacyAgreement({ onAgreed, agreed, setAgreed }: AgreedProps) {
  // 동의 버튼 클릭 시 동의 처리
  const handleAgree = () => {
    setAgreed(true);
    onAgreed(true);
    // AlertDialog는 내부적으로 닫힘
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Card className="flex items-center justify-center relative mt-10 ml-10 mr-10">
          <CardContent className="pt-7 text-red-700">
            * 비회원일 경우, 개인정보 수집 및 이용 동의가 필요합니다.
          </CardContent>
          <Button
            type="button"
            className={cn(
              'cursor-pointer hover:bg-[#e5caaf]',
              agreed ? 'bg-[#E8CBB1] text-[#393028]' : 'bg-[#ffe0c2] text-[#393028]',
            )}
          >
            {agreed ? '확인완료' : '미확인'}
          </Button>
        </Card>
      </AlertDialogTrigger>
      <AlertDialogDescription className="hidden" />

      <AlertDialogContent className="h-[600px] max-h-[80vh] overflow-y-auto">
        <AlertDialogCancel className="relative top-1 -right-11/12 cursor-pointer w-10">
          <X />
        </AlertDialogCancel>
        <AlertDialogTitle className="flex justify-center">
          개인정보 수집 및 이용 동의서
        </AlertDialogTitle>

        <Card className="m-5 h-60 overflow-scroll">
          <CardTitle className="mt-5 ml-5 text-[16px]">[ 아빠빵(APPABBANG) 이용약관 ]</CardTitle>
          <CardContent className="-mt-5">
            {termsOfService.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
        <Card className="ml-5 mr-5 h-60 overflow-scroll">
          <CardTitle className="mt-5 ml-5 text-[16px]">
            [ 아빠빵(APPABBANG) 개인정보 수집 및 이용 동의 ]
          </CardTitle>

          <CardContent className="-mt-5">
            {personalInfoCollectAndUsed.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </CardContent>
        </Card>
        <Card className="ml-5 mr-5 h-60 overflow-scroll">
          <CardTitle className="mt-5 ml-5 text-[16px]">
            [ 아빠빵(APPABBANG) 청약철회 및 환불안내 ]
          </CardTitle>

          <CardContent className="-mt-5">
            {withdrawalOfSubscription.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        <div className="mt-5 mb-10 pl-5 pr-5">
          <CardContent>
            본인의 실명, 임시 비밀번호 등의 민감정보를 아빠빵 서비스를 이용하는 데 사용함으로써
            동의를 포함합니다.
          </CardContent>
          <AlertDialogAction
            type="button"
            className="cursor-pointer relative -right-11/12"
            onClick={handleAgree}
          >
            동의
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default GuestPrivacyAgreement;
