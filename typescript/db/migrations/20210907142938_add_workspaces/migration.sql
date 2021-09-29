/*
  Warnings:

  - Added the required column `workspaceId` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Member');

-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "workspaceId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Workspace" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspacesUsers" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL,
    "workspaceId" UUID NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("workspaceId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace.name_unique" ON "Workspace"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace.slug_unique" ON "Workspace"("slug");

-- AddForeignKey
ALTER TABLE "Dataset" ADD FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspacesUsers" ADD FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkspacesUsers" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
