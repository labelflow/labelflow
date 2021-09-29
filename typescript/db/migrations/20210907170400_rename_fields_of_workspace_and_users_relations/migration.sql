/*
  Warnings:

  - You are about to drop the `WorkspacesUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkspacesUsers" DROP CONSTRAINT "WorkspacesUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspacesUsers" DROP CONSTRAINT "WorkspacesUsers_workspaceId_fkey";

-- DropTable
DROP TABLE "WorkspacesUsers";

-- CreateTable
CREATE TABLE "Membership" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL,
    "workspaceId" UUID NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("workspaceId","userId")
);

-- AddForeignKey
ALTER TABLE "Membership" ADD FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
