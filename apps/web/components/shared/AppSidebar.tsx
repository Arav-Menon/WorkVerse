"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import InviteMemberModal from "./InviteMemberModal";
import type { FetchOrganization } from "@/lib/api/org.api";

export interface Org {
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

interface AppSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  orgs: Org[];
  fetchOrganizations?: FetchOrganization[];
}


export default function AppSidebar({
  sidebarOpen,
  setSidebarOpen,
  orgs,
  fetchOrganizations = [],
}: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [inviteOpen, setInviteOpen] = useState(false);

  const primaryNav = [
    { name: "Home", icon: "ti-home", route: "/home" },
    { name: "Organizations", icon: "ti-layout-grid", badge: orgs.length, route: "/organization" },
    { name: "AI Lab", icon: "ti-robot", route: "/ai-lab" },
    { name: "Spaces", icon: "ti-planet", disabled: true },
    { name: "Workflows", icon: "ti-arrows-split", disabled: true },
    { name: "Schedule", icon: "ti-calendar", disabled: true },
  ];

  const quickAccess = [
    { name: "Profile", icon: "ti-id-badge", route: "/profile" },
    { name: "Invite member", icon: "ti-user-plus", action: "invite" },
  ];

  const isActiveRoute = (route: string) => {
    if (route === "/organization") {
      return pathname === route || pathname.startsWith("/organization/");
    }

    return pathname === route;
  };

  const handleOrgClick = (orgId: string) => {
    router.push(`/organization/${orgId}`);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[140] md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`bg-black/95 md:bg-black border-r border-zinc-900 p-4 py-6 flex flex-col fixed md:relative top-[56px] md:top-auto left-0 bottom-0 w-[248px] h-[calc(100vh-56px)] md:h-full z-[150] transition-transform duration-200 ease-in-out md:translate-x-0 shrink-0 backdrop-blur-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <nav className="flex h-full flex-col overflow-hidden" aria-label="Primary navigation">
          <div className="flex-1 space-y-6 overflow-y-auto pr-1">
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.24em] text-zinc-500 uppercase">Workspace Hub</p>
                  <p className="mt-1 text-sm font-semibold text-white">Control center</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-white/5 text-white">
                  <i className="ti ti-layout-dashboard text-base" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-900/70 bg-emerald-950/40 px-2 py-1 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  live
                </span>
                <span>{orgs.length} orgs connected</span>
              </div>
            </div>

            {/* Primary Nav */}
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase px-3 mb-2.5 select-none">
                Navigation
              </p>
              <ul role="list" className="space-y-0.5">
                {primaryNav.map((item) => {
                  const isActive = item.route ? isActiveRoute(item.route) : false;

                  return (
                    <li key={item.name}>
                      <button
                        className={`flex items-center gap-2.5 p-2.5 px-3 rounded-xl text-[13px] w-full text-left transition-colors ${
                          item.disabled
                            ? "text-zinc-600 cursor-default"
                            : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white cursor-pointer"
                        } ${
                          isActive ? "bg-zinc-900 text-white font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" : ""
                        }`}
                        onClick={() => {
                          if (!item.route) {
                            return;
                          }

                          router.push(item.route);
                          setSidebarOpen(false);
                        }}
                        disabled={item.disabled}
                      >
                        <i className={`ti ${item.icon} text-base`} aria-hidden="true" />
                        <span className="flex-1">{item.name}</span>
                        {item.badge !== undefined && (
                          <span
                            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            aria-label={`${item.badge} organizations`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.disabled && (
                          <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
                            Soon
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase px-3 mb-2.5 select-none">
                Quick Access
              </p>
              <ul role="list" className="space-y-0.5">
                {quickAccess.map((item) => {
                  const isActive = item.route ? isActiveRoute(item.route) : false;

                  return (
                    <li key={item.name}>
                      <button
                        className={`flex items-center gap-2.5 p-2.5 px-3 rounded-xl text-[13px] w-full text-left transition-colors ${
                          isActive
                            ? "bg-zinc-900 text-white font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                            : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                        }`}
                        onClick={() => {
                          if (item.action === "invite") {
                            setInviteOpen(true);
                            setSidebarOpen(false);
                            return;
                          }
                          router.push(item.route!);
                          setSidebarOpen(false);
                        }}
                      >
                        <i className={`ti ${item.icon} text-base`} aria-hidden="true" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Organizations list */}
            {orgs.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase px-3 mb-2.5 select-none">
                  Organizations
                </p>
                <ul className="space-y-0.5" role="list">
                  {orgs.map((org) => (
                    <li key={org.name}>
                      <button
                        className="flex items-center gap-2.5 p-2 px-3 rounded-xl text-left w-full hover:bg-zinc-900/40 group transition-colors cursor-pointer"
                        onClick={() => handleOrgClick(org.id)}
                        aria-label={`${org.name} — ${org.online} members online`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background:
                              org.color === "purple" ? "#7F77DD" :
                              org.color === "teal"   ? "#1D9E75" :
                              org.color === "coral"  ? "#D85A30" : "#378ADD",
                          }}
                          aria-hidden="true"
                        />
                        <span className="text-[12px] text-zinc-400 group-hover:text-white transition-colors truncate flex-1">
                          {org.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono" aria-label={`${org.online} online`}>
                          {org.online}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom: Profile + Sign out */}
          <div className="pt-4 border-t border-zinc-900 mt-6">
            <div className="mb-2 rounded-2xl border border-zinc-900 bg-zinc-950/60 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-[11px] font-semibold text-zinc-200">
                  AK
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-white">Arav Kumar</p>
                  <p className="truncate text-[11px] text-zinc-500">Personal workspace</p>
                </div>
              </div>
            </div>
            <Link
              href="/auth"
              className="flex items-center gap-2.5 p-2.5 px-3 rounded-xl text-[13px] text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors w-full text-left"
            >
              <i className="ti ti-logout text-base" aria-hidden="true" />
              <span>Sign out</span>
            </Link>
          </div>
        </nav>
      </aside>

      <InviteMemberModal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        organizations={fetchOrganizations}
      />
    </>
  );
}
