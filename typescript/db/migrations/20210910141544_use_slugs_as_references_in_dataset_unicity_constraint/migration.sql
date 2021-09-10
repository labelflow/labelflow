/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `Dataset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workspaceSlug,slug]` on the table `Dataset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspaceSlug` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Dataset" DROP CONSTRAINT "Dataset_workspaceId_fkey";

-- DropIndex
DROP INDEX "Dataset.workspaceId_slug_unique";

-- AlterTable
ALTER TABLE "Dataset" DROP COLUMN "workspaceId",
ADD COLUMN     "workspaceSlug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "slugs" ON "Dataset"("workspaceSlug", "slug");

-- AddForeignKey
ALTER TABLE "Dataset" ADD FOREIGN KEY ("workspaceSlug") REFERENCES "Workspace"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
