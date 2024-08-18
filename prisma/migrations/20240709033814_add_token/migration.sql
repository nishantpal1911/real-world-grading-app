-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL', 'API');

-- AlterTable
ALTER TABLE "User" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "TokenType" NOT NULL,
    "emailToken" TEXT,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_emailToken_key" ON "Token"("emailToken");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
