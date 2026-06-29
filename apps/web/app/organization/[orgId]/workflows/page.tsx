"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOrganizationWorkflows, useDeleteWorkflow } from "@/hooks/use-workflows";
import type { Workflow } from "@/lib/api/workflow.api";
import { toast } from "sonner";

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
          <i className="ti ti-check text-[10px]" />
          Active
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-400 ring-1 ring-yellow-500/20">
          Draft
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20">
          <i className="ti ti-x text-[10px]" />
          Failed
        </span>
      );
    case "GENERATED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">
          <i className="ti ti-loader text-[10px] animate-spin" />
          Generated
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-400 ring-1 ring-zinc-500/20">
          {status}
        </span>
      );
  }
}

function WorkflowCard({
  workflow,
  onDelete,
}: {
  workflow: Workflow;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:border-white/[0.15] hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <i className="ti ti-robot text-lg text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white/90">
                {workflow.name}
              </h3>
              {workflow.description && (
                <p className="mt-0.5 truncate text-xs text-white/50">
                  {workflow.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {getStatusBadge(workflow.status)}
            {workflow.integrations.length > 0 && (
              <div className="flex items-center gap-1">
                {workflow.integrations.slice(0, 3).map((integration) => (
                  <span
                    key={integration}
                    className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-white/60"
                  >
                    {integration}
                  </span>
                ))}
                {workflow.integrations.length > 3 && (
                  <span className="text-[10px] text-white/40">
                    +{workflow.integrations.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-4 text-[11px] text-white/40">
            <span>Created {timeAgo(workflow.createdAt)}</span>
            {workflow.lastExecutedAt && (
              <span>Last run {timeAgo(workflow.lastExecutedAt)}</span>
            )}
            <span>by {workflow.createdBy.name}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {workflow.n8nWorkflowUrl && (
            <a
              href={workflow.n8nWorkflowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md p-1.5 text-white/40 hover:bg-white/[0.08] hover:text-white/70"
              title="Open in n8n"
            >
              <i className="ti ti-external-link text-sm" />
            </a>
          )}
          <button
            onClick={() => onDelete(workflow.id)}
            className="rounded-md p-1.5 text-white/40 hover:bg-red-500/10 hover:text-red-400"
            title="Delete workflow"
          >
            <i className="ti ti-trash text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  const {
    data: workflows,
    isLoading,
    refetch,
  } = useOrganizationWorkflows(orgId);
  const deleteMutation = useDeleteWorkflow(orgId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);

  const handleDeleteClick = useCallback((workflowId: string) => {
    setWorkflowToDelete(workflowId);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!workflowToDelete) return;

    deleteMutation.mutate(workflowToDelete, {
      onSuccess: () => {
        toast.success("Workflow deleted");
        setShowDeleteModal(false);
        setWorkflowToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete workflow");
      },
    });
  }, [workflowToDelete, deleteMutation]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white/90">Workflows</h1>
            <p className="mt-1 text-sm text-white/50">
              Manage your automated workflows
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/70 hover:bg-white/[0.08]"
          >
            <i className="ti ti-refresh text-sm" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <i className="ti ti-loader text-4xl text-white/30 animate-spin" />
          </div>
        ) : workflows && workflows.length > 0 ? (
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.1] py-20">
            <i className="ti ti-robot mb-4 text-5xl text-white/20" />
            <h3 className="text-lg font-medium text-white/60">No workflows yet</h3>
            <p className="mt-1 text-sm text-white/40">
              Create a workflow from the AI Lab to get started
            </p>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/[0.1] bg-[#12121a] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white/90">Delete Workflow</h3>
            <p className="mt-2 text-sm text-white/60">
              Are you sure you want to delete this workflow? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setWorkflowToDelete(null);
                }}
                className="rounded-lg border border-white/[0.1] px-4 py-2 text-sm text-white/70 hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
