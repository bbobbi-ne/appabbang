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

export type AddressListData = {
  /**
   * 주소 번호
   * @example 1
   */
  no?: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo?: number;
  /**
   * 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address?: string;
  /**
   * 상세주소
   * @example "456동 789호"
   */
  addressDetail?: string;
  /**
   * 우편번호
   * @example "06123"
   */
  zipcode?: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName?: string;
  /**
   * 수령인 휴대폰 번호
   * @example "010-1234-5678"
   */
  recipientMobile?: string;
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
  createdAt?: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt?: string;
}[];

export interface AddressCreatePayload {
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
   * 배송 메시지 (선택사항)
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
}

export interface AddressCreateData {
  /**
   * 생성된 주소 번호
   * @example 1
   */
  no?: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo?: number;
  /**
   * 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address?: string;
  /**
   * 상세주소
   * @example "456동 789호"
   */
  addressDetail?: string;
  /**
   * 우편번호
   * @example "06123"
   */
  zipcode?: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName?: string;
  /**
   * 수령인 휴대폰 번호
   * @example "010-1234-5678"
   */
  recipientMobile?: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
}

export type AddressCreateError = {
  /** @example "Internal server error" */
  message?: string;
};

export interface AddressDetailData {
  /**
   * 주소 번호
   * @example 1
   */
  no?: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo?: number;
  /**
   * 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address?: string;
  /**
   * 상세주소
   * @example "456동 789호"
   */
  addressDetail?: string;
  /**
   * 우편번호
   * @example "06123"
   */
  zipcode?: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName?: string;
  /**
   * 수령인 휴대폰 번호
   * @example "010-1234-5678"
   */
  recipientMobile?: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
}

export type AddressDetailError =
  | {
      /** @example "Address no is required" */
      message?: string;
    }
  | {
      /** @example "Address not found" */
      message?: string;
    };

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

export interface AddressUpdateData {
  /**
   * 주소 번호
   * @example 1
   */
  no?: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo?: number;
  /**
   * 주소
   * @example "서울시 강남구 테헤란로 123"
   */
  address?: string;
  /**
   * 상세주소
   * @example "456동 789호"
   */
  addressDetail?: string;
  /**
   * 우편번호
   * @example "06123"
   */
  zipcode?: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName?: string;
  /**
   * 수령인 휴대폰 번호
   * @example "010-1234-5678"
   */
  recipientMobile?: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
}

