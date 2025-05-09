/*
  Warnings:

  - The values [blocked] on the enum `ConnectionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConnectionStatus_new" AS ENUM ('pending', 'accepted', 'rejected');
ALTER TABLE "UserConnections" ALTER COLUMN "connectionStatus" DROP DEFAULT;
ALTER TABLE "UserConnections" ALTER COLUMN "connectionStatus" TYPE "ConnectionStatus_new" USING ("connectionStatus"::text::"ConnectionStatus_new");
ALTER TYPE "ConnectionStatus" RENAME TO "ConnectionStatus_old";
ALTER TYPE "ConnectionStatus_new" RENAME TO "ConnectionStatus";
DROP TYPE "ConnectionStatus_old";
ALTER TABLE "UserConnections" ALTER COLUMN "connectionStatus" SET DEFAULT 'pending';
COMMIT;
