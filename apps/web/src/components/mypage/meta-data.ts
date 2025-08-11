/**
 * 임시데이터 모음
 * DB데이터와 연동하면 해당 페이지는 삭제해도 됨
 */

export const orders = [
  {
    no: 1, // 주문번호
    orderNumber: 'ORD-20250723-0000103', // 주문번호(채번)
    orderStatus: '10', // 주문상태
    totalPrice: 68000, // 총 금액
    orderPw: '1234', // 주문 비밀번호(비회원)
    memo: '주문 메모입니다.', // 메모
    trackingNumber: '1-11-12345', // 송장번호
    canceledAt: null, // 주문취소일시

    ordererName: '김가나', // 주문인
    ordererMobile: '010-1234-5656', // 주문인 휴대번호
    recipientName: '김두울', // 수령인
    recipientMobile: '010-1234-5555', // 수령인 휴대번호
    address: '경기도 성남시 수정구 신흥1동', // 주소
    addressDetail: '6729번지 2층', // 상세주소
    zipcode: '68072', // 우편번호
    message: '배송 잘 부탁드립니다~!', // 배송메세지
    deliveryMethodName: '우체국', // 베송타입명
    deliveryMethodFee: 4000, // 배송비
    discountAmount: null, // 할인금액

    orderRoundNo: 1, // 주문차수 번호

    isPaymentRefundTermsAgreed: true, // 결제, 환불 약관 동의여부
    isServiceTermsAgreed: true, // 서비스 이용약관 동의여부
    isPrivacyTermsAgreed: true, // 개인정보 수집, 이용 동의 여부
    isMarketingTermsAgreed: true, // 마케팅 목적 개인정보 이용 및 광고 수신 동의 여부
    createdAt: '2025-01-09T07:13:12.306Z', // 등록일시

    orderItem: [
      // 주문목록
      {
        no: 1, // 주문목록 번호
        breadName: '스마일 도넛빵', // 빵 이름
        breadImageUrl: '../../../public/../../../public/images/smail_sinker.png', // 빵 이미지
        quantity: 20, // 수량
        unitPrice: 16000, // 단가
        totalPrice: 320000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
      {
        no: 2, // 주문목록 번호
        breadName: '마리모 말차 빵', // 빵 이름
        breadImageUrl: '../../../public/images/malcha.png', // 빵 이미지
        quantity: 1, // 수량
        unitPrice: 4000, // 단가
        totalPrice: 4000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
    ],
  },
  {
    no: 1, // 주문번호
    orderNumber: 'ORD-20250723-0000103', // 주문번호(채번)
    orderStatus: '10', // 주문상태
    totalPrice: 68000, // 총 금액
    orderPw: '1234', // 주문 비밀번호(비회원)
    memo: '주문 메모입니다.', // 메모
    trackingNumber: '1-11-12345', // 송장번호
    canceledAt: null, // 주문취소일시

    ordererName: '김가나', // 주문인
    ordererMobile: '010-1234-5656', // 주문인 휴대번호
    recipientName: '김두울', // 수령인
    recipientMobile: '010-1234-5555', // 수령인 휴대번호
    address: '경기도 성남시 수정구 신흥1동', // 주소
    addressDetail: '6729번지 2층', // 상세주소
    zipcode: '68072', // 우편번호
    message: '배송 잘 부탁드립니다~!', // 배송메세지
    deliveryMethodName: '우체국', // 베송타입명
    deliveryMethodFee: 4000, // 배송비
    discountAmount: null, // 할인금액

    orderRoundNo: 1, // 주문차수 번호

    isPaymentRefundTermsAgreed: true, // 결제, 환불 약관 동의여부
    isServiceTermsAgreed: true, // 서비스 이용약관 동의여부
    isPrivacyTermsAgreed: true, // 개인정보 수집, 이용 동의 여부
    isMarketingTermsAgreed: true, // 마케팅 목적 개인정보 이용 및 광고 수신 동의 여부
    createdAt: '2025-01-09T07:13:12.306Z', // 등록일시

    orderItem: [
      // 주문목록
      {
        no: 1, // 주문목록 번호
        breadName: '스마일 도넛빵', // 빵 이름
        breadImageUrl: './../../../public/images/smail_sinker.png', // 빵 이미지
        quantity: 20, // 수량
        unitPrice: 16000, // 단가
        totalPrice: 320000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
      {
        no: 2, // 주문목록 번호
        breadName: '마리모 말차 빵', // 빵 이름
        breadImageUrl: '../../../public/images/malcha.png', // 빵 이미지
        quantity: 1, // 수량
        unitPrice: 4000, // 단가
        totalPrice: 4000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
    ],
  },
  {
    no: 1, // 주문번호
    orderNumber: 'ORD-20250723-0000103', // 주문번호(채번)
    orderStatus: '10', // 주문상태
    totalPrice: 68000, // 총 금액
    orderPw: '1234', // 주문 비밀번호(비회원)
    memo: '주문 메모입니다.', // 메모
    trackingNumber: '1-11-12345', // 송장번호
    canceledAt: null, // 주문취소일시

    ordererName: '김가나', // 주문인
    ordererMobile: '010-1234-5656', // 주문인 휴대번호
    recipientName: '김두울', // 수령인
    recipientMobile: '010-1234-5555', // 수령인 휴대번호
    address: '경기도 성남시 수정구 신흥1동', // 주소
    addressDetail: '6729번지 2층', // 상세주소
    zipcode: '68072', // 우편번호
    message: '배송 잘 부탁드립니다~!', // 배송메세지
    deliveryMethodName: '우체국', // 베송타입명
    deliveryMethodFee: 4000, // 배송비
    discountAmount: null, // 할인금액

    orderRoundNo: 1, // 주문차수 번호

    isPaymentRefundTermsAgreed: true, // 결제, 환불 약관 동의여부
    isServiceTermsAgreed: true, // 서비스 이용약관 동의여부
    isPrivacyTermsAgreed: true, // 개인정보 수집, 이용 동의 여부
    isMarketingTermsAgreed: true, // 마케팅 목적 개인정보 이용 및 광고 수신 동의 여부
    createdAt: '2025-01-09T07:13:12.306Z', // 등록일시

    orderItem: [
      // 주문목록
      {
        no: 1, // 주문목록 번호
        breadName: '스마일 도넛빵', // 빵 이름
        breadImageUrl: './../../../public/images/smail_sinker.png', // 빵 이미지
        quantity: 20, // 수량
        unitPrice: 16000, // 단가
        totalPrice: 320000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
      {
        no: 2, // 주문목록 번호
        breadName: '마리모 말차 빵', // 빵 이름
        breadImageUrl: '../../../public/images/malcha.png', // 빵 이미지
        quantity: 1, // 수량
        unitPrice: 4000, // 단가
        totalPrice: 4000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
    ],
  },
  {
    no: 1, // 주문번호
    orderNumber: 'ORD-20250723-0000103', // 주문번호(채번)
    orderStatus: '10', // 주문상태
    totalPrice: 68000, // 총 금액
    orderPw: '1234', // 주문 비밀번호(비회원)
    memo: '주문 메모입니다.', // 메모
    trackingNumber: '1-11-12345', // 송장번호
    canceledAt: null, // 주문취소일시

    ordererName: '김가나', // 주문인
    ordererMobile: '010-1234-5656', // 주문인 휴대번호
    recipientName: '김두울', // 수령인
    recipientMobile: '010-1234-5555', // 수령인 휴대번호
    address: '경기도 성남시 수정구 신흥1동', // 주소
    addressDetail: '6729번지 2층', // 상세주소
    zipcode: '68072', // 우편번호
    message: '배송 잘 부탁드립니다~!', // 배송메세지
    deliveryMethodName: '우체국', // 베송타입명
    deliveryMethodFee: 4000, // 배송비
    discountAmount: null, // 할인금액

    orderRoundNo: 1, // 주문차수 번호

    isPaymentRefundTermsAgreed: true, // 결제, 환불 약관 동의여부
    isServiceTermsAgreed: true, // 서비스 이용약관 동의여부
    isPrivacyTermsAgreed: true, // 개인정보 수집, 이용 동의 여부
    isMarketingTermsAgreed: true, // 마케팅 목적 개인정보 이용 및 광고 수신 동의 여부
    createdAt: '2025-01-09T07:13:12.306Z', // 등록일시

    orderItem: [
      // 주문목록
      {
        no: 1, // 주문목록 번호
        breadName: '스마일 도넛빵', // 빵 이름
        breadImageUrl: './../../../public/images/smail_sinker.png', // 빵 이미지
        quantity: 20, // 수량
        unitPrice: 16000, // 단가
        totalPrice: 320000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
      {
        no: 2, // 주문목록 번호
        breadName: '마리모 말차 빵', // 빵 이름
        breadImageUrl: '../../../public/images/malcha.png', // 빵 이미지
        quantity: 1, // 수량
        unitPrice: 4000, // 단가
        totalPrice: 4000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
    ],
  },
  {
    no: 1, // 주문번호
    orderNumber: 'ORD-20250723-0000103', // 주문번호(채번)
    orderStatus: '10', // 주문상태
    totalPrice: 68000, // 총 금액
    orderPw: '1234', // 주문 비밀번호(비회원)
    memo: '주문 메모입니다.', // 메모
    trackingNumber: '1-11-12345', // 송장번호
    canceledAt: null, // 주문취소일시

    ordererName: '김가나', // 주문인
    ordererMobile: '010-1234-5656', // 주문인 휴대번호
    recipientName: '김두울', // 수령인
    recipientMobile: '010-1234-5555', // 수령인 휴대번호
    address: '경기도 성남시 수정구 신흥1동', // 주소
    addressDetail: '6729번지 2층', // 상세주소
    zipcode: '68072', // 우편번호
    message: '배송 잘 부탁드립니다~!', // 배송메세지
    deliveryMethodName: '우체국', // 베송타입명
    deliveryMethodFee: 4000, // 배송비
    discountAmount: null, // 할인금액

    orderRoundNo: 1, // 주문차수 번호

    isPaymentRefundTermsAgreed: true, // 결제, 환불 약관 동의여부
    isServiceTermsAgreed: true, // 서비스 이용약관 동의여부
    isPrivacyTermsAgreed: true, // 개인정보 수집, 이용 동의 여부
    isMarketingTermsAgreed: true, // 마케팅 목적 개인정보 이용 및 광고 수신 동의 여부
    createdAt: '2025-01-09T07:13:12.306Z', // 등록일시

    orderItem: [
      // 주문목록
      {
        no: 1, // 주문목록 번호
        breadName: '스마일 도넛빵', // 빵 이름
        breadImageUrl: './../../../public/images/smail_sinker.png', // 빵 이미지
        quantity: 20, // 수량
        unitPrice: 16000, // 단가
        totalPrice: 320000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
      {
        no: 2, // 주문목록 번호
        breadName: '마리모 말차 빵', // 빵 이름
        breadImageUrl: '../../../public/images/malcha.png', // 빵 이미지
        quantity: 1, // 수량
        unitPrice: 4000, // 단가
        totalPrice: 4000, // 총 금액
        countryOfOrigin: '원산지 정보...', // 원산지 정보
        allergyInfo: '알러지 정보...', // 알러지 정보

        orderNo: 1, // 주문번호
        customerNo: 1, // 고객번호
        couponNo: null, // 쿠폰번호
      },
    ],
  },
];
