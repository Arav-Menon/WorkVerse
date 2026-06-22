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
import { registerOrganization, fetchAllOrganizations, type FetchOrganization } from "@/lib/api/org.api";

interface Org {
  id: string;
  name: string;
  slug: string;
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

export default function OrganizationPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal");

  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const [newOrgDesc, setNewOrgDesc] = useState("");
  const [newOrgColor, setNewOrgColor] = useState<"purple" | "teal" | "coral" | "blue">("purple");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createOrgError, setCreateOrgError] = useState<string | null>(null);

  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState("");

  const [orgs, setOrgs] = useState<Org[]>([]);
  const [rawOrgs, setRawOrgs] = useState<FetchOrganization[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsError, setOrgsError] = useState<string | null>(null);

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

  const [activeTab, setActiveTab] = useState("Home");

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

  useEffect(() => {
    async function loadOrgs() {
      try {
        setOrgsLoading(true);
        setOrgsError(null);
        const data = await fetchAllOrganizations();
        setRawOrgs(data);
        const mapped: Org[] = data.map((org) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          desc: org.description ?? "Team collaboration hub",
          members: 1,
          workspaces: org.workspaceCount,
          online: 1,
          avatar: org.name.substring(0, 2).toUpperCase(),
          color: "purple" as const,
          updated: "Just now",
        }));
        setOrgs(mapped);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load organizations.";
        setOrgsError(message);
      } finally {
        setOrgsLoading(false);
      }
    }
    loadOrgs();
  }, []);

  const handleWorkspaceChange = (workspace: string) => {
    setCurrentWorkspace(workspace);
  };

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

    let taskCounter = 0;

    const interval = setInterval(() => {
      const randEvent = events[Math.floor(Math.random() * events.length)];
      if (randEvent) {
        setActivities((prev) => [
          {
            id: `act-${Date.now()}-${Math.random()}`,
            dotColor: randEvent.dotColor,
            text: randEvent.text,
            time: "just now",
            user: randEvent.user,
          },
          ...prev.slice(0, 7),
        ]);
      }

      if (Math.random() > 0.4) {
        const randTask = aiTasksPool[Math.floor(Math.random() * aiTasksPool.length)];
        if (randTask) {
          taskCounter++;
          setAiTasks((prev) => [
            {
              id: `task-${taskCounter}`,
              text: randTask.text,
              tag: randTask.tag,
              status: randTask.status,
            },
            ...prev.filter((t) => t.status === "completed").slice(0, 4),
            { id: `running-${taskCounter}`, text: "Updating distributed node logs…", tag: "running", status: "running" },
          ]);
        }
      }
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || !newOrgSlug.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setCreateOrgError(null);

    try {
      const created = await registerOrganization({
        name: newOrgName.trim(),
        slug: newOrgSlug.trim(),
        description: newOrgDesc.trim() || undefined,
      });

      const newOrg: Org = {
        id: created.id,
        name: created.name,
        slug: created.slug,
        desc: created.description ?? "Team collaboration hub",
        members: 1,
        workspaces: 1,
        online: 1,
        avatar: created.name.substring(0, 2).toUpperCase(),
        color: newOrgColor,
        updated: "Just now",
      };

      setOrgs((prev) => [...prev, newOrg]);
      setNewOrgName("");
      setNewOrgSlug("");
      setNewOrgDesc("");
      setNewOrgColor("purple");
      setCreateOrgOpen(false);

      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          dotColor: "green",
          text: `created organization ${newOrg.name}`,
          time: "just now",
          user: "Arav",
        },
        ...prev,
      ]);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create organization. Please try again.";
      setCreateOrgError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        setSidebarOpen={setSidebarOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={handleWorkspaceChange}
        onSearchClick={() => setCmdPaletteOpen(true)}
      />

      <div className="flex flex-1 h-[calc(100vh-56px)] relative z-10 overflow-hidden">

        <AppSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          orgs={orgs}
          fetchOrganizations={rawOrgs}
        />

        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-none w-full overflow-y-auto relative z-10" id="main-content">

          <StatsSection orgCount={orgs.length} />

          {orgsLoading ? (
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest select-none">Your organizations</span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 h-[160px] animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-zinc-800"></div>
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-zinc-800 rounded mb-2"></div>
                        <div className="h-2.5 w-16 bg-zinc-900 rounded"></div>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2.5">
                      <div className="h-5 w-16 bg-zinc-900 rounded-md"></div>
                      <div className="h-5 w-18 bg-zinc-900 rounded-md"></div>
                    </div>
                    <div className="h-2.5 w-20 bg-zinc-900 rounded mt-3"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : orgsError ? (
            <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5">
              <i className="ti ti-alert-circle mt-0.5 shrink-0" aria-hidden="true"></i>
              <div>
                <p className="font-semibold mb-1">Failed to load organizations</p>
                <p className="text-red-400/70">{orgsError}</p>
              </div>
            </div>
          ) : orgs.length === 0 ? (
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest select-none">Your organizations</span>
              </div>
              <div className="border border-dashed border-zinc-800 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                  <i className="ti ti-building"></i>
                </div>
                <p className="text-sm text-zinc-300 font-medium">No organizations yet</p>
                <p className="text-xs text-zinc-500 max-w-[260px]">Create your first organization to start collaborating with your team.</p>
                <button
                  onClick={() => setCreateOrgOpen(true)}
                  className="mt-2 p-2 px-4 text-xs font-bold rounded-lg text-black bg-white hover:bg-zinc-200 transition-all cursor-pointer"
                >
                  Create Organization
                </button>
              </div>
            </div>
          ) : (
            <OrgsSection
              orgs={orgs}
              onOrgClick={(orgId) => router.push(`/organization/${orgId}`)}
              onCreateClick={() => setCreateOrgOpen(true)}
              onViewAllClick={() => setActiveTab("Organizations")}
            />
          )}

          <div className="flex items-center gap-2.5 my-7" role="separator">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase whitespace-nowrap select-none">Continue recent work</span>
            <div className="flex-grow h-px bg-zinc-900" aria-hidden="true"></div>
          </div>

          <RecentWorkSection onViewAllClick={() => alert("Recently opened index is up to date.")} />

          <div className="flex items-center gap-2.5 my-7" role="separator">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase whitespace-nowrap select-none">Live feed</span>
            <div className="flex-grow h-px bg-zinc-900" aria-hidden="true"></div>
          </div>

          <FeedSection
            activities={activities}
            aiTasks={aiTasks}
            onAiViewAllClick={() => setActiveTab("AI Lab")}
          />

          <div className="flex items-center gap-2.5 my-7" role="separator">
            <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase whitespace-nowrap select-none">Quick actions</span>
            <div className="flex-grow h-px bg-zinc-900" aria-hidden="true"></div>
          </div>

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

      <CreateOrgModal
        isOpen={createOrgOpen}
        onClose={() => { setCreateOrgOpen(false); setCreateOrgError(null); }}
        newOrgName={newOrgName}
        setNewOrgName={setNewOrgName}
        newOrgSlug={newOrgSlug}
        setNewOrgSlug={setNewOrgSlug}
        newOrgDesc={newOrgDesc}
        setNewOrgDesc={setNewOrgDesc}
        newOrgColor={newOrgColor}
        setNewOrgColor={setNewOrgColor}
        onSubmit={handleCreateOrg}
        isSubmitting={isSubmitting}
        error={createOrgError}
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
