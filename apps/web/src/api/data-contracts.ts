/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginCreatePayload {
  /**
   * 사용자 ID
   * @example "admin"
   */
  id: string;
  /**
   * 비밀번호
   * @example "test1234!"
   */
  pw: string;
  /**
   * 클라이언트 타입 (user, client)
   * @example "user"
   */
  type: string;
}

export interface LoginCreateData {
  data: {
    /**
     * 사용자 번호
     * @example 1
     */
    no: number;
    /**
     * 사용자 ID
     * @example "ghrn9933"
     */
    id: string;
    /**
     * 사용자 이름
     * @example "테스트빵"
     */
    name: string;
    /**
     * 해시된 비밀번호
     * @example "$2b$12$/gk8toAIQVaIr3jiZuPiM.whSYPOnqqEerBiw47lGLXKCt.MVZp9K"
     */
    pw: string;
  };
  /**
   * 액세스 토큰
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
}

export interface GetAuthData {
  /**
   * 사용자키
   * @example 1
   */
  no: number;
  /**
   * 사용자 ID
   * @example "admin"
   */
  id: string;
  /**
   * 사용자 이름
   * @example "관리자"
   */
  name: string;
  /**
   * 관리자 역할 (10-관리자, 20-서브관리자)
   * @example "10"
   */
  userRole?: "10" | "20";
  /**
   * 클라이언트 타입 (user, client)
   * @example "user"
   */
  type: string;
  /**
   * 토큰 발급 시간
   * @example 1715000000
   */
  iat: number;
  /**
   * 토큰 만료 시간
   * @example 1715000000
   */
  exp: number;
}

export interface RefreshCreateData {
  /**
   * 새로운 액세스 토큰
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
}

export interface LogoutCreateData {
  /**
   * 성공 메시지
   * @example "로그아웃되었습니다."
   */
  message?: string;
}

export type BreadsListData = {
  /**
   * 빵 번호
   * @example 1
   */
  no: number;
  /**
   * 빵 이름
   * @example "크로아상"
   */
  name: string;
  /**
   * 빵 설명
   * @example "바삭한 크로아상"
   */
  description: string;
  /**
   * 단가
   * @example 3000
   */
  unitPrice: number;
  /**
   * 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus: "10" | "20" | "30" | "40" | "50";
  /**
   * 빵 상태 이름
   * @example "판매"
   */
  breadStatusName: string;
  /**
   * 원산지
   * @example "빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)],가공유크림(독일산)"
   */
  countryOfOrigin: string;
  /**
   * 알레르기 정보
   * @example "밀, 우유, 대두, 계란 함유"
   */
  allergyInfo: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
  /** 빵 이미지 목록 중 첫 번째 이미지 */
  images?: {
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url: string;
  };
}[];

export interface BreadsCreatePayload {
  /**
   * 빵 이름
   * @example "크로아상"
   */
  name: string;
  /**
   * 빵 설명
   * @example "바삭한 크로아상"
   */
  description?: string;
  /**
   * 단가
   * @example 3000
   */
  unitPrice: number;
  /**
   * 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus: "10" | "20" | "30" | "40" | "50";
  /**
   * 원산지
   * @example "빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)],가공유크림(독일산)"
   */
  countryOfOrigin: string;
  /**
   * 알레르기 정보
   * @example "밀, 우유, 대두, 계란 함유"
   */
  allergyInfo: string;
  /** 빵 이미지 (선택사항) */
  image?: File[];
}

export type BreadsCreateData = any;

export interface BreadsDeletePayload {
  /**
   * 삭제할 빵 번호 목록
   * @example [1,2,3]
   */
  noList: number[];
}

export type BreadsDeleteData = any;

export interface BreadsDetailData {
  /**
   * 빵 번호
   * @example 1
   */
  no: number;
  /**
   * 빵 이름
   * @example "크로아상"
   */
  name: string;
  /**
   * 빵 설명
   * @example "바삭한 크로아상"
   */
  description?: string;
  /**
   * 단가
   * @example 3000
   */
  unitPrice: number;
  /**
   * 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus: "10" | "20" | "30" | "40" | "50";
  /**
   * 빵 상태 이름
   * @example "판매"
   */
  breadStatusName: string;
  /**
   * 원산지
   * @example "빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)],가공유크림(독일산)"
   */
  countryOfOrigin: string;
  /**
   * 알레르기 정보
   * @example "밀, 우유, 대두, 계란 함유"
   */
  allergyInfo: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
  /** 빵 이미지 목록 (모든 이미지 포함, order 순으로 정렬) */
  images: {
    /**
     * 이미지 공개 ID (Cloudinary)
     * @example "bread_123"
     */
    publicId?: string;
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url?: string;
    /**
     * 이미지 순서
     * @example 1
     */
    order: number;
  }[];
}

export interface BreadsUpdatePayload {
  /**
   * 빵 이름
   * @example "크로아상"
   */
  name: string;
  /**
   * 빵 설명
   * @example "바삭한 크로아상"
   */
  description?: string;
  /**
   * 단가
   * @example 3000
   */
  unitPrice: number;
  /**
   * 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus: "10" | "20" | "30" | "40" | "50";
  /**
   * 원산지
   * @example "빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)],가공유크림(독일산)"
   */
  countryOfOrigin: string;
  /**
   * 알레르기 정보
   * @example "밀, 우유, 대두, 계란 함유"
   */
  allergyInfo: string;
  /** 빵 이미지 (선택사항) */
  image?: File[];
}

export type BreadsUpdateData = any;

export interface StatusUpdatePayload {
  /**
   * 변경할 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus: "10" | "20" | "30" | "40" | "50";
}

export type StatusUpdateData = any;

export interface ImageDeletePayload {
  /**
   * 삭제할 이미지의 공개 ID
   * @example "breads/image123"
   */
  publicId: string;
}

export type ImageDeleteData = any;

