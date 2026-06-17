"use client";

import React, { use, useState } from "react";
import OrgNavbar from "../../../organization/components/HomeNavbar";
import OrgSidebar from "../../../organization/components/HomeSidebar";

interface PageProps {
  params: Promise<{ workspaceName: string }>;
}

const connectedServices = [
  {
    id: "github",
    name: "GitHub",
    icon: "ti-brand-github",
    account: "arav@clevenstudios.com",
    status: "connected",
    synced: "2 minutes ago",
    health: "healthy",
    permissions: ["Read repositories", "Read pull requests", "Read issues", "Write comments"],
    aiAccess: ["Read repos", "Read issues", "Create PR comments"],
  },
  {
    id: "google",
    name: "Google Calendar",
    icon: "ti-calendar-event",
    account: "arav@clevenstudios.com",
    status: "connected",
    synced: "5 minutes ago",
    health: "healthy",
    permissions: ["Read events", "Create events", "Read contacts"],
    aiAccess: ["Read events", "Create meetings"],
  },
  {
    id: "slack",
    name: "Slack",
    icon: "ti-brand-slack",
    account: "clevenstudios.slack.com",
  status: "connected",
    synced: "12 minutes ago",
    health: "healthy",
    permissions: ["Read messages", "Send messages", "Read channels"],
    aiAccess: ["Send messages", "Read channels"],
  },
  {
    id: "notion",
    name: "Notion",
    icon: "ti-brand-notion",
    account: "arav@clevenstudios.com",
    status: "attention",
    synced: "3 days ago",
    health: "expired",
    permissions: ["Read pages", "Create pages", "Read databases"],
    aiAccess: ["Create pages", "Read pages"],
  },
  {
    id: "linear",
    name: "Linear",
    icon: "ti-chart-line",
    account: "arav@clevenstudios.com",
    status: "connected",
    synced: "1 hour ago",
    health: "healthy",
    permissions: ["Read issues", "Create issues", "Read teams"],
    aiAccess: ["Create issues", "Read issues"],
  },
];

const availableIntegrations = [
  { id: "gmail", name: "Gmail", icon: "ti-mail", desc: "Read and send emails via AI" },
  { id: "figma", name: "Figma", icon: "ti-brand-figma", desc: "Access designs and assets" },
  { id: "jira", name: "Jira", icon: "ti-list-check", desc: "Sync tasks and sprints" },
  { id: "discord", name: "Discord", icon: "ti-brand-discord", desc: "Send team notifications" },
  { id: "dropbox", name: "Dropbox", icon: "ti-brand-dropbox", desc: "Access and sync files" },
  { id: "drive", name: "Google Drive", icon: "ti-brand-google-drive", desc: "Read and create documents" },
  { id: "hubspot", name: "HubSpot", icon: "ti-building-store", desc: "CRM sync and deal tracking" },
  { id: "zoom", name: "Zoom", icon: "ti-video", desc: "Schedule and join meetings" },
];

