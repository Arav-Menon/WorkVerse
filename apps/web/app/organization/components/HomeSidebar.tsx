"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Org {
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

interface HomeSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  orgs: Org[];
  onWorkspaceChange: (ws: string) => void;
}

export default function HomeSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  orgs,
  onWorkspaceChange,
}: HomeSidebarProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const primaryNav = [
    { name: "Home", icon: "ti-home" },
    { name: "Organizations", icon: "ti-layout-grid", badge: orgs?.length },
    { name: "Spaces", icon: "ti-planet" },
    { name: "AI Lab", icon: "ti-robot" },
    { name: "Workflows", icon: "ti-arrows-split" },
    { name: "Schedule", icon: "ti-calendar" },
  ];

  const handleSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const reomveToken = localStorage.removeItem("token");
    if(reomveToken as any){
      router.push("/");
    }

  }

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
        className={`bg-black border-r border-zinc-900 p-4 py-6 flex flex-col gap-1 fixed md:relative top-0 md:top-auto left-0 bottom-0 w-[240px] h-full overflow-y-auto z-[150] transition-transform duration-200 ease-in-out md:translate-x-0 shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Main navigation"
      >
        <nav className="flex-grow flex flex-col justify-between" aria-label="Primary navigation">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase px-3 mb-2.5 select-none">Navigation</p>
              <ul role="list" className="space-y-0.5">
                {primaryNav.map((item) => (
                  <li key={item.name}>
                    <button 
                      className={`flex items-center gap-2.5 p-2 px-3 rounded-lg text-[13px] text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors w-full text-left cursor-pointer ${
                        activeTab === item.name ? "bg-zinc-900 text-white font-medium" : ""
                      }`}
                      onClick={() => {
                        if (item.name === "AI Lab") {
                          router.push('/ai-lab');
                          setSidebarOpen(false);
                        } else if (item.name === "Home") {
                          router.push('/home');
                          setSidebarOpen(false);
                        } else {
                          setActiveTab(item.name);
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <i className={`ti ${item.icon} text-base`} aria-hidden="true"></i>
                      <span className="flex-1">{item.name}</span>
                      {item.badge !== undefined && (
                        <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded-full" aria-label={`${item.badge} organizations`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase px-3 mb-2.5 select-none">Organizations</p>
              <ul className="space-y-0.5" role="list">
                {orgs?.map((org) => (
                  <li key={org.name}>
                    <button 
                      className="flex items-center gap-2.5 p-1.5 px-3 rounded-lg text-left w-full hover:bg-zinc-900/40 group transition-colors cursor-pointer"
                      onClick={() => {
                        onWorkspaceChange(org.name);
                        setSidebarOpen(false);
                      }}
                      aria-label={`${org.name} — ${org.online} members online`}
                    >
                      <span 
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ 
                          background: 
                            org.color === "purple" ? "#7F77DD" : 
                            org.color === "teal" ? "#1D9E75" : 
                            org.color === "coral" ? "#D85A30" : "#378ADD" 
                        }}
                        aria-hidden="true"
                      ></span>
                      <span className="text-[12px] text-zinc-400 group-hover:text-white transition-colors truncate flex-1">{org.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono" aria-label={`${org.online} online`}>
                        {org.online}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900 mt-6">
            <button className="flex items-center gap-2.5 p-2 px-3 rounded-lg text-[13px] text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors w-full text-left cursor-pointer">
              <i className="ti ti-user text-base" aria-hidden="true"></i>
              <span>{user?.name ?? "Unknown User"}</span>
            </button>
            <button onClick={handleSubmit}
              className="flex items-center gap-2.5 p-2 px-3 rounded-lg text-[13px] text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors w-full text-left cursor-pointer">
              <i className="ti ti-logout text-base" aria-hidden="true"></i>
              <span>Sign out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
