-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "WorkflowExecutor" AS ENUM ('N8N', 'MCP', 'HYBRID');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "AgentEvent" DROP CONSTRAINT "AgentEvent_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_jobId_fkey";

-- DropForeignKey
ALTER TABLE "TaskExecution" DROP CONSTRAINT "TaskExecution_taskId_fkey";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "TaskExecution";

-- DropEnum
DROP TYPE "JobStatus";

-- CreateTable
CREATE TABLE "WorkflowJob" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "systemPrompt" TEXT,
    "status" "WorkflowStatus" NOT NULL,
    "executor" "WorkflowExecutor",
    "graph" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobExecution" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "logs" TEXT,
    "input" JSONB NOT NULL,
    "output" JSONB NOT NULL,
    "status" "TaskStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "JobExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobExecution_taskId_idx" ON "JobExecution"("taskId");

-- AddForeignKey
ALTER TABLE "JobExecution" ADD CONSTRAINT "JobExecution_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "WorkflowJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentEvent" ADD CONSTRAINT "AgentEvent_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "WorkflowJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
