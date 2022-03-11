-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_labelClassId_fkey";

-- AddForeignKey
ALTER TABLE "Label" ADD FOREIGN KEY ("labelClassId") REFERENCES "LabelClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
