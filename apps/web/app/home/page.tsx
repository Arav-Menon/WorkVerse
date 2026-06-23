"use client";

import React, { useDeferredValue, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/shared/AppSidebar";
import AppNavbar from "@/components/shared/AppNavbar";
import HomeHero from "./components/HomeHero";
import HomeStatsSection from "./components/HomeStatsSection";
import OrganizationSection from "./components/OrganizationSection";
import RecentActivityPanel from "./components/RecentActivityPanel";
import { useOrganizations } from "@/hooks/use-organization";
import type { FetchOrganization } from "@/lib/api/org.api";

const ORG_COLORS = ["purple", "teal", "coral", "blue"] as const;
const ACTIVITY_PLACEHOLDER = [
  {
    id: "act-1",
    title: "Welcome to WorkVerse",
    detail: "Your organizations and workspaces will appear here as your team collaborates.",
    time: "Just now",
    actor: "System",
    avatar: "WV",
    icon: "ti-sparkles",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getColor(index: number) {
  return ORG_COLORS[index % ORG_COLORS.length] ?? "purple";
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapOrgToHome(
  org: FetchOrganization,
  index: number
) {
  return {
    id: org.id,
    slug: org.slug,
    name: org.name,
    description: org.description || "No description",
    members: org.memberCount,
    workspaces: org.workspaceCount,
    online: 0,
    avatar: getInitials(org.name),
    color: getColor(index),
    updated: formatRelativeTime(org.createdAt),
    role: "Member",
    tags: [] as string[],
  };
}

export default function HomePage() {
  const router = useRouter();
  const { data: organizations = [], isLoading } = useOrganizations();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal");
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, startFilterTransition] = useTransition();
  const deferredQuery = useDeferredValue(searchQuery);

  const homeOrgs = useMemo(
    () => organizations.map(mapOrgToHome),
    [organizations]
  );

  const totalWorkspaces = useMemo(
    () => organizations.reduce((sum, org) => sum + org.workspaceCount, 0),
    [organizations]
  );

  const totalMembers = useMemo(
    () => organizations.reduce((sum, org) => sum + org.memberCount, 0),
    [organizations]
  );

  const stats = useMemo(
    () => [
      {
        label: "Organizations",
        value: String(organizations.length),
        helper: "Member access",
        icon: "ti-layout-grid",
      },
      {
        label: "Workspaces",
        value: String(totalWorkspaces),
        helper: "Across all orgs",
        icon: "ti-stack-2",
      },
      {
        label: "Total members",
        value: String(totalMembers),
        helper: "In your network",
        icon: "ti-users",
      },
      {
        label: "Your roles",
        value: String(organizations.length),
        helper: "Org memberships",
        icon: "ti-badge",
      },
    ],
    [organizations.length, totalWorkspaces, totalMembers]
  );

  const filteredOrganizations = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    if (!normalizedQuery) return homeOrgs;
    return homeOrgs.filter((org) => {
      const haystack = [org.name, org.description, org.role, ...org.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [homeOrgs, deferredQuery]);

  const sharedSidebarOrganizations = homeOrgs.map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    desc: org.description,
    members: org.members,
    workspaces: org.workspaces,
    online: org.online,
    avatar: org.avatar,
    color: org.color,
    updated: org.updated,
  }));

  const handleWorkspaceChange = (workspace: string) => {
    setCurrentWorkspace(workspace);
    router.push(`/organization/${encodeURIComponent(workspace)}`);
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black text-zinc-400 font-sans antialiased selection:bg-white/10 selection:text-white">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111114] via-[#050505] to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-[-10%] top-[-18%] h-[48rem] w-[48rem] rounded-full bg-white/[0.035] blur-[160px]" />
        <div className="absolute bottom-[-18%] right-[-10%] h-[42rem] w-[42rem] rounded-full bg-cyan-500/[0.06] blur-[160px]" />
      </div>

      <AppNavbar
        currentWorkspace={currentWorkspace}
        switcherOpen={switcherOpen}
        setSidebarOpen={setSidebarOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={handleWorkspaceChange}
        onSearchClick={() => setCmdPaletteOpen(true)}
      />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <AppSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          orgs={sharedSidebarOrganizations}
        />

        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:px-8">
          <div className="mx-auto max-w-[1400px] space-y-6">
            <HomeHero
              hero={{
                eyebrow: "Organization overview",
                title:
                  "All organizations you belong to, in one premium control surface.",
                description:
                  "Search teams, jump into active workspaces, and track live movement across your Workverse network without leaving the home dashboard.",
                primaryAction: "Open organization hub",
                secondaryAction: "Launch virtual office",
              }}
              onPrimaryAction={() => router.push("/organization")}
              onSecondaryAction={() => router.push("/ai-lab")}
            />

            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-2xl border border-zinc-900 bg-zinc-950/50 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <HomeStatsSection stats={stats} />
            )}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
              <OrganizationSection
                organizations={filteredOrganizations}
                query={searchQuery}
                onQueryChange={(value: string) =>
                  startFilterTransition(() => setSearchQuery(value))
                }
                isFiltering={isFiltering}
                onOrganizationOpen={(slug: string) =>
                  router.push(`/organization/${encodeURIComponent(slug)}`)
                }
              />
              <RecentActivityPanel activity={ACTIVITY_PLACEHOLDER} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
