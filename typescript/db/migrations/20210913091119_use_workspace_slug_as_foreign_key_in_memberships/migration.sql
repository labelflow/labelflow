/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Membership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workspaceSlug,userId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceSlug` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_workspaceId_fkey";

-- DropIndex
DROP INDEX "Membership.workspaceId_userId_unique";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "workspaceId",
ADD COLUMN     "workspaceSlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Membership.workspaceSlug_userId_unique" ON "Membership"("workspaceSlug", "userId");

-- AddForeignKey
ALTER TABLE "Membership" ADD FOREIGN KEY ("workspaceSlug") REFERENCES "Workspace"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
