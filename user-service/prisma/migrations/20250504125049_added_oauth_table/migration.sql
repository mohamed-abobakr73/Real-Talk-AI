/*
  Warnings:

  - You are about to drop the column `oauthProvider` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthProviderType" AS ENUM ('google', 'github');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "oauthProvider",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "oauthProvider";

-- CreateTable
CREATE TABLE "AuthProviders" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "AuthProviderType" NOT NULL,
    "authProviderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthProviders_pkey" PRIMARY KEY ("id")
);
