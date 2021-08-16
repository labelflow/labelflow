/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Dataset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dataset.slug_unique" ON "Dataset"("slug");
