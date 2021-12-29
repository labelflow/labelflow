-- DropIndex
DROP INDEX "LabelClass.name_datasetId_index";

-- CreateIndex
CREATE INDEX "Account.userId_index" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Dataset.workspaceSlug_createdAt_index" ON "Dataset"("workspaceSlug", "createdAt");

-- CreateIndex
CREATE INDEX "Dataset.createdAt_index" ON "Dataset"("createdAt");

-- CreateIndex
CREATE INDEX "Image.datasetId_createdAt_index" ON "Image"("datasetId", "createdAt");

-- CreateIndex
CREATE INDEX "Label.labelClassId_index" ON "Label"("labelClassId");

-- CreateIndex
CREATE INDEX "Label.imageId_createdAt_index" ON "Label"("imageId", "createdAt");

-- CreateIndex
CREATE INDEX "LabelClass.datasetId_createdAt_index" ON "LabelClass"("datasetId", "createdAt");

-- CreateIndex
CREATE INDEX "LabelClass.datasetId_name_index" ON "LabelClass"("datasetId", "name");

-- CreateIndex
CREATE INDEX "Membership.workspaceSlug_createdAt_index" ON "Membership"("workspaceSlug", "createdAt");

-- CreateIndex
CREATE INDEX "Session.userId_index" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "User.createdAt_index" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "Workspace.slug_deletedAt_createdAt_index" ON "Workspace"("slug", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "Workspace.createdAt_index" ON "Workspace"("createdAt");

-- CreateIndex
CREATE INDEX "Workspace.name_index" ON "Workspace"("name");
