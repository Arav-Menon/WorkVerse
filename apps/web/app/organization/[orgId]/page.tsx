"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AppNavbar from "@/components/shared/AppNavbar";
import OrgSidebar from "@/app/workspace/components/OrgSidebar";
import OrgHeroSection from "@/app/workspace/components/OrgHeroSection";
import WorkspacesGrid from "@/app/workspace/components/WorkspacesGrid";
import ConnectionsDeck from "@/app/workspace/components/ConnectionsDeck";
import AiLabDeck from "@/app/workspace/components/AiLabDeck";
import AiLabRightPanel from "@/app/workspace/components/AiLabRightPanel";
import InviteMemberModal from "@/components/shared/InviteMemberModal";
import { useOrganization, useInviteMember } from "@/hooks/use-organization";
import { useOrganizationWorkspaces, useCreateWorkspace } from "@/hooks/use-workspaces";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.orgId as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Workspaces");
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const { data: org, isLoading: orgLoading, error: orgError } = useOrganization(orgId);
  const { data: workspaces = [], isLoading: wsLoading, error: wsError } = useOrganizationWorkspaces(orgId);
  const createWorkspaceMutation = useCreateWorkspace(orgId);
  const inviteMutation = useInviteMember(orgId);

  const [inviteOpen, setInviteOpen] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceSlug, setNewWorkspaceSlug] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");

  const handleInviteSubmit = async (data: { name: string; email: string }) => {
    inviteMutation.reset();
    await inviteMutation.mutateAsync(data);
  };

  const loading = orgLoading || wsLoading;
  const error = orgError ? (orgError as Error).message : wsError ? (wsError as Error).message : null;

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
    <div className="h-screen max-h-screen flex flex-col relative overflow-hidden bg-black text-zinc-50 font-sans selection:bg-white/10 selection:text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-white/[0.01] rounded-full blur-[90px]" />
      </div>

      <AppNavbar
        currentWorkspace={org?.name || ""}
        switcherOpen={switcherOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={() => {}}
        onSearchClick={() => {}}
        setSidebarOpen={setSidebarOpen}
        breadcrumb={org?.name}
      />

      <div className="flex flex-1 h-[calc(100vh-56px)] overflow-hidden relative z-10">
        <OrgSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          orgId={orgId}
        />

        <main className="flex-grow h-full overflow-y-auto p-4 sm:p-6 md:p-8 select-none max-w-none relative scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
          <div className="w-full">
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-48 bg-zinc-900/50 rounded-2xl"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-zinc-900/50 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <i className="ti ti-alert-circle text-xl"></i>
                </div>
                <p className="text-sm text-red-400 font-medium">Failed to load organization</p>
                <p className="text-xs text-zinc-500 max-w-[300px] text-center">{error}</p>
                <button
                  onClick={() => router.push("/organization")}
                  className="mt-2 p-2 px-4 text-xs font-semibold rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white border border-zinc-900 transition-colors cursor-pointer"
                >
                  Back to organizations
                </button>
              </div>
            ) : activeSection === "Workspaces" || activeSection === "Home" ? (
              <>
                <OrgHeroSection
                  orgName={org?.name || ""}
                  onLaunchClick={() => alert(`Launching ${org?.name}...`)}
                  onInviteMember={() => setInviteOpen(true)}
                  workspaceCount={workspaces.length}
                />
                <WorkspacesGrid
                  onEnterWorkspace={() => {}}
                  onCreateWorkspace={() => setCreateOpen(true)}
                  workspaces={workspaces}
                  orgId={orgId}
                />
              </>
            ) : activeSection === "AI Lab" ? (
              <div className="flex gap-0">
                <AiLabDeck orgName={org?.name || ""} />
                <AiLabRightPanel />
              </div>
            ) : activeSection === "Connections" ? (
              <ConnectionsDeck workspaceName={org?.name || ""} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[350px] text-center gap-4 bg-zinc-950/20 border border-zinc-900 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500">
                  <i className="ti ti-tool text-xl"></i>
                </div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-widest">{activeSection}</h2>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  This section is coming soon.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

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
        error={inviteMutation.error?.message || null}
        success={inviteMutation.isSuccess}
        organizations={org ? [org] : []}
        preselectedOrgId={orgId}
      />
    </div>
  );
}
