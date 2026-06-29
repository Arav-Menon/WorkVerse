"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "../../components/shared/AppNavbar";
import AppSidebar from "../../components/shared/AppSidebar";
import StatsSection from "./components/StatsSection";
import OrgsSection from "./components/OrgsSection";
import QuickActionsSection from "./components/QuickActionsSection";
import CreateOrgModal from "./components/CreateOrgModal";
import CommandPaletteModal from "./components/CommandPaletteModal";
import { registerOrganization, fetchAllOrganizations } from "@/lib/api/org.api";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Org {
  id: string;
  name: string;
  slug: string;
  desc: string;
  members: number;
  workspaces: number;
  avatar: string;
  color: "purple" | "teal" | "coral" | "blue";
  createdAt: string;
}

export default function OrganizationPage() {
  const router = useRouter();
  const { user } = useCurrentUser();

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
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsError, setOrgsError] = useState<string | null>(null);

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
        const mapped: Org[] = data.map((org) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          desc: org.description ?? "No description",
          members: org.memberCount,
          workspaces: org.workspaceCount,
          avatar: org.name.substring(0, 2).toUpperCase(),
          color: "purple" as const,
          createdAt: org.createdAt,
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

  const totalWorkspaces = orgs.reduce((sum, o) => sum + o.workspaces, 0);
  const totalMembers = orgs.reduce((sum, o) => sum + o.members, 0);

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
        desc: created.description ?? "No description",
        members: 1,
        workspaces: 0,
        avatar: created.name.substring(0, 2).toUpperCase(),
        color: newOrgColor,
        createdAt: new Date().toISOString(),
      };

      setOrgs((prev) => [...prev, newOrg]);
      setNewOrgName("");
      setNewOrgSlug("");
      setNewOrgDesc("");
      setNewOrgColor("purple");
      setCreateOrgOpen(false);
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
    { name: "Open command terminal", sub: "Keyboard shortcut", icon: "ti-terminal", action: () => setCmdPaletteOpen(true) },
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
        />

        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-none w-full overflow-y-auto relative z-10" id="main-content">

          <StatsSection
            orgCount={orgs.length}
            totalWorkspaces={totalWorkspaces}
            totalMembers={totalMembers}
            userName={user?.name ?? "User"}
          />

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
            />
          )}

          {!orgsLoading && orgs.length > 0 && (
            <div className="mt-8">
              <QuickActionsSection
                onCreateOrgClick={() => setCreateOrgOpen(true)}
                onOpenCommandPaletteClick={() => setCmdPaletteOpen(true)}
              />
            </div>
          )}

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