export type AddressUpdateError =
  | {
      /** @example "Address no is required" */
      message?: string;
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

export interface AddressDeleteData {
  /** @example "Address deleted successfully" */
  message?: string;
}

export type AddressDeleteError =
  | {
      /** @example "Address no is required" */
      message?: string;
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

export interface LoginCreatePayload {
  /**
   * 사용자 ID
   * @example "admin"
   */
  id: string;
  /**
   * 비밀번호
   * @example "password123"
   */
  pw: string;
}

export interface LoginCreateData {
  /**
   * 액세스 토큰
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken?: string;
}

export type LoginCreateError =
  | {
      /** @example "Invalid credentials" */
      message?: string;
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

export interface GetAuthData {
  /**
   * 사용자 ID
   * @example "admin"
   */
  id?: string;
  /**
   * 사용자 이름
   * @example "관리자"
   */
  name?: string;
  /**
   * 사용자 역할 (10-관리자, 20-일반사용자)
   * @example "10"
   */
  userRole?: string;
}

export type GetAuthError =
  | {
      /** @example "Unauthorized" */
      message?: string;
    }
  | {
      /** @example "User not found" */
      message?: string;
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

export interface RefreshCreateData {
  /**
   * 새로운 액세스 토큰
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken?: string;
}

export type RefreshCreateError =
  | {
      /** @example "Refresh token missing" */
      message?: string;
    }
  | {
      /** @example "Invalid refresh token" */
      message?: string;
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

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
  breadStatus: '10' | '20' | '30' | '40' | '50';
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
  createdAt: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
  images: {
    /**
     * 이미지 URL
     * @example "https://example.com/image.jpg"
     */
    url: string;
  }[];
}[];

export type BreadsListError =
  | {
      /** @example "Unauthorized" */
      message?: string;
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

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
  breadStatus: '10' | '20' | '30' | '40' | '50';
  /** 빵 이미지 (선택사항) */
  image?: File[];
}

export interface BreadsCreateData {
  /**
   * 생성된 빵 번호
   * @example 1
   */
  no?: number;
  /**
   * 빵 이름
   * @example "크로아상"
   */
  name?: string;
  /**
   * 빵 설명
   * @example "바삭한 크로아상"
   */
  description?: string;
  /**
   * 단가
   * @example 3000
   */
  unitPrice?: number;
  /**
   * 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus?: string;
}

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
  breadStatus: string;
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
  images: {
    /**
     * 이미지 공개 ID
     * @example "bread_123"
     */
    publicId: string;
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

export type BreadsDetailError =
  | {
      /** @example "no는 필수입니다." */
      message?: string;
      details?: {
        /** @example "no" */
        param?: string;
      };
    }
  | {
      /** @example "Unauthorized" */
      message?: string;
    }
  | {
      /** @example "빵을 찾을 수 없습니다." */
      message?: string;
      details?: {
        /** @example 999 */
        breadNo?: number;
      };
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

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
  breadStatus: '10' | '20' | '30' | '40' | '50';
  /** 빵 이미지 (선택사항) */
  image?: File[];
}

export interface BreadsUpdateData {
  /**
   * 빵 번호
   * @example 1
   */
  no?: number;
  /**
   * 빵 이름
   * @example "크로아상"
   */
  name?: string;
  /**
   * 빵 설명
   * @example "바삭한 크로아상"
   */
  description?: string;
  /**
   * 단가
   * @example 3000
   */
  unitPrice?: number;
  /**
   * 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus?: string;
}

export interface StatusUpdatePayload {
  /**
   * 변경할 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus: '10' | '20' | '30' | '40' | '50';
}

export interface StatusUpdateData {
  /**
   * 빵 번호
   * @example 1
   */
  no?: number;
  /**
   * 변경된 빵 상태 (10-판매, 20-미판매, 30-임시저장, 40-재료소진, 50-출시예정)
   * @example "10"
   */
  breadStatus?: string;
}

export interface ImageDeletePayload {
  /**
   * 삭제할 이미지의 공개 ID
   * @example "breads/image123"
   */
  no: number;
  publicId: string;
}

export type ImageDeleteData = any;

export type CommonCodeListData = {
  /**
   * 코드 번호
   * @example 1
   */
  no?: number;
  /**
   * 코드 그룹명
   * @example "delivery_type"
   */
  groupName?: string;
  /**
   * 코드값
   * @example "10"
   */
  code?: string;
  /**
   * 코드명
   * @example "택배"
   */
  name?: string;
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
  createdAt?: string;
  /**
   * 수정일시
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt?: string;
}[];

export type CommonCodeListError = {
  /** @example "Internal server error" */
  message?: string;
};

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
   * @example "택배"
   */
  name: string;
}[];

export type CommonCodeDetailError =
  | {
      /** @example "'INVALID_GROUP'은(는) 유효하지 않은 코드 그룹입니다. (그룹명: bread_status, user_role, material_type, order_status, purchase_status, delivery_type)" */
      message?: string;
      details?: {
        /** @example "INVALID_GROUP" */
        invalidGroupName?: string;
        /** @example ["bread_status","user_role","delivery_type"] */
        validGroupNames?: string[];
      };
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

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

export type CommonCodeUpdateError = {
  /** @example "no 는 필수입니다" */
  message?: string;
};

export type CommonCodeDeleteData = any;

export type CommonCodeDeleteError = {
  /** @example "no 는 필수입니다" */
  message?: string;
};

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

export type CommonImagesListError = {
  /** @example "Internal server error" */
  message?: string;
};

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

export type UploadCreateError =
  | {
      /** @example "이미지를 업로드해주세요." */
      message?: string;
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

export interface DeleteDeletePayload {
  /**
   * 삭제할 이미지들의 public ID 배열
   * @example ["bread_123","bread_456"]
   */
  publicIds: string[];
}

export type DeleteDeleteData = any;

export type DeleteDeleteError =
  | {
      /** @example "publicIds 배열이 필요합니다." */
      message?: string;
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

export type DeliveryMethodsListData = {
  /**
   * 배송 방법 번호
   * @example 1
   */
  no?: number;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name?: string;
  /**
   * 메모
   * @example "1-2일 소요"
   */
  memo?: string;
  /**
   * 배송비
   * @example 3000
   */
  fee?: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive?: boolean;
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType?: string;
  /**
   * 배송 타입 이름 (쿼리 파라미터가 있을 때만 포함)
   * @example "택배배송"
   */
  deliveryTypeName?: string;
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
}[];

export type DeliveryMethodsListError = {
  /** @example "Internal server error" */
  message?: string;
};

export interface DeliveryMethodsCreatePayload {
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType: string;
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

export interface DeliveryMethodsCreateData {
  /**
   * 생성된 배송 방법 번호
   * @example 1
   */
  no?: number;
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType?: string;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name?: string;
  /**
   * 배송비
   * @example 3000
   */
  fee?: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive?: boolean;
}

export type ActiveListData = {
  /**
   * 배송 방법 번호
   * @example 1
   */
  no?: number;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name?: string;
  /**
   * 메모
   * @example "1-2일 소요"
   */
  memo?: string;
  /**
   * 배송비
   * @example 3000
   */
  fee?: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive?: boolean;
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType?: string;
  /**
   * 배송 타입 이름
   * @example "택배배송"
   */
  deliveryTypeName?: string;
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
}[];

export type ActiveListError = {
  /** @example "Internal server error" */
  message?: string;
};

export interface DeliveryMethodsDetailData {
  /**
   * 배송 방법 번호
   * @example 1
   */
  no?: number;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name?: string;
  /**
   * 메모
   * @example "1-2일 소요"
   */
  memo?: string;
  /**
   * 배송비
   * @example 3000
   */
  fee?: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive?: boolean;
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType?: string;
  /**
   * 배송 타입 이름
   * @example "택배배송"
   */
  deliveryTypeName?: string;
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
}

export type DeliveryMethodsDetailError =
  | {
      /** @example "배송 방법을 찾을 수 없습니다." */
      message?: string;
      details?: {
        /** @example 999 */
        deliveryMethodNo?: number;
      };
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

export interface DeliveryMethodsUpdatePayload {
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType: string;
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

export interface DeliveryMethodsUpdateData {
  /**
   * 배송 방법 번호
   * @example 1
   */
  no?: number;
  /**
   * 배송 타입 (10-택배배송, 20-직접수령, 90-기타)
   * @example "10"
   */
  deliveryType?: string;
  /**
   * 배송 방법 이름
   * @example "우체국"
   */
  name?: string;
  /**
   * 배송비
   * @example 3000
   */
  fee?: number;
  /**
   * 활성화 여부
   * @example true
   */
  isActive?: boolean;
}

export type DeliveryMethodsDeleteData = any;

export type OrdersListData = {
  /**
   * 주문 번호
   * @example 1
   */
  no?: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo?: number;
  /**
   * 주소 번호
   * @example 1
   */
  addressNo?: number;
  /**
   * 배송 방법 번호
   * @example 1
   */
  deliveryMethodNo?: number;
  /**
   * 주문 날짜
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  orderDate?: string;
  /**
   * 배송 날짜
   * @format date-time
   * @example "2024-01-16T10:30:00Z"
   */
  deliveryDate?: string;
  /**
   * 주문 상태 (10-접수됨, 20-제조중, 30-배송중, 40-완료, 50-취소됨)
   * @example "10"
   */
  status?: string;
  /**
   * 총 금액
   * @example 25000
   */
  totalAmount?: number;
}[];

export interface OrdersCreatePayload {
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
   * 배송 방법 번호
   * @example 1
   */
  deliveryMethodNo: number;
  /**
   * 주문 비밀번호
   * @example "1234"
   */
  orderPw: string;
  /**
   * 총 주문 금액
   * @example 15000
   */
  totalPrice: number;
}

export interface OrdersCreateData {
  /**
   * 주문번호
   * @example "ORD-20240622-12345678"
   */
  orderNumber?: string;
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
  /**
   * 우편번호
   * @example "12345"
   */
  zipcode?: string;
  /**
   * 배송 메시지
   * @example "문 앞에 놓아주세요"
   */
  message?: string;
  /**
   * 수령인 이름
   * @example "홍길동"
   */
  recipientName?: string;
  /**
   * 수령인 전화번호
   * @example "010-1234-5678"
   */
  recipientMobile?: string;
  orderItems?: {
    /**
     * 빵 번호
     * @example 1
     */
    breadNo?: number;
    /**
     * 수량
     * @example 2
     */
    quantity?: number;
  }[];
  /**
   * 배송 방법 번호
   * @example 1
   */
  deliveryMethodNo?: number;
  /**
   * 주문 비밀번호 (해시된 값)
   * @example "$2b$10$..."
   */
  orderPw?: string;
  /**
   * 총 주문 금액
   * @example 15000
   */
  totalPrice?: number;
}

export type OrdersCreateError =
  | {
      /** @example "주문 금액이 일치하지 않습니다." */
      message?: string;
      details?: {
        /** @example 15000 */
        expectedTotal?: number;
        /** @example 14000 */
        receivedTotal?: number;
        /** @example 16000 */
        originalPrice?: number;
        /** @example 1000 */
        discountAmount?: number;
        /** @example 0 */
        deliveryFee?: number;
      };
    }
  | {
      /** @example "Internal server error" */
      message?: string;
    };

export interface OrdersDetailData {
  /**
   * 주문 번호
   * @example 1
   */
  no?: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo?: number;
  /**
   * 주소 번호
   * @example 1
   */
  addressNo?: number;
  /**
   * 배송 방법 번호
   * @example 1
   */
  deliveryMethodNo?: number;
  /**
   * 주문 날짜
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  orderDate?: string;
  /**
   * 배송 날짜
   * @format date-time
   * @example "2024-01-16T10:30:00Z"
   */
  deliveryDate?: string;
  /**
   * 주문 상태 (10-접수됨, 20-제조중, 30-배송중, 40-완료, 50-취소됨)
   * @example "10"
   */
  status?: string;
  /**
   * 총 금액
   * @example 25000
   */
  totalAmount?: number;
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

export interface OrdersUpdateData {
  /**
   * 주문 번호
   * @example 1
   */
  no?: number;
  /**
   * 고객 번호
   * @example 1
   */
  customerNo?: number;
  /**
   * 주소 번호
   * @example 1
   */
  addressNo?: number;
  /**
   * 배송 방법 번호
   * @example 1
   */
  deliveryMethodNo?: number;
  /**
   * 주문 날짜
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  orderDate?: string;
  /**
   * 배송 날짜
   * @format date-time
   * @example "2024-01-16T10:30:00Z"
   */
  deliveryDate?: string;
  /**
   * 주문 상태 (10-접수됨, 20-제조중, 30-배송중, 40-완료, 50-취소됨)
   * @example "10"
   */
  status?: string;
  /**
   * 총 금액
   * @example 25000
   */
  totalAmount?: number;
}

export type OrdersDeleteData = any;

/** @example "Hello World" */
export type SampleListData = string;

export type SampleListError = {
  /** @example "Internal server error" */
  message?: string;
};

export interface SampleCreatePayload {
  /**
   * 샘플 이름
   * @example "샘플 데이터"
   */
  name?: string;
}

/** @example "Hello World" */
export type SampleCreateData = string;

export type SampleCreateError = {
  /** @example "Internal server error" */
  message?: string;
};

/** @example "Hello World" */
export type GetSampleData = string;

export type GetSampleError = {
  /** @example "Internal server error" */
  message?: string;
};

/** @example "Hello World" */
export type SampleDetailData = string;

export type SampleDetailError = {
  /** @example "Internal server error" */
  message?: string;
};

export interface SampleUpdatePayload {
  /**
   * 샘플 이름
   * @example "수정된 샘플 데이터"
   */
  name?: string;
}

/** @example "Hello World" */
export type SampleUpdateData = string;

export type SampleUpdateError = {
  /** @example "Internal server error" */
  message?: string;
};

/** @example "Hello World" */
export type SampleDeleteData = string;

export type SampleDeleteError = {
  /** @example "Internal server error" */
  message?: string;
};
