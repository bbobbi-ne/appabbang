import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const id = process.env.SAMPLE_ADMIN_ID || '';
  const pw = process.env.SAMPLE_ADMIN_PW || '';

  const hashedPassword = await bcrypt.hash(pw, 10);

  // 기본 관리자 유저 생성
  await prisma.user.upsert({
    where: { id },
    update: {
      pw: hashedPassword,
    },
    create: {
      id: 'admin',
      pw: hashedPassword,
      name: '주인장',
      userRole: '10',
    },
  });

  // 공통 코드 테이블 초기화
  await prisma.commonCode.deleteMany();

  // 공통 코드 생성
  await prisma.commonCode.createMany({
    data: [
      { code: '10', groupName: 'user_role', name: '관리자', remarkTxt: '관리자' },
      { code: '20', groupName: 'user_role', name: '서브관리자', remarkTxt: '서브관리자' },
      { code: '10', groupName: 'bread_status', name: '판매', remarkTxt: '판매' },
      { code: '20', groupName: 'bread_status', name: '미판매', remarkTxt: '미판매' },
      { code: '30', groupName: 'bread_status', name: '임시저장', remarkTxt: '임시저장' },
      { code: '40', groupName: 'bread_status', name: '재료소진', remarkTxt: '재료소진' },
      { code: '50', groupName: 'bread_status', name: '출시예정', remarkTxt: '출시예정' },
      { code: '10', groupName: 'material_type', name: '원재료', remarkTxt: '원재료' },
      { code: '20', groupName: 'material_type', name: '포장재', remarkTxt: '포장재' },
      { code: '10', groupName: 'order_status', name: '접수요청', remarkTxt: '고객이 주문한 상태' },
      {
        code: '11',
        groupName: 'order_status',
        name: '접수완료',
        remarkTxt: '고객 입금을 관리자가 확인한 상태',
      },
      { code: '20', groupName: 'order_status', name: '제조중', remarkTxt: '제조중' },
      { code: '30', groupName: 'order_status', name: '배송중', remarkTxt: '배송중' },
      { code: '31', groupName: 'order_status', name: '수령대기중', remarkTxt: '직접수령일 경우' },
      { code: '40', groupName: 'order_status', name: '완료', remarkTxt: '완료' },
      {
        code: '50',
        groupName: 'order_status',
        name: '취소요청',
        remarkTxt: '고객이 취소를 요청한 상태',
      },
      {
        code: '51',
        groupName: 'order_status',
        name: '취소완료',
        remarkTxt: '관리자가 취소를 완료한 상태',
      },
      {
        code: '52',
        groupName: 'order_status',
        name: '취소완료(환불)',
        remarkTxt: '관리자가 취소 및 환불을 완료한 상태',
      },
      { code: '10', groupName: 'purchase_status', name: '발주요청', remarkTxt: '발주요청' },
      { code: '20', groupName: 'purchase_status', name: '발주중', remarkTxt: '발주중' },
      { code: '30', groupName: 'purchase_status', name: '발주완료', remarkTxt: '발주완료' },
      { code: '10', groupName: 'delivery_type', name: '택배배송', remarkTxt: '택배배송' },
      { code: '20', groupName: 'delivery_type', name: '직접수령', remarkTxt: '직접수령' },
      { code: '90', groupName: 'delivery_type', name: '기타', remarkTxt: '기타' },
      { code: '10', groupName: 'image_target_type', name: 'breads', remarkTxt: '빵 이미지' },
      {
        code: '20',
        groupName: 'image_target_type',
        name: 'orderRound',
        remarkTxt: '주문차수 이미지',
      },
      { code: '10', groupName: 'discount_type', name: '기간할인', remarkTxt: '기간할인' },
      { code: '20', groupName: 'discount_type', name: '고객할인', remarkTxt: '고객할인' },
      { code: '10', groupName: 'provider_type', name: '카카오', remarkTxt: '카카오 로그인' },
      // 은행 코드 (금융결제원 + 한국은행 기준 으로 자주 사용하는 은행 코드만 추가)
      { code: '001', groupName: 'bank_code', name: '한국은행', remarkTxt: '중앙은행' },
      { code: '002', groupName: 'bank_code', name: '산업은행', remarkTxt: '산업은행' },
      { code: '003', groupName: 'bank_code', name: '기업은행', remarkTxt: '국책은행' },
      { code: '004', groupName: 'bank_code', name: 'KB국민은행', remarkTxt: '시중은행' },
      { code: '007', groupName: 'bank_code', name: '수협은행', remarkTxt: '수산업협동조합' },
      { code: '008', groupName: 'bank_code', name: '수출입은행', remarkTxt: '국책은행' },
      { code: '011', groupName: 'bank_code', name: 'NH농협은행', remarkTxt: '시중은행' },
      { code: '020', groupName: 'bank_code', name: '우리은행', remarkTxt: '시중은행' },
      { code: '023', groupName: 'bank_code', name: 'SC제일은행', remarkTxt: '외국계' },
      { code: '027', groupName: 'bank_code', name: '한국씨티은행', remarkTxt: '외국계' },
      { code: '031', groupName: 'bank_code', name: '대구은행', remarkTxt: '지방은행' },
      { code: '032', groupName: 'bank_code', name: '부산은행', remarkTxt: '지방은행' },
      { code: '034', groupName: 'bank_code', name: '광주은행', remarkTxt: '지방은행' },
      { code: '035', groupName: 'bank_code', name: '제주은행', remarkTxt: '지방은행' },
      { code: '037', groupName: 'bank_code', name: '전북은행', remarkTxt: '지방은행' },
      { code: '039', groupName: 'bank_code', name: '경남은행', remarkTxt: '지방은행' },
      { code: '081', groupName: 'bank_code', name: '하나은행', remarkTxt: '시중은행' },
      { code: '088', groupName: 'bank_code', name: '신한은행', remarkTxt: '시중은행' },
      { code: '089', groupName: 'bank_code', name: '케이뱅크', remarkTxt: '인터넷은행' },
      { code: '090', groupName: 'bank_code', name: '카카오뱅크', remarkTxt: '인터넷은행' },
      { code: '092', groupName: 'bank_code', name: '토스뱅크', remarkTxt: '인터넷은행' },
      { code: '071', groupName: 'bank_code', name: '우체국', remarkTxt: '금융기관' },
      { code: '045', groupName: 'bank_code', name: '새마을금고', remarkTxt: '상호금융' },
      { code: '048', groupName: 'bank_code', name: '신협', remarkTxt: '상호금융' },
      { code: '050', groupName: 'bank_code', name: '저축은행', remarkTxt: '서민금융' },
    ],
  });

  // 배송방법 생성
  await prisma.deliveryMethod.createMany({
    data: [
      { deliveryTypeCode: '10', fee: 4000, isActive: true, memo: '우체국', name: '우체국' },
      {
        deliveryTypeCode: '10',
        fee: 4000,
        isActive: false,
        memo: 'CJ대한통운',
        name: 'CJ대한통운',
      },
      { deliveryTypeCode: '20', fee: 0, isActive: true, memo: '직접수령', name: '직접수령' },
      { deliveryTypeCode: '90', fee: 0, isActive: true, memo: '기타', name: '기타' },
    ],
  });

  await prisma.bread.createMany({
    data: [
      {
        name: '판매빵',
        description: '판매빵',
        unitPrice: 1000,
        breadStatus: '10',
        countryOfOrigin:
          '빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)], 가공유크림(독일산), 과자[밀가루(밀:미국산,호주산),쇼트닝(팜유:말레이시아)',
        allergyInfo: '밀, 우유, 대두, 계란 함유',
      },
      {
        name: '미판매빵',
        description: '미판매빵',
        unitPrice: 2000,
        breadStatus: '20',
        countryOfOrigin:
          '빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)], 가공유크림(독일산), 과자[밀가루(밀:미국산,호주산),쇼트닝(팜유:말레이시아)',
        allergyInfo: '밀, 우유, 대두, 계란 함유',
      },
      {
        name: '임시저장빵',
        description: '임시저장빵',
        unitPrice: 3000,
        breadStatus: '30',
        countryOfOrigin:
          '빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)], 가공유크림(독일산), 과자[밀가루(밀:미국산,호주산),쇼트닝(팜유:말레이시아)',
        allergyInfo: '밀, 우유, 대두, 계란 함유',
      },
      {
        name: '재료소진빵',
        description: '재료소진빵',
        unitPrice: 4000,
        breadStatus: '40',
        countryOfOrigin:
          '빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)], 가공유크림(독일산), 과자[밀가루(밀:미국산,호주산),쇼트닝(팜유:말레이시아)',
        allergyInfo: '밀, 우유, 대두, 계란 함유',
      },
      {
        name: '출시예정빵',
        description: '출시예정빵',
        unitPrice: 5000,
        breadStatus: '50',
        countryOfOrigin:
          '빵류[밀가루(밀:미국,캐나다산),영양강화밀가루(프랑스산)], 가공유크림(독일산), 과자[밀가루(밀:미국산,호주산),쇼트닝(팜유:말레이시아)',
        allergyInfo: '밀, 우유, 대두, 계란 함유',
      },
    ],
  });

  // 주문차수 테이블 초기화
  await prisma.orderRound.deleteMany();

  // 주문차수 생성
  await prisma.orderRound.createMany({
    data: [
      {
        name: '주문 1차',
        startedAt: '2025-08-01T09:36:15.992Z',
        endedAt: '2025-08-31T20:36:15.992Z',
        minOrderQty: 1,
        maxOrderQty: 999,
      },
    ],
  });

  // 주문차수-빵 매핑 테이블 초기화
  await prisma.orderRoundBread.deleteMany();

  // 주문차수-빵 매핑 테이블 생성
  await prisma.orderRoundBread.createMany({
    data: [
      {
        orderRoundNo: 1,
        breadNo: 1,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
