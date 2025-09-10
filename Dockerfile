# 빌드 스테이지
FROM node:22-alpine AS builder
WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 루트 복사
COPY package.json pnpm-lock.yaml ./

# 서버 복사 
COPY apps/server/package.json ./apps/server/
COPY apps/server/prisma ./apps/server/prisma/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# Prisma 마이그레이션 실행 및 클라이언트 생성
RUN pnpm run prisma:server

# 나머지 소스 코드 복사
COPY . .


# 서버 애플리케이션 빌드
RUN pnpm run build:server

############ 로그 참고용 
RUN ls -la /app/apps/
RUN ls -la /app/apps/server/


# ------------------------------------------------------------

# 런타임 스테이지
FROM node:22-alpine

# 작업 디렉터리 설정
WORKDIR /app

# 빌드된 결과물과 의존성 복사
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 서버 실행 명령어
CMD ["node", "apps/server/dist/index.js"]