/*
  Warnings:

  - A unique constraint covering the columns `[invitationToken]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workspaceSlug,invitationEmailSentTo]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "invitationEmailSentTo" TEXT,
ADD COLUMN     "invitationToken" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Membership.invitationToken_unique" ON "Membership"("invitationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Membership.workspaceSlug_invitationEmailSentTo_unique" ON "Membership"("workspaceSlug", "invitationEmailSentTo");
