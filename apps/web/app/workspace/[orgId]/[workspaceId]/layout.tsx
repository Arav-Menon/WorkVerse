"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import AppNavbar from "@/components/shared/AppNavbar";
import OrgSidebar from "@/app/workspace/components/OrgSidebar";
import { useWorkspace } from "@/hooks/use-workspaces";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const orgId = params.orgId as string;
  const workspaceId = params.workspaceId as string;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const { data: workspace } = useWorkspace(orgId, workspaceId);

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

      <AppNavbar
        currentWorkspace={workspaceName}
        switcherOpen={switcherOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={() => {}}
        onSearchClick={() => {}}
        setSidebarOpen={setSidebarOpen}
        breadcrumb={workspaceName}
      />

      <div className="flex flex-1 h-[calc(100vh-56px)] overflow-hidden relative z-10">
        <OrgSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          orgId={orgId}
          workspaceId={workspaceId}
        />

        <main className="flex-grow h-full overflow-y-auto p-4 sm:p-6 md:p-8 select-none max-w-none relative scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
