-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "globals_components" DROP CONSTRAINT "globals_components_global_id_fkey";

-- DropForeignKey
ALTER TABLE "homepages_components" DROP CONSTRAINT "homepages_components_homepage_id_fkey";

-- AddForeignKey
ALTER TABLE "Account" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "globals_components" ADD FOREIGN KEY ("global_id") REFERENCES "globals"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "homepages_components" ADD FOREIGN KEY ("homepage_id") REFERENCES "homepages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
