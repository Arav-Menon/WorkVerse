"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "../../components/shared/AppNavbar";
import AppSidebar from "../../components/shared/AppSidebar";
import AiLabHero from "./components/AiLabHero";
import LabWorkspacesGrid from "./components/LabWorkspacesGrid";
import PromptPlaygroundSection from "./components/PromptPlaygroundSection";
import ModelTestingSection from "./components/ModelTestingSection";
import LiveAgentsPanel from "./components/LiveAgentsPanel";
import SharedIntelligenceSection from "./components/SharedIntelligenceSection";
import LabActivityTimeline from "./components/LabActivityTimeline";
export default function AiLabPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal");

  const [orgs] = useState([
    { id: "org-1", name: "ClevenStudios", slug: "clevenstudios", desc: "Product design & dev", members: 12, workspaces: 4, avatar: "CS", color: "purple" as const, createdAt: "2025-01-15T00:00:00Z" },
    { id: "org-2", name: "NexaLabs", slug: "nexalabs", desc: "AI research & infra", members: 31, workspaces: 7, avatar: "NX", color: "teal" as const, createdAt: "2025-02-10T00:00:00Z" },
    { id: "org-3", name: "SkyForge", slug: "skyforge", desc: "Cloud infrastructure", members: 9, workspaces: 3, avatar: "SK", color: "coral" as const, createdAt: "2025-03-05T00:00:00Z" },
  ]);

  const handleNavChange = (ws: string) => {
    setCurrentWorkspace(ws);
    router.push(`/organization/${encodeURIComponent(ws)}`);
  };

  return (
    <div className="h-screen bg-black text-zinc-400 font-sans antialiased selection:bg-white/10 selection:text-white flex flex-col relative overflow-hidden">
      {/* Ambient background (same as other pages) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[55%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[30%] left-[20%] w-[60%] h-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.01),transparent_75%)] blur-[130px] pointer-events-none"></div>
      </div>

      <AppNavbar
        currentWorkspace={currentWorkspace}
        switcherOpen={switcherOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={handleNavChange}
        onSearchClick={() => {}}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 min-h-0 h-[calc(100vh-56px)] relative z-10 overflow-hidden">
        <AppSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          orgs={orgs}
        />
        <main className="flex-1 min-h-0 w-full max-w-none px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-8 md:py-12 relative z-10 mx-auto overflow-y-auto">
          <AiLabHero />
          <LabWorkspacesGrid />
          <PromptPlaygroundSection />
          <ModelTestingSection />
          <LiveAgentsPanel />
          <SharedIntelligenceSection />
          <LabActivityTimeline />
        </main>
      </div>
    </div>
  );
}
