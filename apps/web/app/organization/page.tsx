"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "../../components/shared/AppNavbar";
import AppSidebar from "../../components/shared/AppSidebar";
import StatsSection from "./components/StatsSection";
import OrgsSection from "./components/OrgsSection";
import RecentWorkSection from "./components/RecentWorkSection";
import FeedSection from "./components/FeedSection";
import QuickActionsSection from "./components/QuickActionsSection";
import CreateOrgModal from "./components/CreateOrgModal";
import CommandPaletteModal from "./components/CommandPaletteModal";

interface Org {
  name: string;
  desc: string;
  members: number;
  workspaces: number;
  online: number;
  avatar: string;
  color: "purple" | "teal" | "coral" | "blue";
  updated: string;
}

interface Activity {
  id: string;
  dotColor: "purple" | "green" | "amber" | "blue" | "coral";
  text: string;
  time: string;
  user?: string;
}

interface AiTask {
  id: string;
  text: string;
  tag: string;
  status: "completed" | "running";
}

export default function HomePage() {
  const router = useRouter();

  // Mobile Sidebar Toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Switcher Menu Toggle
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal");

  // Create Organization Modal State
  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDesc, setNewOrgDesc] = useState("");
  const [newOrgColor, setNewOrgColor] = useState<"purple" | "teal" | "coral" | "blue">("purple");

  // Command Palette State
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");

  // Core Data Lists
  const [orgs, setOrgs] = useState<Org[]>([
    {
      name: "ClevenStudios",
      desc: "Product design & dev",
      members: 12,
      workspaces: 4,
      online: 8,
      avatar: "CS",
      color: "purple",
      updated: "5m ago",
    },
    {
      name: "NexaLabs",
      desc: "AI research & infra",
      members: 31,
      workspaces: 7,
      online: 14,
      avatar: "NX",
      color: "teal",
      updated: "1m ago",
    },
    {
      name: "SkyForge",
      desc: "Cloud infrastructure",
      members: 9,
      workspaces: 3,
      online: 2,
      avatar: "SK",
      color: "coral",
      updated: "18m ago",
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: "1", dotColor: "green", text: "joined Product Workspace", time: "just now", user: "Priya" },
    { id: "2", dotColor: "purple", text: "AI Agent completed email automation", time: "2m ago" },
    { id: "3", dotColor: "blue", text: "Design room updated with 3 new assets", time: "8m ago", user: "Design room" },
    { id: "4", dotColor: "amber", text: "Meeting scheduled — Investor sync Thu 3pm", time: "15m ago" },
    { id: "5", dotColor: "coral", text: "SkyForge workspace created by Rohan", time: "1h ago" },
  ]);

  const [aiTasks, setAiTasks] = useState<AiTask[]>([
    { id: "1", text: "Weekly report generated for ClevenStudios", tag: "report", status: "completed" },
    { id: "2", text: "Investor call transcript summarized", tag: "summary", status: "completed" },
    { id: "3", text: "Lead outreach emails sent (24 contacts)", tag: "outreach", status: "completed" },
    { id: "4", text: "n8n workflow executed — CI/CD trigger", tag: "workflow", status: "completed" },
    { id: "5", text: "Daily standup drafted and sent to team", tag: "ops", status: "completed" },
    { id: "6", text: "Processing sales pipeline update…", tag: "running", status: "running" },
  ]);

  // Sidebar navigation active state
  const [activeTab, setActiveTab] = useState("Home");

  // Keyboard shortcut listener for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Dynamic Workspace Switching Handler
  const handleWorkspaceChange = (workspace: string) => {
    setCurrentWorkspace(workspace);
    router.push(`/workspace/${encodeURIComponent(workspace.toLowerCase())}`);
  };

  // Dynamic Activity Simulation (makes the dashboard look incredibly premium and live!)
  useEffect(() => {
    const events: Omit<Activity, "id" | "time">[] = [
      { dotColor: "blue", text: "Agent synced workspace changes with GitHub", user: "GitNode" },
      { dotColor: "green", text: "joined Audio Room #3", user: "Aleksey" },
      { dotColor: "purple", text: "Autonomous Agent completed leads validation pipeline", user: "AI Validator" },
      { dotColor: "amber", text: "Meeting Alert: Standup starting in 5m", user: "Scheduler" },
      { dotColor: "coral", text: "deployed Axiom main build to production", user: "VercelNode" },
    ];

    const aiTasksPool: Omit<AiTask, "id">[] = [
      { text: "Optimized distributed system message queues", tag: "infra", status: "completed" },
      { text: "Analyzed user engagement metrics for Q3 review", tag: "analysis", status: "completed" },
      { text: "Scheduled automated social campaigns based on queue", tag: "outreach", status: "completed" },
      { text: "Synthesized product sync audio recordings", tag: "summary", status: "completed" },
    ];

    const interval = setInterval(() => {
      // Pick random event
      const randEvent = events[Math.floor(Math.random() * events.length)];
      if (randEvent) {
        setActivities((prev) => [
          {
            id: Math.random().toString(),
            dotColor: randEvent.dotColor,
            text: randEvent.text,
            time: "just now",
            user: randEvent.user,
          },
          ...prev.slice(0, 7), // Keep list clean
        ]);
      }

      // Occasionally add or resolve an AI task
      if (Math.random() > 0.4) {
        const randTask = aiTasksPool[Math.floor(Math.random() * aiTasksPool.length)];
        if (randTask) {
          setAiTasks((prev) => [
            {
              id: Math.random().toString(),
              text: randTask.text,
              tag: randTask.tag,
              status: randTask.status,
            },
            ...prev.filter(t => t.status === "completed").slice(0, 4),
            { id: "running-task", text: "Updating distributed node logs…", tag: "running", status: "running" },
          ]);
        }
      }
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  // Form submission for Organization creation
  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const newOrg: Org = {
      name: newOrgName,
      desc: newOrgDesc || "Team collaboration hub",
      members: 1,
      workspaces: 1,
      online: 1,
      avatar: newOrgName.substring(0, 2).toUpperCase(),
      color: newOrgColor,
      updated: "Just now",
    };

    setOrgs((prev) => [...prev, newOrg]);
    setNewOrgName("");
    setNewOrgDesc("");
    setNewOrgColor("purple");
    setCreateOrgOpen(false);

    // Push new activity
    setActivities((prev) => [
      {
        id: Math.random().toString(),
        dotColor: "green",
        text: `created organization ${newOrg.name}`,
        time: "just now",
        user: "Arav",
      },
      ...prev,
    ]);
  };

  // Filter commands in Palette
  const allCommands = [
    { name: "Create organization", sub: "Launch a new collaborative workspace", icon: "ti-building", action: () => setCreateOrgOpen(true) },
    { name: "Launch AI lab", sub: "Run autonomous prompt execution nodes", icon: "ti-robot", action: () => setActiveTab("AI Lab") },
    { name: "View Schedule", sub: "Check calendar events & sync team", icon: "ti-calendar", action: () => setActiveTab("Schedule") },
    { name: "Switch to NexaLabs", sub: "Enter Next-gen Workspace", icon: "ti-arrow-right", action: () => handleWorkspaceChange("NexaLabs") },
    { name: "Open Command Terminal", sub: "Run MCP command line", icon: "ti-terminal", action: () => alert("Terminal loaded successfully!") },
  ];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.name.toLowerCase().includes(cmdSearch.toLowerCase()) ||
    cmd.sub.toLowerCase().includes(cmdSearch.toLowerCase())
  );

  return (
    <div className="h-screen max-h-screen bg-black text-zinc-400 font-sans antialiased select-none flex flex-col relative overflow-hidden">
      
      {/* Premium Deeper Ambient Background System */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Richer Vertical Gradient (Neutral gray matching landing page) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>

        {/* Faint white grid lines matching landing page */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Dynamic ambient white glows (pure neutral white matching landing page) */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[55%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[30%] left-[20%] w-[60%] h-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.01),transparent_75%)] blur-[130px] pointer-events-none"></div>
      </div>

      {/* org Navbar */}
      <AppNavbar 
        currentWorkspace={currentWorkspace}
        switcherOpen={switcherOpen}
        setSidebarOpen={setSidebarOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={handleWorkspaceChange}
        onSearchClick={() => setCmdPaletteOpen(true)}
      />

      {/* Main Grid Wrapper */}
      <div className="flex flex-1 h-[calc(100vh-56px)] relative z-10 overflow-hidden">
        
        {/* org Sidebar */}
        <AppSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          orgs={orgs}
        />

        {/* Main Content Dashboard */}
        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-none w-full overflow-y-auto relative z-10" id="main-content">
          
          {/* Welcome Greeting & Quick Stats */}
          <StatsSection orgCount={orgs.length} />

          {/* User Organizations Grid */}
          <OrgsSection 
            orgs={orgs}
            onWorkspaceChange={handleWorkspaceChange}
            onCreateClick={() => setCreateOrgOpen(true)}
            onViewAllClick={() => setActiveTab("Organizations")}
          />

          {/* Section Divider */}
          <div className="flex items-center gap-2.5 my-7" role="separator">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase whitespace-nowrap select-none">Continue recent work</span>
            <div className="flex-grow h-px bg-zinc-900" aria-hidden="true"></div>
          </div>

          {/* Recently Opened Items */}
          <RecentWorkSection onViewAllClick={() => alert("Recently opened index is up to date.")} />

          {/* Section Divider */}
          <div className="flex items-center gap-2.5 my-7" role="separator">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase whitespace-nowrap select-none">Live feed</span>
            <div className="flex-grow h-px bg-zinc-900" aria-hidden="true"></div>
          </div>

          {/* Real-time Activity and AI Logs panels */}
          <FeedSection 
            activities={activities}
            aiTasks={aiTasks}
            onAiViewAllClick={() => setActiveTab("AI Lab")}
          />

          {/* Section Divider */}
          <div className="flex items-center gap-2.5 my-7" role="separator">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase whitespace-nowrap select-none">Quick actions</span>
            <div className="flex-grow h-px bg-zinc-900" aria-hidden="true"></div>
          </div>

          {/* Quick Actions Shortcuts */}
          <QuickActionsSection 
            onCreateOrgClick={() => setCreateOrgOpen(true)}
            onJoinWorkspaceClick={() => setCmdPaletteOpen(true)}
            onLaunchAiLabClick={() => setActiveTab("AI Lab")}
            onScheduleMeetingClick={() => setActiveTab("Schedule")}
            onCreateAutomationClick={() => setActiveTab("Automations")}
            onOpenRecentRoomClick={() => alert("Connecting virtual office audio rooms…")}
            onSendInviteClick={() => alert("Invite link copied to clipboard!")}
            onOpenCommandPaletteClick={() => setCmdPaletteOpen(true)}
          />

        </main>
      </div>

      {/* Dynamic Modals */}
      <CreateOrgModal 
        isOpen={createOrgOpen}
        onClose={() => setCreateOrgOpen(false)}
        newOrgName={newOrgName}
        setNewOrgName={setNewOrgName}
        newOrgDesc={newOrgDesc}
        setNewOrgDesc={setNewOrgDesc}
        newOrgColor={newOrgColor}
        setNewOrgColor={setNewOrgColor}
        onSubmit={handleCreateOrg}
      />

      <CommandPaletteModal 
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        cmdSearch={cmdSearch}
        setCmdSearch={setCmdSearch}
        filteredCommands={filteredCommands}
      />

    </div>
  );
}
