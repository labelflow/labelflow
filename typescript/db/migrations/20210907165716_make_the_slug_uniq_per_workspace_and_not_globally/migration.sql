/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId,slug]` on the table `Dataset` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Dataset.name_unique";

-- DropIndex
DROP INDEX "Dataset.slug_unique";

-- CreateIndex
CREATE UNIQUE INDEX "Dataset.workspaceId_slug_unique" ON "Dataset"("workspaceId", "slug");
