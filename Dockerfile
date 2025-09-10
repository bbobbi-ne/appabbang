# 빌드 스테이지
FROM node:20-alpine AS builder
WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate
# RUN npm install -g pnpm

# 루트의 pnpm 관련 파일 복사 (의존성 캐싱)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 내부/공용 패키지만 먼저 복사
COPY apps/server/package.json ./apps/server/package.json
COPY packages ./packages/
COPY tools ./tools/

# prisma 스키마는 generate용으로 미리 복사함
COPY apps/server/prisma ./apps/server/prisma/

# 의존성 설치
RUN pnpm install --frozen-lockfile


# 나머지 소스 코드 복사
COPY . .

# 마이그레이션 실행 및 Prisma 클라이언트 생성. 'prisma' 폴더를 복사한 후 실행해야 합니다.
RUN pnpm exec prisma generate --schema=apps/server/prisma/schema.prisma

# 서버 애플리케이션 빌드
RUN pnpm run build:server

# 빌드 된 이후, dist 폴더가 생겼으므로 docs폴더를 이동시킴
RUN mkdir -p apps/server/dist/docs \
    && cp -r apps/server/src/docs/* apps/server/dist/docs/




# ------------------------------------------------------------

# 런타임 스테이지
FROM node:20-alpine

# 작업 디렉터리 설정
WORKDIR /app

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

# 빌드된 결과물과 의존성 복사
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml 

# 서버 실행 명령어
CMD ["node", "apps/server/dist/index.js"]