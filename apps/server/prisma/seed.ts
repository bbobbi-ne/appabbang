import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

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
      role: Role.ADMIN,
    },
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
