-- CreateTable
CREATE TABLE "OrganizationN8nConnection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "encryptedApiKey" TEXT NOT NULL,
    "connectedById" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONNECTED',
    "lastValidatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationN8nConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationN8nConnection_organizationId_key" ON "OrganizationN8nConnection"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationN8nConnection_organizationId_idx" ON "OrganizationN8nConnection"("organizationId");

-- AddForeignKey
ALTER TABLE "OrganizationN8nConnection" ADD CONSTRAINT "OrganizationN8nConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationN8nConnection" ADD CONSTRAINT "OrganizationN8nConnection_connectedById_fkey" FOREIGN KEY ("connectedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
