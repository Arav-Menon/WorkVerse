-- Migration: Fix production schema drift
-- This migration bridges the gap between schema.prisma and the production Neon database.
-- It adds missing columns, tables, and constraints that were added to schema.prisma
-- without corresponding migrations.

-- =============================================
-- 1. Add missing columns to Workspace
-- =============================================

-- Add slug as nullable first (safe for existing rows)
ALTER TABLE "Workspace" ADD COLUMN "slug" TEXT;

-- Backfill slug from name: lowercase, replace non-alphanumeric with hyphens, trim trailing hyphens
UPDATE "Workspace" SET "slug" = LOWER(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g'));
UPDATE "Workspace" SET "slug" = REGEXP_REPLACE("slug", '-+$', '');

-- Now add NOT NULL constraint
ALTER TABLE "Workspace" ALTER COLUMN "slug" SET NOT NULL;

-- Add unique constraint on slug
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- Add description (nullable, no backfill needed)
ALTER TABLE "Workspace" ADD COLUMN "description" TEXT;

-- =============================================
-- 2. Add missing column to AiChatMessage
-- =============================================

ALTER TABLE "AiChatMessage" ADD COLUMN "organizationId" TEXT;

-- =============================================
-- 3. Create Space table
-- =============================================

CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Main',
    "orgId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL DEFAULT '',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Space_workspaceId_key" ON "Space"("workspaceId");
CREATE INDEX "Space_workspaceId_idx" ON "Space"("workspaceId");
CREATE INDEX "Space_orgId_idx" ON "Space"("orgId");

ALTER TABLE "Space" ADD CONSTRAINT "Space_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Space" ADD CONSTRAINT "Space_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Space" ADD CONSTRAINT "Space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- =============================================
-- 4. Create ChatMessage table
-- =============================================

CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ChatMessage_workspaceId_idx" ON "ChatMessage"("workspaceId");
CREATE INDEX "ChatMessage_userId_idx" ON "ChatMessage"("userId");

ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- =============================================
-- 5. Create DirectMessageConversation table
-- =============================================

CREATE TABLE "DirectMessageConversation" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DirectMessageConversation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DirectMessageConversation_organizationId_user1Id_user2Id_key" ON "DirectMessageConversation"("organizationId", "user1Id", "user2Id");
CREATE INDEX "DirectMessageConversation_organizationId_idx" ON "DirectMessageConversation"("organizationId");
CREATE INDEX "DirectMessageConversation_user1Id_idx" ON "DirectMessageConversation"("user1Id");
CREATE INDEX "DirectMessageConversation_user2Id_idx" ON "DirectMessageConversation"("user2Id");

ALTER TABLE "DirectMessageConversation" ADD CONSTRAINT "DirectMessageConversation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectMessageConversation" ADD CONSTRAINT "DirectMessageConversation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectMessageConversation" ADD CONSTRAINT "DirectMessageConversation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =============================================
-- 6. Create DirectMessage table
-- =============================================

CREATE TABLE "DirectMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DirectMessage_conversationId_createdAt_idx" ON "DirectMessage"("conversationId", "createdAt");
CREATE INDEX "DirectMessage_senderId_idx" ON "DirectMessage"("senderId");

ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "DirectMessageConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- =============================================
-- 7. Fix OrganizationInvite constraints
-- =============================================

-- The production DB has individual @unique on email.
-- The schema.prisma expects @@unique([organizationId, email]) instead.
-- Drop the individual unique on email and add the composite unique.

-- Drop the existing individual unique index on email (name may vary)
DROP INDEX IF EXISTS "OrganizationInvite_email_key";

-- Add composite unique on (organizationId, email)
CREATE UNIQUE INDEX "OrganizationInvite_organizationId_email_key" ON "OrganizationInvite"("organizationId", "email");

-- Add unique constraint on inviteLink (schema expects @unique)
CREATE UNIQUE INDEX "OrganizationInvite_inviteLink_key" ON "OrganizationInvite"("inviteLink");
