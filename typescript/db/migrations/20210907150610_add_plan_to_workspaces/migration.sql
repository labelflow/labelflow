/*
  Warnings:

  - Added the required column `plan` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkspacePlan" AS ENUM ('community', 'starter', 'pro', 'enterprise');

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "plan" "WorkspacePlan" NOT NULL;
