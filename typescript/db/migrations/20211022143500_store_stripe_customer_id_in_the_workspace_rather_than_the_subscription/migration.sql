/*
  Warnings:

  - You are about to drop the column `stripeSubscriptionId` on the `Workspace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "stripeCustomerId" TEXT;