export type OrdersListData = {
  /**
   * 주문 번호
   * @example 1
   */
  no: number;
  /**
   * 주문 고유번호
   * @example "ORD-20240622-12345"
   */
  orderNumber: string;
  /**
   * 주문 상태 (10-접수요청, 20-제조중, 30-배송중, 40-완료, 50-취소요청, 51-취소완료, 52-취소완료(환불))
   * @example "10"
   */
  orderStatus: "10" | "20" | "30" | "40" | "50" | "51" | "52";
  /**
   * 주문 상태명
   * @example "접수요청"
   */
  orderStatusName: string;
  /**
   * 주문자 전화번호
   * @example "010-1234-5678"
   */
  ordererMobile: string;
  /**
   * 주문자 이름
   * @example "홍길동"
   */
  ordererName: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 총 주문 금액
   * @example 15000
   */
  totalPrice: number;
  /**
   * 주문 생성일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  createdAt: string;
  /**
   * 주문 수정일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  updatedAt: string;
  /**
   * 주소
   * @example "서울시 강남구"
   */
  address: string;
  /**
   * 상세 주소
   * @example "123-45"
   */
  addressDetail: string;
  /**
   * 배송방법
   * @example "우체국"
   */
  deliveryMethodName: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode?: string;
  payment?: {
    /**
     * 입금 확인 여부
     * @example false
     */
    isPaid?: boolean;
  };
}[];

/**
 * [필수값 안내]
 * - 비회원 주문: ordererName, ordererMobile, recipientName, recipientMobile, address, addressDetail, zipcode, message, orderRoundNo, totalPrice, orderPw, isServiceTermsAgreed, isPrivacyTermsAgreed, deliveryMethodNo, orderItems, bankCode, accountNumber, accountHolderName
 * - 회원 주문: ordererName, ordererMobile, recipientName, recipientMobile, address, addressDetail, zipcode, message, orderRoundNo, totalPrice, deliveryMethodNo, orderItems, bankCode, accountNumber, accountHolderName, customerCouponNo (선택)
 * (상세 예시는 아래 examples 참고)
 */
export interface OrdersCreatePayload {
  /**
   * 주문자 이름
   * @example "홍길동"
   */
  ordererName: string;
  /**
   * 주문자 전화번호
   * @example "010-1234-5678"
   */
  ordererMobile: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 전화번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
  /**
   * 주소
   * @example "서울시 강남구"
   */
  address: string;
  /**
   * 상세주소
   * @example "123-45"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요"
   */
  message: string;
  /**
   * 주문차수 번호
   * @example 1
   */
  orderRoundNo: number;
  /**
   * 총 주문 금액
   * @example 15000
   */
  totalPrice: number;
  /**
   * 송장번호 (초기값: 빈 문자열)
   * @example ""
   */
  trackingNumber?: string;
  /**
   * 결제, 환불 약관 동의여부
   * @example true
   */
  isPaymentRefundTermsAgreed: boolean;
  /**
   * 주문서 비밀번호 (비회원 필수)
   * @example "1234"
   */
  orderPw?: string;
  /**
   * 서비스 이용약관 동의여부 (비회원 필수)
   * @example true
   */
  isServiceTermsAgreed?: boolean;
  /**
   * 개인정보 수집, 이용 동의여부 (비회원 필수)
   * @example true
   */
  isPrivacyTermsAgreed?: boolean;
  /**
   * 배송 방법 번호
   * @example 1
   */
  deliveryMethodNo: number;
  orderItems: {
    /**
     * 빵 번호
     * @example 1
     */
    breadNo: number;
    /**
     * 수량
     * @example 2
     */
    quantity: number;
  }[];
  /**
   * 고객 쿠폰 번호 (회원 선택사항)
   * @example 1
   */
  customerCouponNo?: number;
  /**
   * 은행 코드
   * @example "004"
   */
  bankCode: string;
  /**
   * 계좌번호
   * @example "123-456-7890"
   */
  accountNumber: string;
  /**
   * 예금주명
   * @example "홍길동"
   */
  accountHolderName: string;
}

export type OrdersCreateData = any;

export interface OrdersDetailData {
  /**
   * 주문 번호
   * @example 1
   */
  no: number;
  /**
   * 주문 고유번호
   * @example "ORD-20240622-12345"
   */
  orderNumber: string;
  /**
   * 주문 상태 (10-접수요청, 20-제조중, 30-배송중, 40-완료, 50-취소요청, 51-취소완료, 52-취소완료(환불))
   * @example "10"
   */
  orderStatus: "10" | "20" | "30" | "40" | "50" | "51" | "52";
  /**
   * 주문 상태명
   * @example "접수요청"
   */
  orderStatusName: string;
  /**
   * 주문자 이름
   * @example "홍길동"
   */
  ordererName: string;
  /**
   * 주문자 전화번호
   * @example "010-1234-5678"
   */
  ordererMobile: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 전화번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
  /**
   * 주소
   * @example "서울시 강남구"
   */
  address: string;
  /**
   * 상세주소
   * @example "123-45"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요"
   */
  message: string;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  deliveryMethodName: string;
  /**
   * 배송비
   * @example 3000
   */
  deliveryMethodFee: number;
  /**
   * 할인 금액
   * @example 0
   */
  discountAmount: number;
  /**
   * 주문차수 번호
   * @example 1
   */
  orderRoundNo: number;
  /**
   * 총 주문 금액
   * @example 15000
   */
  totalPrice: number;
  /**
   * 송장번호
   * @example ""
   */
  trackingNumber: string;
  /**
   * 결제, 환불 약관 동의여부
   * @example true
   */
  isPaymentRefundTermsAgreed: boolean;
  /**
   * 주문 생성일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  createdAt: string;
  /**
   * 주문 수정일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  updatedAt: string;
  /** 주문 아이템 목록 */
  orderItems: {
    /**
     * 빵 번호
     * @example 1
     */
    breadNo: number;
    /**
     * 수량
     * @example 2
     */
    quantity: number;
    /**
     * 단가
     * @example 3000
     */
    unitPrice: number;
    /**
     * 합계 금액
     * @example 6000
     */
    totalPrice: number;
    /**
     * 빵 이름
     * @example "크로아상"
     */
    breadName: string;
  }[];
  payment?: {
    /**
     * 은행코드
     * @example "004"
     */
    bankCode: string;
    /**
     * 계좌번호
     * @example "123-456-7890"
     */
    accountNumber: string;
    /**
     * 예금주
     * @example "김빵만"
     */
    accountHolderName: string;
    /**
     * 은행코드 이름
     * @example "우리은행"
     */
    bankCodeName: string;
  };
}

