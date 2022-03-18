-- CreateEnum
CREATE TYPE "WorkspaceStatus" AS ENUM ('Active', 'Trialing', 'Incomplete', 'PastDue', 'Unpaid', 'Canceled', 'IncompleteExpired');

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "status" "WorkspaceStatus" NOT NULL DEFAULT E'Active';
