-- Group label-classes by unique datasetId+name
SELECT "b"."id" AS "oldId", "a"."id" AS "newId"
INTO TEMP "#UniqueLabelClasses"
FROM
  (SELECT MIN(id::TEXT) AS "id", "datasetId", "name", COUNT(*) as "occurrences"
   FROM "LabelClass" GROUP BY "datasetId","name") "a"
INNER JOIN
    "LabelClass" "b" ON "a"."datasetId" = "b"."datasetId" AND "a"."name" = "b"."name"
WHERE ("occurrences" > 1) AND ("a"."id" <> "b"."id"::TEXT);

-- Update labels which are referencing the duplicates label-classes
UPDATE "Label"
    SET "labelClassId" = "#UniqueLabelClasses"."newId"::uuid
FROM "#UniqueLabelClasses"
WHERE "Label"."labelClassId" = "#UniqueLabelClasses"."oldId";

-- Delete duplicate label-classes
DELETE FROM "LabelClass"
USING "#UniqueLabelClasses"
WHERE "LabelClass"."id" = "#UniqueLabelClasses"."oldId";

-- Add unique constraint on dasasetId+name
CREATE UNIQUE INDEX "labelClass_name" ON "LabelClass"("name", "datasetId");
