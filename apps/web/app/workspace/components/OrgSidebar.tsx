"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Member {
  name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  color: string;
}

interface OrgSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
  activeSection: string;
  setActiveSection: (val: string) => void;
}

export default function OrgSidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  setActiveSection,
}: OrgSidebarProps) {
  const params = useParams();
  const workspaceName = params?.workspaceName as string ?? "";

  const navigation = [
    { name: "Workspaces", icon: "ti-layout-grid", badge: 12 },
    { name: "AI Lab", icon: "ti-robot" },
    { name: "Automations", icon: "ti-arrows-split" },
    { name: "Schedule", icon: "ti-calendar" },
    { name: "Connections", icon: "ti-plug-connected",},
  ];

  const members: Member[] = [
    { name: "Priya R.", avatar: "PR", status: "online", color: "bg-emerald-950/60 border-emerald-800 text-emerald-400" },
    { name: "James L.", avatar: "JL", status: "online", color: "bg-blue-950/60 border-blue-800 text-blue-400" },
    { name: "N Nisha K.", avatar: "NK", status: "away", color: "bg-purple-950/60 border-purple-800 text-purple-400" },
    { name: "Sam M.", avatar: "SM", status: "away", color: "bg-amber-950/60 border-amber-800 text-amber-400" },
    { name: "Rohan B.", avatar: "RB", status: "offline", color: "bg-zinc-900 border-zinc-800 text-zinc-500" },
  ];

  return (
    <>
      {/* Mobile backdrop overlay drawer */}
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
        aria-label="Organization sidebar navigation"
      >


        <nav className="flex-grow flex flex-col justify-between" aria-label="Main sections">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase px-3 mb-2.5 select-none">Navigation</p>
              <ul className="space-y-0.5">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <button 
                      className={`flex items-center gap-2.5 p-2 px-3 rounded-lg text-[13px] text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors w-full text-left cursor-pointer ${
                        activeSection === item.name ? "bg-zinc-900 text-white font-medium" : ""
                      }`}
                      onClick={() => {
                          setActiveSection(item.name);
                        setSidebarOpen(false);
                      }}
                    >
                      <i className={`ti ${item.icon} text-base`}></i>
                      <span className="flex-grow">{item.name}</span>
                      {item.badge && (
                        <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

                  {/* Office-presence */}
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase px-3 mb-2.5 select-none">Office Presence</p>
              <ul className="space-y-0.5">
                {members.map((member) => (
                  <li key={member.name}>
                    <div className="flex items-center gap-2.5 p-1.5 px-3 rounded-lg text-left w-full hover:bg-zinc-900/40 transition-colors group cursor-pointer">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold shrink-0 relative ${member.color}`}>
                        {member.avatar}
                        <span 
                          className={`absolute bottom-[-1px] right-[-1px] w-2 h-2 rounded-full border border-black ${
                            member.status === "online" ? "bg-emerald-500" :
                            member.status === "away" ? "bg-amber-500" : "bg-zinc-600"
                          }`}
                        />
                      </div>
                      <span className="text-[12px] text-zinc-400 group-hover:text-white transition-colors truncate flex-1">{member.name}</span>
                      <span className="text-[10px] text-zinc-600 font-mono">
                        {member.status === "online" ? "online" : member.status === "away" ? "away" : "offline"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-900 mt-6 space-y-1">
            <button className="flex items-center gap-2.5 p-2 px-3 rounded-lg text-[13px] text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors w-full text-left cursor-pointer">
              <i className="ti ti-users text-base"></i>
              <span>Invite colleagues</span>
            </button>
            <Link href="/home" className="flex items-center gap-2.5 p-2 px-3 rounded-lg text-[13px] text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors w-full text-left">
              <i className="ti ti-arrow-left text-base"></i>
              <span>Exit workspace</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
