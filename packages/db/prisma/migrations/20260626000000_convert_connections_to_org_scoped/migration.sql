-- CreateEnum
CREATE TYPE "ConnectionProvider" AS ENUM ('GITHUB', 'GOOGLE', 'SLACK');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'ERROR');

-- CreateTable
CREATE TABLE "OrganizationConnection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" "ConnectionProvider" NOT NULL,
    "providerAccountId" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "scopes" TEXT,
    "metadata" JSONB,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationConnection_organizationId_provider_key" ON "OrganizationConnection"("organizationId", "provider");

-- CreateIndex
CREATE INDEX "OrganizationConnection_organizationId_idx" ON "OrganizationConnection"("organizationId");

-- AddForeignKey
ALTER TABLE "OrganizationConnection" ADD CONSTRAINT "OrganizationConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropTable (clean break - no backfill)
DROP TABLE "OAuthConnection";

-- DropEnum
DROP TYPE "OAuthProvider";