export interface OrdersUpdatePayload {
  /**
   * 주문 상태 (10-접수요청, 20-제조중, 30-배송중, 40-완료, 50-취소요청, 51-취소완료, 52-취소완료(환불))
   * @example "20"
   */
  orderStatus?: "10" | "20" | "30" | "40" | "50" | "51" | "52";
  /**
   * 송장번호
   * @example "123456789"
   */
  trackingNumber?: string;
}

export type OrdersUpdateData = any;

export interface StatusUpdateBody {
  /**
   * 주문 상태 (10-접수요청, 20-제조중, 30-배송중, 40-완료, 50-취소요청, 51-취소완료, 52-취소완료(환불))
   * @example "10"
   */
  orderStatus: "10" | "20" | "30" | "40" | "50" | "51" | "52";
}

export type StatusUpdateResult = any;

export type OrderRoundListData = {
  /**
   * 주문차수 번호
   * @example 1
   */
  no: number;
  /**
   * 주문차수명
   * @example "주문 1차"
   */
  name: string;
  /**
   * 시작일시
   * @format date-time
   * @example "2025-07-01T11:00:00.000Z"
   */
  startedAt: string;
  /**
   * 종료일시
   * @format date-time
   * @example "2025-07-31T11:00:00.000Z"
   */
  endedAt: string;
  /**
   * 최소주문수량
   * @example 1
   */
  minOrderQty: number;
  /**
   * 최대주문수량
   * @example 999
   */
  maxOrderQty: number;
  orderRoundBreads: {
    /**
     * 빵 번호
     * @example 1
     */
    no: number;
    /**
     * 빵 이름
     * @example "판매빵"
     */
    name: string;
  }[];
  image: {
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url?: string;
  }[];
}[];

export interface OrderRoundCreatePayload {
  /**
   * 주문차수명
   * @example "주문 1월"
   */
  name: string;
  /**
   * 시작일시
   * @format date-time
   * @example "2025-01-01T11:00:00.000Z"
   */
  startedAt: string;
  /**
   * 종료일시
   * @format date-time
   * @example "2025-01-31T11:00:00.000Z"
   */
  endedAt: string;
  /**
   * 최소주문수량
   * @example 1
   */
  minOrderQty: number;
  /**
   * 최대주문수량
   * @example 1
   */
  maxOrderQty: number;
  /**
   * 빵 번호 목록 (JSON 문자열 형태로 전송)
   * @example "[{"no": 1, "name": "판매빵"}, {"no": 5, "name": "출시예정빵"}]"
   */
  orderRoundBreads: any[];
  /**
   * 주문차수 이미지(선택사항)
   * @format binary
   */
  image?: File;
}

export type OrderRoundCreateData = any;

export interface LatestListData {
  /**
   * 주문차수 번호
   * @example 1
   */
  no: number;
  /**
   * 주문차수명
   * @example "주문 1차"
   */
  name: string;
  /**
   * 시작일시
   * @format date-time
   * @example "2025-07-01T11:00:00.000Z"
   */
  startedAt: string;
  /**
   * 종료일시
   * @format date-time
   * @example "2025-07-31T11:00:00.000Z"
   */
  endedAt: string;
  /**
   * 최소주문수량
   * @example 1
   */
  minOrderQty: number;
  /**
   * 최대주문수량
   * @example 1
   */
  maxOrderQty: number;
  orderRoundBreads: {
    /**
     * 빵 번호
     * @example 1
     */
    no: number;
    /**
     * 주문차수
     * @example 1
     */
    orderRoundNo: string;
    /**
     * 빵 번호
     * @example 1
     */
    breadNo: string;
  }[];
  image: {
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url?: string;
  }[];
}

export interface GetOrderRoundData {
  /**
   * 주문차수 번호
   * @example 1
   */
  no: number;
  /**
   * 주문차수명
   * @example "주문 1차"
   */
  name: string;
  /**
   * 시작일시
   * @format date-time
   * @example "2025-07-01T11:00:00.000Z"
   */
  startedAt: string;
  /**
   * 종료일시
   * @format date-time
   * @example "2025-07-31T11:00:00.000Z"
   */
  endedAt: string;
  /**
   * 최소주문수량
   * @example 1
   */
  minOrderQty: number;
  /**
   * 최대주문수량
   * @example 1
   */
  maxOrderQty: number;
  orderRoundBreads: {
    /**
     * 빵 번호
     * @example 1
     */
    no: number;
    /**
     * 빵 이름
     * @example "단팥빵"
     */
    name: string;
    /**
     * 빵 설명
     * @example "부드러운 단팥이 들어간 빵"
     */
    description: string;
    /**
     * 빵 상태
     * @example 10
     */
    breadStatus: string;
    /**
     * 가격
     * @example 1000
     */
    unitPrice: number;
  }[];
  image: {
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url?: string;
  }[];
}

