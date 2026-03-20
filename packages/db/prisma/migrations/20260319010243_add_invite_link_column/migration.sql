/*
  Warnings:

  - Added the required column `inviteLink` to the `OrganizationInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationInvite" ADD COLUMN     "inviteLink" TEXT NOT NULL;
