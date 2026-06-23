"use client";

import React, { use, useState } from "react";
import AppNavbar from "@/components/shared/AppNavbar";
import OrgSidebar from "../../components/OrgSidebar";
import OrgHeroSection from "../../components/OrgHeroSection";
import ConnectionsDeck from "../../components/ConnectionsDeck";
import AiLabDeck from "../../components/AiLabDeck";
import AiLabRightPanel from "../../components/AiLabRightPanel";
import { useWorkspace } from "@/hooks/use-workspaces";

interface PageProps {
  params: Promise<{ orgId: string; workspaceId: string }>;
}

export default function WorkspaceDetailPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const orgId = unwrappedParams.orgId;
  const workspaceId = unwrappedParams.workspaceId;

  const { data: workspace, isLoading, error } = useWorkspace(orgId, workspaceId);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Workspaces");
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const workspaceName = workspace?.name || "Workspace";

  return (
    <div className="h-screen max-h-screen flex flex-col relative overflow-hidden bg-black text-zinc-50 font-sans selection:bg-white/10 selection:text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-white/[0.01] rounded-full blur-[90px]" />
      </div>

      {/* Header navbar overlay */}
      <AppNavbar
        currentWorkspace={workspaceName}
        switcherOpen={switcherOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={() => {}}
        onSearchClick={() => {}}
        setSidebarOpen={setSidebarOpen}
        breadcrumb={workspaceName}
      />

      {/* Content wrapper splitting Sidebar, Dashboard, and Right panel */}
      <div className="flex flex-1 h-[calc(100vh-56px)] overflow-hidden relative z-10">
        <OrgSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          orgId={orgId}
        />

        {/* Main core center scroll dashboard */}
        <main className="flex-grow h-full overflow-y-auto p-4 sm:p-6 md:p-8 select-none max-w-none relative scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
          <div className="w-full">
            {isLoading ? (
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
                <p className="text-sm text-red-400 font-medium">Failed to load workspace</p>
                <p className="text-xs text-zinc-500 max-w-[300px] text-center">{(error as Error).message}</p>
              </div>
            ) : activeSection === "Workspaces" || activeSection === "Home" ? (
              <>
                <OrgHeroSection
                  orgName={workspaceName}
                  onLaunchClick={() => alert(`Spawning voice server nodes inside ${workspaceName}...`)}
                  workspaceCount={workspace?.spaceCount}
                />
                {workspace?.description && (
                  <p className="text-xs text-zinc-500 mb-6 max-w-[480px] leading-relaxed">{workspace.description}</p>
                )}
              </>
            ) : activeSection === "AI Lab" ? (
              <div className="flex gap-0">
                <AiLabDeck orgName={workspaceName} />
                <AiLabRightPanel />
              </div>
            ) : activeSection === "Connections" ? (
              <ConnectionsDeck workspaceName={workspaceName} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[350px] text-center gap-4 bg-zinc-950/20 border border-zinc-900 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500">
                  <i className="ti ti-tool text-xl"></i>
                </div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-widest">{activeSection} Control Deck</h2>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Real-time synchronization for this module is active in the background. Full control hooks are loading...
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
