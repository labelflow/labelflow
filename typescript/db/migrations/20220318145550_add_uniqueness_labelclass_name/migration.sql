-- Removes duplicates rows based on "datasetId" "name" combination. 
DELETE FROM "LabelClass" a WHERE EXISTS(SELECT * FROM "LabelClass" b WHERE "a"."datasetId" = "b"."datasetId" AND "a"."name" = "b"."name" AND "b"."id" < "a"."id");

-- CreateIndex
CREATE UNIQUE INDEX "labelClass_name" ON "LabelClass"("name", "datasetId");
