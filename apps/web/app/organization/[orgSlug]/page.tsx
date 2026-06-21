"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import AppNavbar from "@/components/shared/AppNavbar";
import AppSidebar from "@/components/shared/AppSidebar";
import InviteMemberModal from "@/components/shared/InviteMemberModal";
import { fetchOrganizationBySlug, fetchAllOrganizations, type FetchOrganization } from "@/lib/api/org.api";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal");

  const [org, setOrg] = useState<FetchOrganization | null>(null);
  const [allOrgs, setAllOrgs] = useState<FetchOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  useEffect(() => {
    if (!orgSlug) return;

    async function loadOrg() {
      try {
        setLoading(true);
        setError(null);
        const [data, orgsData] = await Promise.all([
          fetchOrganizationBySlug(orgSlug),
          fetchAllOrganizations(),
        ]);
        setOrg(data);
        setAllOrgs(orgsData);
        setCurrentWorkspace(data.name);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load organization.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadOrg();
  }, [orgSlug]);

  const handleWorkspaceChange = (workspace: string) => {
    setCurrentWorkspace(workspace);
    router.push(`/workspace/${encodeURIComponent(workspace.toLowerCase())}`);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="h-screen max-h-screen bg-black text-zinc-400 font-sans antialiased select-none flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[55%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] blur-[120px] pointer-events-none"></div>
      </div>

      <AppNavbar
        currentWorkspace={currentWorkspace}
        switcherOpen={switcherOpen}
        setSidebarOpen={setSidebarOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={handleWorkspaceChange}
        onSearchClick={() => {}}
      />

      <div className="flex flex-1 h-[calc(100vh-56px)] relative z-10 overflow-hidden">
        <AppSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          orgs={[]}
          fetchOrganizations={allOrgs}
        />

        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-none w-full overflow-y-auto relative z-10" id="main-content">

          {loading ? (
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-zinc-800"></div>
                <div>
                  <div className="h-5 w-40 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-zinc-900 rounded"></div>
                </div>
              </div>
              <div className="h-3 w-64 bg-zinc-900 rounded mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 h-24"></div>
                ))}
              </div>
              <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 h-48"></div>
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
          ) : org ? (
            <div>
              <button
                onClick={() => router.push("/organization")}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-6 cursor-pointer"
              >
                <i className="ti ti-arrow-left text-[11px]"></i>
                All organizations
              </button>

              <header className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/50 text-purple-300 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {org.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-white tracking-tight">{org.name}</h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    @{org.slug}
                  </p>
                </div>
                <button
                  onClick={() => setInviteOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                >
                  <i className="ti ti-user-plus text-[13px]"></i>
                  Invite member
                </button>
              </header>

              {org.description && (
                <p className="text-sm text-zinc-400 mb-8 max-w-[560px] leading-relaxed">
                  {org.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className="ti ti-layout-grid text-[11px] text-zinc-500"></i>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Workspaces</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{org.workspaceCount}</p>
                </div>
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className="ti ti-calendar text-[11px] text-zinc-500"></i>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Created</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{formatDate(org.createdAt)}</p>
                </div>
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <i className="ti ti-id text-[11px] text-zinc-500"></i>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Org ID</span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 truncate">{org.id}</p>
                </div>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6">
                <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Workspaces</h2>
                {org.workspaceCount === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mx-auto mb-3">
                      <i className="ti ti-layout-grid"></i>
                    </div>
                    <p className="text-xs text-zinc-500">No workspaces yet</p>
                    <button
                      onClick={() => alert("Create workspace flow coming soon")}
                      className="mt-3 p-1.5 px-3 text-[11px] font-semibold rounded-lg text-black bg-white hover:bg-zinc-200 transition-all cursor-pointer"
                    >
                      Create workspace
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">Workspaces for this organization will appear here.</p>
                )}
              </div>
            </div>
          ) : null}

        </main>
      </div>

      <InviteMemberModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        organizations={allOrgs}
        preselectedOrgId={org?.id}
      />
    </div>
  );
}
