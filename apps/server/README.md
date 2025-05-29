ORM : prisma 
<br />
DB : postgresql

----------------------------
```
pnpm add prisma @prisma/client
pnpm prisma init
```

[DB, Prisma 연동]
- postgresql 로컬 설치 
- createdb appabbang
- DATABASE_URL 을 찾아 .env 에 추가.

[Prisma 모델추가]
- prisma/schema.prisma 파일에 모델 추가.


[Prisma 클라이언트 생성]
```
pnpm prisma generate
```

[DB 반영]

```
pnpm prisma migrate dev --name init
```

