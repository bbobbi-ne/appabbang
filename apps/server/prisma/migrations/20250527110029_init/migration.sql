-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUB');

-- CreateTable
CREATE TABLE "User" (
    "no" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "pw" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("no")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
