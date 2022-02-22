/*
  Warnings:

  - The values [Enterprise] on the enum `WorkspacePlan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkspacePlan_new" AS ENUM ('Community', 'Starter', 'Pro');
ALTER TABLE "Workspace" ALTER COLUMN "plan" TYPE "WorkspacePlan_new" USING ("plan"::text::"WorkspacePlan_new");
ALTER TYPE "WorkspacePlan" RENAME TO "WorkspacePlan_old";
ALTER TYPE "WorkspacePlan_new" RENAME TO "WorkspacePlan";
DROP TYPE "WorkspacePlan_old";
COMMIT;
