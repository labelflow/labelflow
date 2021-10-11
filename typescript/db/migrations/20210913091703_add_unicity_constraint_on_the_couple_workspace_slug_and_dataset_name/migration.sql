/*
  Warnings:

  - A unique constraint covering the columns `[workspaceSlug,name]` on the table `Dataset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dataset.workspaceSlug_name_unique" ON "Dataset"("workspaceSlug", "name");

-- RenameIndex
ALTER INDEX "slugs" RENAME TO "Dataset.workspaceSlug_slug_unique";
