"use client";

import { useMemo } from "react";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import { cn } from "../../../lib/utils";
import type { HomeOrganization } from "./home-data";

const colorStyles: Record<HomeOrganization["color"], string> = {
  purple: "from-violet-500/20 to-violet-500/5 border-violet-500/20 text-violet-300",
  teal: "from-teal-500/20 to-teal-500/5 border-teal-500/20 text-teal-300",
  coral: "from-amber-500/20 to-orange-500/5 border-orange-500/20 text-amber-300",
  blue: "from-sky-500/20 to-sky-500/5 border-sky-500/20 text-sky-300",
};

interface OrganizationSectionProps {
  organizations: HomeOrganization[];
  query: string;
  onQueryChange: (value: string) => void;
  isFiltering: boolean;
  onOrganizationOpen: (slug: string) => void;
}

export default function OrganizationSection({
  organizations,
  query,
  onQueryChange,
  isFiltering,
  onOrganizationOpen,
}: OrganizationSectionProps) {
  const resultLabel = useMemo(() => {
    if (!query.trim()) {
      return `${organizations.length} organizations`;
    }

    return `${organizations.length} result${organizations.length === 1 ? "" : "s"}`;
  }, [organizations.length, query]);

  return (
    <Card className="h-full">
      <CardHeader className="gap-5 border-b border-zinc-900/80">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Memberships
            </p>
            <CardTitle className="mt-2 text-2xl">Your organizations</CardTitle>
            <CardDescription className="mt-2 max-w-2xl">
              Browse every team you belong to, jump into active spaces, and keep context visible.
            </CardDescription>
          </div>

          <div className="w-full max-w-sm">
            <div className="relative">
              <i className="ti ti-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500" aria-hidden="true" />
              <Input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search organization"
                className="pl-10"
                aria-label="Search organization"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">{resultLabel}</span>
          <span className={cn("text-zinc-600 transition-opacity", isFiltering && "text-zinc-400")}>
            {isFiltering ? "Updating results..." : "Live membership view"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isFiltering ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Skeleton className="h-16 rounded-2xl" />
                  <Skeleton className="h-16 rounded-2xl" />
                  <Skeleton className="h-16 rounded-2xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : organizations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {organizations.map((organization) => (
              <button
                key={organization.id}
                className="group text-left"
                onClick={() => onOrganizationOpen(organization.slug)}
              >
                <Card className="h-full border-zinc-900 p-5 transition-all hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className={cn("h-12 w-12 rounded-2xl bg-gradient-to-br", colorStyles[organization.color])}>
                        <AvatarFallback>{organization.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{organization.name}</h3>
                        <p className="mt-1 text-sm text-zinc-500">{organization.role}</p>
                      </div>
                    </div>
                    <span className="rounded-full border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      {organization.updated}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-zinc-400">{organization.description}</p>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-zinc-900 bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Members</p>
                      <p className="mt-2 text-lg font-semibold text-white">{organization.members}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-900 bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Workspaces</p>
                      <p className="mt-2 text-lg font-semibold text-white">{organization.workspaces}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-900 bg-black/20 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Online</p>
                      <p className="mt-2 text-lg font-semibold text-white">{organization.online}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-900 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {organization.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-zinc-800 bg-zinc-950/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-zinc-300 transition-colors group-hover:text-white">
                      Open
                    </span>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        ) : (
          <Card className="border-dashed p-8 text-center">
            <p className="text-lg font-semibold text-white">No organizations found</p>
            <p className="mt-2 text-sm text-zinc-500">
              Try a different search term or clear the filter to see all memberships.
            </p>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
