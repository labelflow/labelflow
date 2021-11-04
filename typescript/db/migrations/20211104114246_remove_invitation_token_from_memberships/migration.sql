/*
  Warnings:

  - You are about to drop the column `invitationToken` on the `Membership` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Membership.invitationToken_unique";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "invitationToken";