const healthStats = [
  { label: "Active", count: 4, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-500" },
  { label: "Attention", count: 1, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-500" },
  { label: "Errors", count: 0, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-500" },
  { label: "Available", count: 8, color: "text-zinc-400", bg: "bg-zinc-900/50 border-zinc-800", dot: "bg-zinc-600" },
];

export default function ConnectionsPage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const workspace = decodeURIComponent(unwrappedParams.workspaceName);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Connections");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const filteredConnected = connectedServices.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredAvailable = availableIntegrations.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen max-h-screen flex flex-col relative overflow-hidden bg-black text-zinc-50 font-sans selection:bg-white/10 selection:text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.012] rounded-full blur-[120px] -translate-y-1/2" />
      </div>

      <OrgNavbar
          //@ts-ignore
        orgName={workspace}
        onSearchClick={() => {}}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 h-[calc(100vh-56px)] overflow-hidden relative z-10">
        <OrgSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          //@ts-ignore
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <main className="flex-grow h-full overflow-y-auto p-6 md:p-8 xl:p-10 select-none">
          <div className="max-w-5xl mx-auto">

            {/* ── Header ── */}
            <div className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-lg">
                    <i className="ti ti-plug-connected text-zinc-300 text-lg"></i>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Connections</h1>
                    <p className="text-[13px] text-zinc-500 font-medium mt-0.5">
                      {workspace}
                    </p>
                  </div>
                </div>
                <p className="text-[14px] text-zinc-400 max-w-lg leading-relaxed">
                  Connect tools and services that WorkVerse can access on your behalf. Connected accounts are available to AI, automations, and MCP executions.
                </p>
              </div>

              {/* Search */}
              <div className="relative shrink-0 w-full sm:w-64">
                <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>

            {/* ── Connection Summary ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {healthStats.map(stat => (
                <div key={stat.label} className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 ${stat.bg}`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${stat.dot}`} />
                  <div>
                    <p className={`text-lg font-bold leading-none mb-1 ${stat.color}`}>{stat.count}</p>
                    <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Connected Services ── */}
            {filteredConnected.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <i className="ti ti-check-circle text-emerald-500"></i>
                    Connected Services
                  </h2>
                  <span className="text-[11px] text-zinc-600">{filteredConnected.length} services</span>
                </div>

                <div className="space-y-3">
                  {filteredConnected.map(service => (
                    <div key={service.id} className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-colors">
                      {/* Card Header */}
                      <div className="p-5 flex items-center gap-4">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                          <i className={`ti ${service.icon} text-zinc-200 text-xl`}></i>
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2.5 mb-1">
                            <p className="text-[14px] font-bold text-zinc-100">{service.name}</p>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                              service.health === "healthy"
                                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                                : "bg-amber-500/10 border-amber-500/25 text-amber-400"
                            }`}>
                              {service.health === "healthy" ? "Active" : "Attention"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[12px] text-zinc-500">
                            <span className="truncate">{service.account}</span>
                            <span className="shrink-0">· Synced {service.synced}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button className="p-2 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-500 transition-colors">
                            <i className="ti ti-refresh text-[14px]"></i>
                          </button>
                          <button
                            onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                            className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400 text-[12px] font-medium transition-colors flex items-center gap-1.5"
                          >
                            Details
                            <i className={`ti ${expandedService === service.id ? "ti-chevron-up" : "ti-chevron-down"} text-[11px]`}></i>
                          </button>
                          <button className="px-3 py-1.5 rounded-lg border border-red-900/40 hover:bg-red-950/30 hover:border-red-800 hover:text-red-400 text-zinc-500 text-[12px] font-medium transition-colors">
                            Disconnect
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedService === service.id && (
                        <div className="border-t border-zinc-900 px-5 pb-5 pt-4 grid sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Permissions Granted</h4>
                            <ul className="space-y-2">
                              {service.permissions.map(p => (
                                <li key={p} className="flex items-center gap-2 text-[12px] text-zinc-400">
                                  <i className="ti ti-check text-emerald-500 text-[12px] shrink-0"></i>
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">AI Can Access</h4>
                            <ul className="space-y-2">
                              {service.aiAccess.map(a => (
                                <li key={a} className="flex items-center gap-2 text-[12px] text-zinc-400">
                                  <i className="ti ti-robot text-blue-400 text-[12px] shrink-0"></i>
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Available Integrations ── */}
            {filteredAvailable.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <i className="ti ti-plus-circle text-zinc-400"></i>
                    Available Integrations
                  </h2>
                  <span className="text-[11px] text-zinc-600">{filteredAvailable.length} available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {filteredAvailable.map(int => (
                    <div key={int.id} className="bg-zinc-950/30 border border-zinc-900/80 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                          <i className={`ti ${int.icon} text-zinc-400 text-lg group-hover:text-zinc-200 transition-colors`}></i>
                        </div>
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-zinc-200 mb-1">{int.name}</p>
                        <p className="text-[12px] text-zinc-500 leading-relaxed">{int.desc}</p>
                      </div>
                      <button className="w-full py-2 rounded-lg border border-zinc-800 text-[12px] font-semibold text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── AI Access Transparency ── */}
            <section className="mb-10">
              <div className="mb-5">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-1">
                  <i className="ti ti-robot text-blue-400"></i>
                  AI Access Overview
                </h2>
                <p className="text-[12px] text-zinc-600">What WorkVerse AI can do on your behalf</p>
              </div>

              <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden">
                {connectedServices.filter(s => s.health === "healthy").map((service, i, arr) => (
                  <div key={service.id} className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-zinc-900/60" : ""}`}>
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                      <i className={`ti ${service.icon} text-zinc-400 text-base`}></i>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[13px] font-semibold text-zinc-200 mb-2">{service.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.aiAccess.map(a => (
                          <span key={a} className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-full px-2.5 py-1">
                            <i className="ti ti-check text-emerald-500 text-[10px]"></i>
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
