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
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt?: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt?: string;
  images: {
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url?: string;
  }[];
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
   * 생성일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt?: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt?: string;
  images: {
    /**
     * 이미지 공개 ID
     * @example "bread_123"
     */
    publicId?: string;
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url: string;
    /**
     * 원본 파일명
     * @example "croissant.jpg"
     */
    name: string;
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
   * 주문 상태 (10-접수됨, 20-제조중, 30-배송중, 40-완료, 50-취소됨)
   * @example "10"
   */
  orderStatus: "10" | "20" | "30" | "40" | "50";
  /**
   * 주문 상태명
   * @example "접수됨"
   */
  orderStatusName: string;
  /**
   * 총 주문 금액
   * @example 15000
   */
  totalPrice: number;
  /**
   * 결제 여부
   * @example false
   */
  paid: boolean;
  /**
   * 운송장 번호
   * @example "123456789"
   */
  trackingNumber?: string;
  /**
   * 주문 취소 일시
   * @format date-time
   * @example null
   */
  canceledAt?: string | null;
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
  /** 주문자 정보 */
  customer: {
    /**
     * 고객 번호
     * @example 1
     */
    no: number;
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
  };
  /** 배송지 정보 */
  address: {
    /**
     * 주소 번호
     * @example 1
     */
    no: number;
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
    message?: string;
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
  };
  /** 배송 방법 정보 */
  deliveryMethod: {
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
  };
}[];

/**
 * [필수값 안내]
 * - 비회원 주문: name, mobileNumber, address, addressDetail, zipcode, recipientName, recipientMobile, orderItems, deliveryMethodNo, orderPw, totalPrice, discountAmount
 * - 회원 주문: orderItems, addressNo, deliveryMethodNo, totalPrice, discountAmount
 * - 할인 적용 시: discountNo
 * (상세 예시는 아래 examples 참고)
 */
export interface OrdersCreatePayload {
  /** 고객명 */
  name?: string;
  /** 전화번호 */
  mobileNumber?: string;
  /** 주소 */
  address?: string;
  /** 상세주소 */
  addressDetail?: string;
  /** 우편번호 */
  zipcode?: string;
  /** 배송 메시지 */
  message?: string;
  /** 수령인 이름 */
  recipientName?: string;
  /** 수령인 전화번호 */
  recipientMobile?: string;
  orderItems?: {
    /** 빵 번호 */
    breadNo?: number;
    /** 수량 */
    quantity?: number;
  }[];
  /** 배송 방법 번호 */
  deliveryMethodNo?: number;
  /** 주문 비밀번호 */
  orderPw?: string;
  /** 총 주문 금액 */
  totalPrice?: number;
  /** 할인 번호 */
  discountNo?: number;
  /** 할인 금액 */
  discountAmount?: number;
  /** 회원 번호 */
  customerNo?: number;
  /** 회원 주소 번호 */
  addressNo?: number;
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
   * 주문 상태 (10-접수됨, 20-제조중, 30-배송중, 40-완료, 50-취소됨)
   * @example "10"
   */
  orderStatus: "10" | "20" | "30" | "40" | "50";
  /**
   * 총 주문 금액
   * @example 15000
   */
  totalPrice: number;
  /**
   * 결제 여부
   * @example false
   */
  paid: boolean;
  /**
   * 운송장 번호
   * @example "123456789"
   */
  trackingNumber?: string;
  /**
   * 주문 취소 일시
   * @format date-time
   * @example null
   */
  canceledAt?: string | null;
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
  orderItem: {
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
     * 할인 금액
     * @example 0
     */
    discountAmount?: number;
    bread: {
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
    };
  }[];
  /** 주문자 정보 */
  customer: {
    /**
     * 고객 번호
     * @example 1
     */
    no: number;
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
  };
  /** 배송지 정보 */
  address: {
    /**
     * 주소 번호
     * @example 1
     */
    no: number;
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
    message?: string;
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
  };
  /** 배송 방법 정보 */
  deliveryMethod: {
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
     * 배송비
     * @example 3000
     */
    fee: number;
  };
}

export interface OrdersUpdatePayload {
  /**
   * 주소 번호
   * @example 1
   */
  addressNo: number;
  /**
   * 배송 방법 번호
   * @example 1
   */
  deliveryMethodNo: number;
  /**
   * 배송 날짜
   * @format date-time
   * @example "2024-01-16T10:30:00Z"
   */
  deliveryDate: string;
  /**
   * 총 금액
   * @example 25000
   */
  totalAmount: number;
}

export type OrdersUpdateData = any;

export type OrdersDeleteData = any;

export type CustomersListData = any;

export type CustomersCreateData = any;

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
