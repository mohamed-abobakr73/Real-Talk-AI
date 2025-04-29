-- CreateEnum
CREATE TYPE "oauthProvider" AS ENUM ('google', 'gihub');

-- CreateTable
CREATE TABLE "User" (
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "oauthProvider" "oauthProvider",

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
