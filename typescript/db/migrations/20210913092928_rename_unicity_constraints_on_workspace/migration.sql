-- RenameIndex
ALTER INDEX "Dataset.workspaceSlug_name_unique" RENAME TO "workspaceSlugAndDatasetName";

-- RenameIndex
ALTER INDEX "Dataset.workspaceSlug_slug_unique" RENAME TO "workspaceSlugAndDatasetSlug";
