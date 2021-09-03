-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_labelClassId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "globals_components" DROP CONSTRAINT "global_id_fk";

-- DropForeignKey
ALTER TABLE "homepages_components" DROP CONSTRAINT "homepage_id_fk";

-- AddForeignKey
ALTER TABLE "Label" ADD FOREIGN KEY ("labelClassId") REFERENCES "LabelClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "globals_components" ADD FOREIGN KEY ("global_id") REFERENCES "globals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepages_components" ADD FOREIGN KEY ("homepage_id") REFERENCES "homepages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
