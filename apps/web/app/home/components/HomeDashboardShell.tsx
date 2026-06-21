"use client";

import React, { useDeferredValue, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "../../../components/shared/AppSidebar";
import type { HomePageData } from "./home-data";
import HomeHero from "./HomeHero";
import HomeStatsSection from "./HomeStatsSection";
import OrganizationSection from "./OrganizationSection";
import RecentActivityPanel from "./RecentActivityPanel";
import AppNavbar from "@/components/shared/AppNavbar";

interface HomeDashboardShellProps {
  data: HomePageData;
}

export default function HomeDashboardShell({ data }: HomeDashboardShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState("Personal");
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, startFilterTransition] = useTransition();
  const deferredQuery = useDeferredValue(searchQuery);

  const handleWorkspaceChange = (workspace: string) => {
    setCurrentWorkspace(workspace);
    router.push(`/organization/${encodeURIComponent(workspace)}`);
  };

  const filteredOrganizations = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return data.organizations;
    }

    return data.organizations.filter((organization) => {
      const haystack = [
        organization.name,
        organization.description,
        organization.role,
        ...organization.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [data.organizations, deferredQuery]);

  const sharedSidebarOrganizations = data.organizations.map((organization) => ({
    name: organization.name,
    slug: organization.slug,
    desc: organization.description,
    members: organization.members,
    workspaces: organization.workspaces,
    online: organization.online,
    avatar: organization.avatar,
    color: organization.color,
    updated: organization.updated,
  }));

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
              hero={data.hero}
              onPrimaryAction={() => router.push("/organization")}
              onSecondaryAction={() => router.push("/ai-lab")}
            />
            <HomeStatsSection stats={data.stats} />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
              <OrganizationSection
                organizations={filteredOrganizations}
                query={searchQuery}
                onQueryChange={(value) => startFilterTransition(() => setSearchQuery(value))}
                isFiltering={isFiltering}
                onOrganizationOpen={(slug) => router.push(`/organization/${encodeURIComponent(slug)}`)}
              />
              <RecentActivityPanel activity={data.activity} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
