"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import OrgHeroSection from "@/app/workspace/components/OrgHeroSection";
import WorkspacesGrid from "@/app/workspace/components/WorkspacesGrid";
import InviteMemberModal from "@/components/shared/InviteMemberModal";
import { useOrganization, useInviteMember } from "@/hooks/use-organization";
import { useOrganizationWorkspaces, useCreateWorkspace } from "@/hooks/use-workspaces";
import { usePermission } from "@/lib/rbac/usePermission";

export default function WorkspacesPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  const { data: org } = useOrganization(orgId);
  const { data: workspaces = [] } = useOrganizationWorkspaces(orgId);
  const createWorkspaceMutation = useCreateWorkspace(orgId);
  const inviteMutation = useInviteMember(orgId);
  const { canInviteMembers } = usePermission(orgId);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceSlug, setNewWorkspaceSlug] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");

  const handleInviteSubmit = async (data: { name: string; email: string }) => {
    inviteMutation.reset();
    try {
      await inviteMutation.mutateAsync(data);
    } catch {
      // Error is captured by useInviteMember and displayed via inviteMutation.error
    }
  };

  const getInviteError = (): string | null => {
    if (!inviteMutation.error) return null;
    const err = inviteMutation.error as Error & { response?: { data?: { message?: string } } };
    return err.response?.data?.message || err.message || "Failed to send invitation.";
  };

  const handleCreateWorkspaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim() || !newWorkspaceSlug.trim() || createWorkspaceMutation.isPending) return;

    setCreateError(null);

    createWorkspaceMutation.mutate(
      {
        name: newWorkspaceName.trim(),
        slug: newWorkspaceSlug.trim(),
        description: newWorkspaceDesc.trim() || undefined,
      },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setNewWorkspaceName("");
          setNewWorkspaceSlug("");
          setNewWorkspaceDesc("");
        },
        onError: (err: Error) => {
          const axiosErr = err as Error & { response?: { data?: { message?: string } } };
          setCreateError(axiosErr.response?.data?.message || axiosErr.message || "Failed to create workspace.");
        },
      }
    );
  };

  return (
    <>
      <OrgHeroSection
        orgName={org?.name || ""}
        onLaunchClick={() => alert(`Launching ${org?.name}...`)}
        onInviteMember={canInviteMembers ? () => setInviteOpen(true) : undefined}
        workspaceCount={workspaces.length}
      />
      <WorkspacesGrid
        onEnterWorkspace={() => {}}
        onCreateWorkspace={() => setCreateOpen(true)}
        workspaces={workspaces}
        orgId={orgId}
      />

      {/* Create Workspace Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-[4px]" onClick={() => setCreateOpen(false)} />
          <form
            onSubmit={handleCreateWorkspaceSubmit}
            className="relative w-full max-w-[380px] bg-zinc-950/95 border border-zinc-900 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-4"
          >
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Create Workspace</h3>
              <p className="text-[11px] text-zinc-500">Launch a new workspace within {org?.name}.</p>
            </div>
            {createError && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px]">
                {createError}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Workspace name</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Sandbox"
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-700 outline-none"
                  value={newWorkspaceName}
                  onChange={(e) => {
                    setNewWorkspaceName(e.target.value);
                    if (!newWorkspaceSlug) {
                      setNewWorkspaceSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                    }
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Slug</label>
                <input
                  type="text"
                  placeholder="e.g. frontend-sandbox"
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-700 outline-none font-mono"
                  value={newWorkspaceSlug}
                  onChange={(e) => setNewWorkspaceSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Overview / description</label>
                <textarea
                  placeholder="Summarize the core purpose of this workspace..."
                  className="w-full h-16 bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-zinc-700 outline-none resize-none"
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                className="flex-grow py-2.5 rounded-xl border border-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold cursor-pointer text-center"
                onClick={() => { setCreateOpen(false); setCreateError(null); }}
                disabled={createWorkspaceMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-grow py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createWorkspaceMutation.isPending}
              >
                {createWorkspaceMutation.isPending ? "Creating..." : "Launch Workspace"}
              </button>
            </div>
          </form>
        </div>
      )}

      <InviteMemberModal
        isOpen={inviteOpen}
        onClose={() => { setInviteOpen(false); inviteMutation.reset(); }}
        onSubmit={handleInviteSubmit}
        isSubmitting={inviteMutation.isPending}
        error={getInviteError()}
        success={inviteMutation.isSuccess}
        organizations={org ? [org] : []}
        preselectedOrgId={orgId}
      />
    </>
  );
}