export interface OrderRoundDetailData {
  /**
   * 주문차수 번호
   * @example 1
   */
  no: number;
  /**
   * 주문차수명
   * @example "주문 1차"
   */
  name: string;
  /**
   * 시작일시
   * @format date-time
   * @example "2025-07-01T11:00:00.000Z"
   */
  startedAt: string;
  /**
   * 종료일시
   * @format date-time
   * @example "2025-07-31T11:00:00.000Z"
   */
  endedAt: string;
  /**
   * 최소주문수량
   * @example 1
   */
  minOrderQty: number;
  /**
   * 최대주문수량
   * @example 1
   */
  maxOrderQty: number;
  /** 주문 차수 내 빵 목록 */
  orderRoundBreads: {
    /**
     * 빵 번호
     * @example 1
     */
    no: number;
    /**
     * 빵 이름
     * @example "단팥빵"
     */
    name: string;
    /**
     * 빵 설명
     * @example "부드러운 단팥이 들어간 빵"
     */
    description: string;
    /**
     * 빵 상태 (예: 10=판매중, 50=출시예정)
     * @example "10"
     */
    breadStatus: string;
    /**
     * 가격
     * @example 1000
     */
    unitPrice: number;
  }[];
  image: {
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url: string;
    /**
     * 이미지 식별자
     * @example "breads/zvypj6wohag9dghdtdto"
     */
    publicId: string;
    /**
     * 이미지 순서
     * @example 1
     */
    order: number;
  };
}

export interface OrderRoundUpdatePayload {
  /**
   * 주문차수 번호
   * @example 1
   */
  no: number;
  /**
   * 주문차수
   * @example 1
   */
  orderRoundNo: number;
  /**
   * 주문차수명
   * @example "주문 1차"
   */
  name: string;
  /**
   * 시작일시
   * @format date-time
   * @example "2025-07-01T11:00:00.000Z"
   */
  startedAt: string;
  /**
   * 종료일시
   * @format date-time
   * @example "2025-07-31T11:00:00.000Z"
   */
  endedAt: string;
  /**
   * 최소주문수량
   * @example 1
   */
  minOrderQty: number;
  /**
   * 최대주문수량
   * @example 1
   */
  maxOrderQty: number;
  /**
   * 빵 번호 목록 (JSON 문자열 형태로 전송)
   * @example "[{"no": 1, "name": "판매빵"}, {"no": 5, "name": "출시예정빵"}]"
   */
  orderRoundBreads: any[];
  /**
   * 주문차수 이미지(선택사항)
   * @format binary
   */
  image?: File;
}

export type OrderRoundUpdateData = any;

export interface ImageDeleteBody {
  /**
   * 삭제할 이미지의 공개 ID
   * @example "breads/image123"
   */
  publicId: string;
}

export type CustomersListData = any;

export interface CustomersCreatePayload {
  /**
   * 고객 ID
   * @example "customer123"
   */
  id: string;
  /**
   * 비밀번호
   * @example "test1234!"
   */
  pw: string;
  /**
   * 고객명
   * @example "홍길동"
   */
  name: string;
  /**
   * 이메일
   * @example "test1231@naver.com"
   */
  email: string;
  /**
   * 전화번호
   * @example "010-1234-5678"
   */
  mobileNumber: string;
  /**
   * 주소
   * @example "서울시 강남구"
   */
  address: string;
  /**
   * 상세주소
   * @example "123-45"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode: string;
  /**
   * 서비스 이용약관 동의여부
   * @example true
   */
  isServiceTermsAgreed: boolean;
  /**
   * 개인정보 수집, 이용 동의여부
   * @example true
   */
  isPrivacyTermsAgreed: boolean;
  /**
   * 마케팅 정보 수신 동의여부
   * @example true
   */
  isMarketingTermsAgreed: boolean;
}

export interface CustomersCreateData {
  data: {
    /**
     * 생성된 고객 번호
     * @example 1
     */
    no: number;
    /**
     * 고객 ID
     * @example "customer123"
     */
    id: string;
    /**
     * 고객명
     * @example "홍길동"
     */
    name: string;
    /**
     * 이메일
     * @example "test1231@naver.com"
     */
    email: string;
    /**
     * 전화번호
     * @example "010-1234-5678"
     */
    mobileNumber: string;
    /**
     * 서비스 이용약관 동의여부
     * @example true
     */
    isServiceTermsAgreed: boolean;
    /**
     * 개인정보 수집, 이용 동의여부
     * @example true
     */
    isPrivacyTermsAgreed: boolean;
    /**
     * 마케팅 정보 수신 동의여부
     * @example true
     */
    isMarketingTermsAgreed: boolean;
    /**
     * 생성일시
     * @format date-time
     * @example "2024-01-01T00:00:00.000Z"
     */
    createdAt: string;
    /**
     * 수정일시
     * @format date-time
     * @example "2024-01-01T00:00:00.000Z"
     */
    updatedAt: string;
  };
  /**
   * 액세스 토큰
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
}

export interface SendEmailCreatePayload {
  /**
   * 이메일(테스트시, 실제 이메일을 작성하세요.)
   * @example "test1231@naver.com"
   */
  email: string;
}

export interface SendEmailCreateData {
  /**
   * 생성된 인증번호
   * @example 123456
   */
  code: string;
}

export interface EmailCreatePayload {
  /**
   * 이메일
   * @example "test1231@naver.com"
   */
  email: string;
}

export interface EmailCreateData {
  /**
   * 이메일
   * @example "test1231@naver.com"
   */
  email: string;
}

export interface PostCustomersPayload {
  /**
   * 이메일
   * @example "test1231@naver.com"
   */
  email: string;
}

export interface PostCustomersData {
  /**
   * 아이디
   * @example "test0000001"
   */
  id: string;
}

export interface IdEmailCreatePayload {
  /**
   * 아이디
   * @example "test000001"
   */
  id: string;
  /**
   * 이메일
   * @example "test1231@naver.com"
   */
  email: string;
}

export interface IdEmailCreateData {
  /**
   * 아이디
   * @example "test0000001"
   */
  id: string;
  /**
   * 이메일
   * @example "test1231@naver.com"
   */
  email: string;
}

