-- AlterTable: Add encrypted columns with default values for existing rows
ALTER TABLE "OrganizationConnection" ADD COLUMN "encryptedAccessToken" TEXT NOT NULL DEFAULT '';
ALTER TABLE "OrganizationConnection" ADD COLUMN "encryptedRefreshToken" TEXT;
