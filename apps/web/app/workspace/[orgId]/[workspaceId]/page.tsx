"use client";

import React, { use, useState, useEffect } from "react";
import AppNavbar from "@/components/shared/AppNavbar";
import OrgSidebar from "../../components/OrgSidebar";
import OrgHeroSection from "../../components/OrgHeroSection";
import WorkspacesGrid from "../../components/WorkspacesGrid";
import ConnectionsDeck from "../../components/ConnectionsDeck";
import AiLabDeck from "../../components/AiLabDeck";
import AiLabRightPanel from "../../components/AiLabRightPanel";
import { fetchWorkspaceById } from "@/lib/api/org.api";

interface PageProps {
  params: Promise<{ orgId: string; workspaceId: string }>;
}

export default function OrgPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const orgId = unwrappedParams.orgId;
  const workspaceId = unwrappedParams.workspaceId;

  const [workspaceName, setWorkspaceName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Workspaces");
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [newWorkspaceType, setNewWorkspaceType] = useState("Engineering");

  useEffect(() => {
    if (!orgId || !workspaceId) return;
    fetchWorkspaceById(orgId, workspaceId)
      .then((ws) => setWorkspaceName(ws.name))
      .catch(() => setWorkspaceName("Workspace"));
  }, [orgId, workspaceId]);

  const handleEnterWorkspace = (name: string) => {
    alert(`Connecting to ${name} realtime voice channels and nodes...`);
  };

  const handleCreateWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    alert(`Workspace "${newWorkspaceName}" successfully registered inside WorkVerse network!`);
    setCreateOpen(false);
    setNewWorkspaceName("");
    setNewWorkspaceDesc("");
  };

  return (
    <div className="h-screen max-h-screen flex flex-col relative overflow-hidden bg-black text-zinc-50 font-sans selection:bg-white/10 selection:text-white">
      {/* Premium Deeper Ambient Background System */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Richer Vertical Gradient (Neutral gray matching landing page) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>

        {/* Faint white grid lines matching landing page */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Radial subtle ambient white lights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.015] rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-white/[0.01] rounded-full blur-[90px]" />
      </div>

      {/* Header navbar overlay */}
      <AppNavbar 
        currentWorkspace={workspaceName}
        switcherOpen={switcherOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={() => {}}
        onSearchClick={() => setSearchOpen(true)}
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
        />

        {/* Main core center scroll dashboard */}
        <main className="flex-grow h-full overflow-y-auto p-4 sm:p-6 md:p-8 select-none max-w-none relative scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-transparent">
          <div className="w-full">
            {activeSection === "Workspaces" || activeSection === "Home" ? (
              <>
                <OrgHeroSection 
                  orgName={workspaceName} 
                  onLaunchClick={() => alert(`Spawning voice server nodes inside ${workspaceName}...`)}
                />
                <WorkspacesGrid 
                  onEnterWorkspace={handleEnterWorkspace}
                  onCreateWorkspace={() => setCreateOpen(true)}
                />
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

      {/* 1. Modal Command Palette search */}
      {searchOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-[4px]" onClick={() => setSearchOpen(false)} />
          
          <div className="relative w-full max-w-[460px] bg-zinc-950/95 border border-zinc-900 rounded-2xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-zinc-900 pb-3 mb-4">
              <i className="ti ti-search text-zinc-500"></i>
              <input 
                type="text" 
                placeholder="Search resources, nodes, automated agents..." 
                className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-zinc-600"
                autoFocus
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Teammate Rooms</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900/60 text-xs text-zinc-400 cursor-pointer">
                    <span>Engineering Hub (7 online)</span>
                    <kbd className="font-mono text-[9px] text-zinc-600">Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900/60 text-xs text-zinc-400 cursor-pointer">
                    <span>Product Strategy (11 online)</span>
                    <kbd className="font-mono text-[9px] text-zinc-600">Enter</kbd>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Recent searches</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-zinc-900 border border-zinc-900 text-zinc-400 rounded px-2.5 py-1">n8n workflows</span>
                  <span className="text-[10px] bg-zinc-900 border border-zinc-900 text-zinc-400 rounded px-2.5 py-1">payroll api</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Create Workspace Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-[4px]" onClick={() => setCreateOpen(false)} />
          
          <form 
            onSubmit={handleCreateWorkspaceSubmit}
            className="relative w-full max-w-[380px] bg-zinc-950/95 border border-zinc-900 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-4"
          >
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Create Workspace</h3>
              <p className="text-[11px] text-zinc-500">Launch a brand new team cockpit within {workspaceName}.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Workspace name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Sandbox" 
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-700 outline-none"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Category Tag</label>
                <select 
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-400 outline-none"
                  value={newWorkspaceType}
                  onChange={(e) => setNewWorkspaceType(e.target.value)}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="AI Lab">AI Lab</option>
                  <option value="Ops">Operations</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Overview / description</label>
                <textarea 
                  placeholder="Summarize the core purpose of this workspace room..." 
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
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-grow py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-semibold cursor-pointer text-center"
              >
                Launch Workspace
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
