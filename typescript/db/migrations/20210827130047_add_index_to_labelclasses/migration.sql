/*
  Warnings:

  - Added the required column `index` to the `LabelClass` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LabelClass" ADD COLUMN     "index" INTEGER NOT NULL;
