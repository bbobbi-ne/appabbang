import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const id = process.env.SAMPLE_ADMIN_ID || '';
  const pw = process.env.SAMPLE_ADMIN_PW || '';

  const hashedPassword = await bcrypt.hash(pw, 10);

  // 기본 관리자 유저 생성
  await prisma.users.upsert({
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

  /*
group_name	code	name
bread_status	10	판매
bread_status	20	미판매
bread_status	30	임시저장
bread_status	40	재료소진
bread_status	50	출시예정
user_role	10	관리자
user_role	20	서브관리자
material_type	10	원재료
material_type	20	포장재
order_status	10	접수됨
order_status	20	제조중
order_status	30	배송중
order_status	40	완료
order_status	50	취소됨
purchase_status	10	발주요청
purchase_status	20	발주중
purchase_status	30	발주완료
delivery_type	10	우체국
delivery_type	20	CJ대한통운

  */

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
      { code: '10', groupName: 'order_status', name: '접수됨', remarkTxt: '접수됨' },
      { code: '20', groupName: 'order_status', name: '제조중', remarkTxt: '제조중' },
      { code: '30', groupName: 'order_status', name: '배송중', remarkTxt: '배송중' },
      { code: '40', groupName: 'order_status', name: '완료', remarkTxt: '완료' },
      { code: '50', groupName: 'order_status', name: '취소됨', remarkTxt: '취소됨' },
      { code: '10', groupName: 'purchase_status', name: '발주요청', remarkTxt: '발주요청' },
      { code: '20', groupName: 'purchase_status', name: '발주중', remarkTxt: '발주중' },
      { code: '30', groupName: 'purchase_status', name: '발주완료', remarkTxt: '발주완료' },
      { code: '10', groupName: 'delivery_type', name: '우체국', remarkTxt: '우체국' },
      { code: '20', groupName: 'delivery_type', name: 'CJ대한통운', remarkTxt: 'CJ대한통운' },
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
