/*
  Warnings:

  - The primary key for the `Membership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[workspaceId,userId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Membership` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_pkey",
ADD COLUMN     "id" UUID NOT NULL,
ADD PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Membership.workspaceId_userId_unique" ON "Membership"("workspaceId", "userId");