export interface CompareCodeCreatePayload {
  /**
   * 입력한 인증코드
   * @example 123456
   */
  code: string;
  /**
   * 서버에서 해싱된 인증코드
   * @example "$2b$12$KB5rI6XED.9o5LHGpE3.7u8yiX32SXDSgDm/NWiZQjQOfWpq/wKqi"
   */
  hashedCode: string;
  /**
   * 사용자 아이디
   * @example "test000001"
   */
  id?: string;
  /**
   * 사용자 이메일
   * @example "test1231@naver.com"
   */
  email?: string;
}

export interface CompareCodeCreateData {
  /**
   * 인증번호 비교 결과
   * @example 200
   */
  code: string;
}

export interface CheckIdCreatePayload {
  /**
   * 아이디
   * @example "test000001"
   */
  id: string;
}

export interface CheckIdCreateData {
  /**
   * 아이디
   * @example "test000001"
   */
  id: string;
}

export type CustomersDetailData = any;

export type CustomersUpdateData = any;

export type CustomersDeleteData = any;

export type AddressListData = {
  /**
   * 주소 번호
   * @example 1
   */
  no: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo: number;
  /**
   * 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address: string;
  /**
   * 상세주소
   * @example "456동 789호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "06123"
   */
  zipcode: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 휴대폰 번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}[];

export interface AddressCreatePayload {
  /**
   * 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address: string;
  /**
   * 상세주소
   * @example "456동 789호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "06123"
   */
  zipcode: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 휴대폰 번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
  /**
   * 배송 메시지 (선택사항)
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
}

export type AddressCreateData = any;

export interface AddressDetailData {
  /**
   * 주소 번호
   * @example 1
   */
  no: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo: number;
  /**
   * 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address: string;
  /**
   * 상세주소
   * @example "456동 789호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "06123"
   */
  zipcode: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 휴대폰 번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface AddressUpdatePayload {
  /**
   * 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address: string;
  /**
   * 상세주소
   * @example "456동 789호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "06123"
   */
  zipcode: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 휴대폰 번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
  /**
   * 배송 메시지 (선택사항)
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
}

export type AddressUpdateData = any;

export type AddressDeleteData = any;

export type DeliveryMethodsListData = {
  /**
   * 배송 방법 번호
   * @example 1
   */
  no: number;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name: string;
  /**
   * 메모
   * @example "1-2일 소요"
   */
  memo?: string;
  /**
   * 배송비
   * @example 3000
   */
  fee: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive: boolean;
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType: "10" | "20" | "90";
  /**
   * 배송 타입 이름 (쿼리 파라미터가 있을 때만 포함)
   * @example "택배배송"
   */
  deliveryTypeName: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}[];

export interface DeliveryMethodsCreatePayload {
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType: "10" | "20" | "90";
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name: string;
  /**
   * 배송비
   * @example 3000
   */
  fee: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive: boolean;
}

export type DeliveryMethodsCreateData = any;

export type ActiveListData = {
  /**
   * 배송 방법 번호
   * @example 1
   */
  no: number;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name: string;
  /**
   * 메모
   * @example "1-2일 소요"
   */
  memo?: string;
  /**
   * 배송비
   * @example 3000
   */
  fee: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive: boolean;
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType: "10" | "20" | "90";
  /**
   * 배송 타입 이름
   * @example "택배배송"
   */
  deliveryTypeName: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}[];

export interface DeliveryMethodsDetailData {
  /**
   * 배송 방법 번호
   * @example 1
   */
  no: number;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name: string;
  /**
   * 메모
   * @example "1-2일 소요"
   */
  memo?: string;
  /**
   * 배송비
   * @example 3000
   */
  fee: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive: boolean;
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType: "10" | "20" | "90";
  /**
   * 배송 타입 이름
   * @example "택배배송"
   */
  deliveryTypeName: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface DeliveryMethodsUpdatePayload {
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType: "10" | "20" | "90";
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name: string;
  /**
   * 배송비
   * @example 3000
   */
  fee: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive: boolean;
}

export type DeliveryMethodsUpdateData = any;

export type DeliveryMethodsDeleteData = any;

export type CommonCodeListData = {
  /**
   * 코드 번호
   * @example 1
   */
  no: number;
  /**
   * 코드 그룹명
   * @example "delivery_type"
   */
  groupName: string;
  /**
   * 코드값
   * @example "10"
   */
  code: string;
  /**
   * 코드명
   * @example "택배"
   */
  name: string;
  /**
   * 비고
   * @example "택배 배송"
   */
  remarkTxt?: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}[];

export interface CommonCodeCreatePayload {
  /**
   * 코드값
   * @example "10"
   */
  code: string;
  /**
   * 코드 그룹명
   * @example "delivery_type"
   */
  groupName: string;
  /**
   * 코드명
   * @example "택배"
   */
  name: string;
  /**
   * 비고 (선택사항)
   * @example "1-2일 소요"
   */
  remarkTxt?: string;
}

export type CommonCodeCreateData = any;

export type CommonCodeDetailData = {
  /**
   * 코드값
   * @example "10"
   */
  code: string;
  /**
   * 코드명
   * @example "판매"
   */
  name: string;
}[];

export interface CommonCodeUpdatePayload {
  /**
   * 코드값
   * @example "10"
   */
  code: string;
  /**
   * 코드 그룹명
   * @example "delivery_type"
   */
  groupName: string;
  /**
   * 코드명
   * @example "택배"
   */
  name: string;
  /**
   * 비고 (선택사항)
   * @example "1-2일 소요"
   */
  remarkTxt?: string;
}

export type CommonCodeUpdateData = any;

export type CommonCodeDeleteData = any;

export interface CommonImagesListData {
  resources?: {
    /**
     * 이미지 공개 ID
     * @example "bread_123"
     */
    public_id?: string;
    /**
     * 이미지 URL
     * @example "https://res.cloudinary.com/example/image/upload/v1234567890/bread_123.jpg"
     */
    secure_url?: string;
    /**
     * 이미지 형식
     * @example "jpg"
     */
    format?: string;
    /**
     * 이미지 너비
     * @example 800
     */
    width?: number;
    /**
     * 이미지 높이
     * @example 600
     */
    height?: number;
    /**
     * 파일 크기 (바이트)
     * @example 123456
     */
    bytes?: number;
    /**
     * 업로드 시간
     * @format date-time
     * @example "2024-01-01T00:00:00.000Z"
     */
    created_at?: string;
  }[];
  /**
   * 허용된 요청 수
   * @example 500
   */
  rate_limit_allowed?: number;
  /**
   * 요청 제한 리셋 시간
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  rate_limit_reset_at?: string;
  /**
   * 남은 요청 수
   * @example 499
   */
  rate_limit_remaining?: number;
}

export interface UploadCreatePayload {
  /** 업로드할 이미지 파일들 */
  image: File[];
}

export type UploadCreateData = {
  /**
   * 이미지 공개 ID
   * @example "bread_123"
   */
  public_id?: string;
  /**
   * 이미지 URL
   * @example "https://res.cloudinary.com/example/image/upload/v1234567890/bread_123.jpg"
   */
  secure_url?: string;
  /**
   * 원본 파일명
   * @example "croissant.jpg"
   */
  original_filename?: string;
  /**
   * 이미지 형식
   * @example "jpg"
   */
  format?: string;
  /**
   * 이미지 너비
   * @example 800
   */
  width?: number;
  /**
   * 이미지 높이
   * @example 600
   */
  height?: number;
  /**
   * 파일 크기 (바이트)
   * @example 123456
   */
  bytes?: number;
}[];

export interface DeleteDeletePayload {
  /**
   * 삭제할 이미지들의 public ID 배열
   * @example ["bread_123","bread_456"]
   */
  publicIds: string[];
}

export type DeleteDeleteData = any;

export type PaymentsListData = {
  /**
   * 결제 no
   * @example 1
   */
  no: number;
  /**
   * 주문 no
   * @example 1
   */
  orderNo: number;
  /**
   * 결제 완료 여부
   * @example false
   */
  isPaid: boolean;
  /**
   * 결제 생성일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  orderedAt: string;
  /**
   * 입금 확인 일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  paidConfirmedAt?: string;
  /**
   * 환불 여부
   * @example false
   */
  isRefunded: boolean;
  /**
   * 환불 요청 일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  refundRequestedAt?: string;
  /**
   * 환불 확인 일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  refundConfirmedAt?: string;
  /**
   * 은행 코드
   * @example "004"
   */
  bankCode: string;
  /**
   * 계좌번호
   * @example "123-456-7890"
   */
  accountNumber: string;
  /**
   * 예금주명
   * @example "홍길동"
   */
  accountHolderName: string;
  /**
   * 은행 코드명
   * @example "빵은행"
   */
  bankCodeName: string;
  /**
   * 결제 생성일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  createdAt: string;
  /**
   * 결제 수정일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  updatedAt: string;
  /** 주문 정보 */
  order: {
    /**
     * 주문 번호
     * @example 4
     */
    no: number;
    /**
     * 주문 총 금액
     * @example 6000
     */
    totalPrice: number;
    /**
     * 주문 상태
     * @example "50"
     */
    orderStatus: string;
    /**
     * 주문 상태 이름
     * @example "접수요청"
     */
    orderStatusName: string;
    /**
     * 주문번호
     * @example "ORD-20250811-99468690"
     */
    orderNumber?: string;
  };
}[];

export interface PaymentsDetailData {
  /**
   * 결제 no
   * @example 1
   */
  no: number;
  /**
   * 주문 no
   * @example 1
   */
  orderNo: number;
  /**
   * 결제 완료 여부
   * @example false
   */
  isPaid: boolean;
  /**
   * 결제 생성일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  orderedAt: string;
  /**
   * 입금 확인 일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  paidConfirmedAt?: string;
  /**
   * 환불 여부
   * @example false
   */
  isRefunded: boolean;
  /**
   * 환불 요청 일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  refundRequestedAt?: string;
  /**
   * 환불 확인 일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  refundConfirmedAt?: string;
  /**
   * 은행 코드
   * @example "004"
   */
  bankCode: string;
  /**
   * 계좌번호
   * @example "123-456-7890"
   */
  accountNumber: string;
  /**
   * 예금주명
   * @example "홍길동"
   */
  accountHolderName: string;
  /**
   * 은행 코드명
   * @example "빵은행"
   */
  bankCodeName: string;
  /**
   * 결제 생성일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  createdAt: string;
  /**
   * 결제 수정일시
   * @format date-time
   * @example "2024-06-22T12:34:56.000Z"
   */
  updatedAt: string;
}

export interface PaidUpdatePayload {
  /**
   * 입금 확인 여부
   * @example true
   */
  isPaid: boolean;
  /**
   * 주문 번호
   * @example 1
   */
  orderNo: number;
}

export type PaidUpdateData = any;

export interface RefundUpdatePayload {
  /**
   * 환불 확인 여부
   * @example true
   */
  isRefunded: boolean;
  /**
   * 주문 번호
   * @example 1
   */
  orderNo: number;
}

export type RefundUpdateData = any;

export interface GetMyData {
  customer: {
    /**
     * 고객 번호
     * @example 1
     */
    no: number;
    /**
     * 고객 ID
     * @example "customer123"
     */
    id: string;
    /**
     * 고객명
     * @example "홍길동"
     */
    name: string;
    /**
     * 전화번호
     * @example "010-1234-5678"
     */
    mobileNumber: string;
    /**
     * 기본 배송지 번호
     * @example 1
     */
    defaultAddressNo: number;
    /**
     * 생성일시
     * @format date-time
     * @example "2024-01-01T00:00:00.000Z"
     */
    createdAt: string;
    /** 배송지 목록 */
    address: {
      /**
       * 배송지 번호
       * @example 1
       */
      no?: number;
      /**
       * 주소
       * @example "서울시 강남구"
       */
      address?: string;
      /**
       * 상세주소
       * @example "123-45"
       */
      addressDetail?: string;
    }[];
    /** 고객 쿠폰 목록 */
    customerCoupon: {
      /**
       * 고객 쿠폰 번호
       * @example 1
       */
      no?: number;
      coupon?: {
        /**
         * 쿠폰명
         * @example "첫 로그인 쿠폰"
         */
        name?: string;
        /**
         * 할인 금액
         * @example 3000
         */
        amount?: number;
      };
    }[];
  };
  /** 할인 정보 */
  coupon: {
    /**
     * 고객 쿠폰 번호
     * @example 1
     */
    no?: number;
    coupon?: {
      /**
       * 쿠폰명
       * @example "첫 로그인 쿠폰"
       */
      name?: string;
      /**
       * 할인 금액
       * @example 3000
       */
      amount?: number;
    };
  }[];
  /**
   * 주문 누적 금액
   * @example 150000
   */
  totalAmount: number;
}

export interface UpdateMyProfilePayload {
  /**
   * 고객명
   * @example "홍길동"
   */
  name?: string;
  /**
   * 전화번호
   * @example "010-1234-5678"
   */
  mobileNumber?: string;
}

export interface UpdateMyProfileData {
  /**
   * 고객 번호
   * @example 1
   */
  no: number;
  /**
   * 고객 ID
   * @example "customer123"
   */
  id: string;
  /**
   * 고객명
   * @example "홍길동"
   */
  name: string;
  /**
   * 전화번호
   * @example "010-1234-5678"
   */
  mobileNumber: string;
  /**
   * 비밀번호 (해시된 값)
   * @example "hashedPassword123"
   */
  pw: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export interface UpdateMyPasswordPayload {
  /**
   * 현재 비밀번호
   * @example "old1234!"
   */
  pw: string;
  /**
   * 새로운 비밀번호
   * @example "new1234!"
   */
  pwModify: string;
}

export interface UpdateMyPasswordData {
  /**
   * 성공 메시지
   * @example "비밀번호가 변경되었습니다."
   */
  message?: string;
}

export type AddressesListData = {
  /**
   * 배송지 번호
   * @example 1
   */
  no: number;
  /**
   * 주소
   * @example "서울시 강남구 역삼동 123-456"
   */
  address: string;
  /**
   * 상세 주소
   * @example "101동 101호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode: string;
  /**
   * 메시지
   * @example "문 앞에 놓아주세요."
   */
  message: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 전화번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
  /**
   * 기본 배송지 여부
   * @example true
   */
  isDefault: boolean;
}[];

export type AddressesCreatePayload = object;

export type AddressesCreateData = any;

export interface AddressesDetailData {
  /**
   * 배송지 번호
   * @example 1
   */
  no: number;
  /**
   * 주소
   * @example "서울시 강남구 역삼동 123-456"
   */
  address: string;
  /**
   * 상세 주소
   * @example "101동 101호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode: string;
  /**
   * 메시지
   * @example "문 앞에 놓아주세요."
   */
  message: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 전화번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
  /**
   * 기본 배송지 여부
   * @example true
   */
  isDefault: boolean;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}

export type AddressesUpdatePayload = object;

export type AddressesUpdateData = any;

export type AddressesDeleteData = any;

export type OrdersListResult = {
  /**
   * 주문 번호
   * @example 1
   */
  no: number;
  /**
   * 주문 번호
   * @example "ORD20240825001"
   */
  orderNumber: string;
  /**
   * 주문 상태 코드
   * @example "10"
   */
  orderStatus: string;
  /**
   * 주문 상태명
   * @example "결제완료"
   */
  orderStatusName: string;
  /**
   * 주문 생성일시
   * @format date-time
   * @example "2024-08-25T15:55:20.000Z"
   */
  createdAt: string;
  orderItems: {
    /**
     * 주문 아이템 번호
     * @example 1
     */
    no?: number;
    /**
     * 상품명
     * @example "식빵"
     */
    breadName?: string;
    /**
     * 상품 이미지 URL
     * @example "https://example.com/bread.jpg"
     */
    breadImageUrl?: string;
    /**
     * 단가
     * @example 3000
     */
    unitPrice?: number;
    /**
     * 수량
     * @example 2
     */
    quantity?: number;
  }[];
}[];

export interface OrdersDetailResult {
  /** @example 1 */
  no: number;
  /** @example "ORD20240825001" */
  orderNumber: string;
  /** @example "10" */
  orderStatus: string;
  /** @example "결제완료" */
  orderStatusName: string;
  /**
   * @format date-time
   * @example "2024-08-25T15:55:20.000Z"
   */
  createdAt: string;
  /** @example 15000 */
  totalPrice: number;
  /** @example 3000 */
  deliveryMethodFee?: number;
  /** @example 2000 */
  discountAmount?: number;
  /** @example "서울시 강남구 역삼동 123-456" */
  address: string;
  /** @example "101동 101호" */
  addressDetail?: string;
  /** @example "12345" */
  zipcode?: string;
  /** @example "문 앞에 놓아주세요." */
  message?: string;
  /** @example "홍길동" */
  recipientName?: string;
  /** @example "010-1234-5678" */
  recipientMobile?: string;
  /** @example "홍길동" */
  ordererName?: string;
  /** @example "010-1234-5678" */
  ordererMobile?: string;
  /** @example "01" */
  deliveryTypeCode?: string;
  orderItems: {
    /** @example 1 */
    no?: number;
    /** @example "식빵" */
    breadName?: string;
    /** @example "https://example.com/bread.jpg" */
    breadImageUrl?: string;
    /** @example 3000 */
    unitPrice?: number;
    /** @example 6000 */
    totalPrice?: number;
    /** @example 2 */
    quantity?: number;
  }[];
}

export interface OrdersCancelPartialUpdatePayload {
  /**
   * 취소 사유
   * @example "주문 취소 요청"
   */
  canceledReason: string;
}

export type OrdersCancelPartialUpdateData = any;

export interface OrdersDeliveryListData {
  /** @example 1 */
  no?: number;
  /** @example "ORD20240825001" */
  orderNumber?: string;
  /** @example "20" */
  orderStatus?: string;
  /** @example "배송중" */
  orderStatusName?: string;
  /**
   * @format date-time
   * @example "2024-08-25T15:55:20.000Z"
   */
  createdAt?: string;
  /** @example "TRK1234567890" */
  trackingNumber?: string;
  orderItems?: {
    /** @example 1 */
    no?: number;
    /** @example "식빵" */
    breadName?: string;
    /** @example "https://example.com/bread.jpg" */
    breadImageUrl?: string;
    /** @example 3000 */
    unitPrice?: number;
    /** @example 2 */
    quantity?: number;
  }[];
  /** @example "서울시 강남구 역삼동 123-456" */
  address?: string;
  /** @example "101동 101호" */
  addressDetail?: string;
  /** @example "12345" */
  zipcode?: string;
  /** @example "홍길동" */
  recipientName?: string;
  /** @example "010-1234-5678" */
  recipientMobile?: string;
  /** @example "택배" */
  deliveryMethodName?: string;
  /** @example "01" */
  deliveryTypeCode?: string;
}

export interface OrdersAddressListData {
  /**
   * 주소
   * @example "서울시 강남구 역삼동 123-456"
   */
  address: string;
  /**
   * 상세 주소
   * @example "101동 101호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요."
   */
  message: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 전화번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
}

export interface OrdersAddressUpdatePayload {
  /**
   * 주소
   * @example "서울시 강남구 역삼동 123-456"
   */
  address: string;
  /**
   * 상세 주소
   * @example "101동 101호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요."
   */
  message: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 전화번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
}

export interface OrdersAddressUpdateData {
  /**
   * 주소
   * @example "서울시 강남구 역삼동 123-456"
   */
  address: string;
  /**
   * 상세 주소
   * @example "101동 101호"
   */
  addressDetail: string;
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요."
   */
  message: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName: string;
  /**
   * 수령인 전화번호
   * @example "010-1234-5678"
   */
  recipientMobile: string;
}

export type CouponsListData = {
  /**
   * 고객-쿠폰 번호
   * @example 1
   */
  no: number;
  /**
   * 쿠폰 발급일
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  issuedAt: string;
  /**
   * 쿠폰 만료일
   * @format date-time
   * @example "2024-01-31T00:00:00.000Z"
   */
  expiredAt: string;
  /**
   * 사용여부
   * @example false
   */
  isUsed: boolean;
  /**
   * 만료여부
   * @example false
   */
  isExpired: boolean;
  coupon: {
    /**
     * 쿠폰번호
     * @example 1
     */
    no: number;
    /**
     * 쿠폰명
     * @example "회원가입 쿠폰"
     */
    name: string;
    /**
     * 할인금액
     * @example 10000
     */
    amount: string;
  };
}[];

export type CouponsListResult = {
  /**
   * 쿠폰 번호
   * @example 1
   */
  no: number;
  /**
   * 쿠폰명
   * @example "첫 로그인 쿠폰"
   */
  name: string;
  /**
   * 할인 금액 (원)
   * @example 3000
   */
  amount: number;
  /**
   * 발급일 기준 만료일
   * @example 30
   */
  expireAfterDays: number;
  /**
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
}[];

export interface CouponsCreatePayload {
  /**
   * 쿠폰명
   * @example "신규 가입 쿠폰"
   */
  name: string;
  /**
   * 할인 금액 (원)
   * @example 5000
   */
  amount: number;
  /**
   * 발급일 기준 만료일
   * @example 60
   */
  expireAfterDays: number;
}

export interface CouponsCreateData {
  /**
   * 성공 메시지
   * @example "쿠폰이 생성되었습니다."
   */
  message?: string;
}

export interface CouponsDetailData {
  /**
   * 쿠폰 번호
   * @example 1
   */
  no: number;
  /**
   * 쿠폰명
   * @example "첫 로그인 쿠폰"
   */
  name: string;
  /**
   * 할인 금액 (원)
   * @example 3000
   */
  amount: number;
  /**
   * 발급일 기준 만료일
   * @example 30
   */
  expireAfterDays: number;
  /**
   * 수정 불가 여부
   * @example true
   */
  isRestricted: boolean;
}

export interface CouponsUpdatePayload {
  /**
   * 쿠폰명
   * @example "수정된 쿠폰명"
   */
  name?: string;
  /**
   * 할인 금액 (원)
   * @example 5000
   */
  amount?: number;
  /**
   * 발급일 기준 만료일
   * @example 60
   */
  expireAfterDays?: number;
}

export interface CouponsUpdateData {
  /**
   * 성공 메시지
   * @example "쿠폰이 수정되었습니다."
   */
  message?: string;
}

export interface CouponsDeleteData {
  /**
   * 성공 메시지
   * @example "쿠폰이 삭제되었습니다."
   */
  message?: string;
}

export interface IssueCreatePayload {
  /**
   * 쿠폰을 발급받을 고객 번호 배열
   * @example [1,2,3]
   */
  noList: number[];
}

export interface IssueCreateData {
  /**
   * 성공 메시지
   * @example "쿠폰이 발급되었습니다"
   */
  message: string;
}

export type IssueCreateError = {
  /**
   * 에러 메시지
   * @example "고객번호는 필수입니다"
   */
  error?: string;
};
