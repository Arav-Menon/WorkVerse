"use client";

import React, { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useIntegrationStatus, useDisconnectIntegration } from "@/hooks/use-integrations";
import { usePermission } from "@/lib/rbac/usePermission";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getConnectUrl } from "@/lib/api/integration.api";

const INTEGRATION_REGISTRY: Record<string, { name: string; icon: string; desc: string; category: string }> = {
  github: { name: "GitHub", icon: "ti-brand-github", desc: "Connect repositories, pull requests, and issues", category: "dev" },
  google: { name: "Google Calendar", icon: "ti-calendar-event", desc: "Sync events and schedules", category: "productivity" },
  slack: { name: "Slack", icon: "ti-brand-slack", desc: "Send messages and notifications", category: "communication" },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function ConnectionsPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  const { user } = useCurrentUser();
  const { canManageIntegrations } = usePermission(orgId);
  const { data: integrations, isLoading, isError, refetch } = useIntegrationStatus(orgId);
  const disconnectMutation = useDisconnectIntegration(orgId);

  const [expandedService, setExpandedService] = useState<string | null>(null);

  const handleConnect = useCallback((provider: string) => {
    if (!user) return;
    const url = getConnectUrl(orgId, provider, user.id);
    window.open(url, "oauth", "width=600,height=700");

    // Listen for OAuth result from popup
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "oauth-result" && event.data.orgId === orgId) {
        refetch();
        window.removeEventListener("message", handler);
      }
    };
    window.addEventListener("message", handler);
  }, [orgId, user, refetch]);

  const handleDisconnect = useCallback((provider: string) => {
    if (!confirm(`Are you sure you want to disconnect ${provider}?`)) return;
    disconnectMutation.mutate(provider);
  }, [disconnectMutation]);

  const connectedProviders = integrations
    ? Object.entries(integrations).filter(([, status]) => status.connected)
    : [];

  const availableProviders = Object.entries(INTEGRATION_REGISTRY).filter(
    ([key]) => !integrations?.[key]?.connected
  );

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="h-8 w-48 bg-zinc-900 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-zinc-900 rounded animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-zinc-950/40 border border-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <p className="font-medium mb-1">Failed to load integration status</p>
          <button onClick={() => refetch()} className="text-red-300 underline text-xs">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-lg">
              <i className="ti ti-plug-connected text-zinc-300 text-lg"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Connections</h1>
              <p className="text-[13px] text-zinc-500 font-medium mt-0.5">
                Organization integrations
              </p>
            </div>
          </div>
          <p className="text-[14px] text-zinc-400 max-w-lg leading-relaxed">
            Connect tools and services that WorkVerse can access on your behalf. Connected accounts are available to AI, automations, and MCP executions.
          </p>
        </div>
      </div>

      {/* Connection Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        <div className="flex items-center gap-3 border rounded-xl px-4 py-3.5 bg-emerald-500/10 border-emerald-500/20">
          <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
          <div>
            <p className="text-lg font-bold leading-none mb-1 text-emerald-400">{connectedProviders.length}</p>
            <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Connected</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border rounded-xl px-4 py-3.5 bg-zinc-900/50 border-zinc-800">
          <span className="w-2 h-2 rounded-full shrink-0 bg-zinc-600" />
          <div>
            <p className="text-lg font-bold leading-none mb-1 text-zinc-400">{availableProviders.length}</p>
            <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Available</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border rounded-xl px-4 py-3.5 bg-zinc-900/50 border-zinc-800">
          <span className="w-2 h-2 rounded-full shrink-0 bg-zinc-600" />
          <div>
            <p className="text-lg font-bold leading-none mb-1 text-zinc-400">{Object.keys(INTEGRATION_REGISTRY).length}</p>
            <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Total</p>
          </div>
        </div>
      </div>

      {/* Connected Services */}
      {connectedProviders.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <i className="ti ti-check-circle text-emerald-500"></i>
              Connected Services
            </h2>
            <span className="text-[11px] text-zinc-600">{connectedProviders.length} services</span>
          </div>

          <div className="space-y-3">
            {connectedProviders.map(([provider, status]) => {
              const config = INTEGRATION_REGISTRY[provider];
              if (!config) return null;

              return (
                <div key={provider} className="bg-zinc-950/40 border border-emerald-500/20 rounded-2xl overflow-hidden">
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                      <i className={`ti ${config.icon} text-zinc-200 text-xl`}></i>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2.5 mb-1">
                        <p className="text-[14px] font-bold text-zinc-100">{config.name}</p>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-emerald-500/10 border-emerald-500/25 text-emerald-400">
                          Active
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-zinc-500">
                        {status.username && (
                          <span className="truncate">{status.username}</span>
                        )}
                        {status.connectedAt && (
                          <span className="shrink-0">Connected {timeAgo(status.connectedAt)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {status.profileUrl && (
                        <a
                          href={status.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400 text-[12px] font-medium transition-colors flex items-center gap-1.5"
                        >
                          <i className="ti ti-external-link text-[11px]"></i>
                          Profile
                        </a>
                      )}
                      {canManageIntegrations && (
                        <>
                          <button
                            onClick={() => setExpandedService(expandedService === provider ? null : provider)}
                            className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400 text-[12px] font-medium transition-colors flex items-center gap-1.5"
                          >
                            Details
                            <i className={`ti ${expandedService === provider ? "ti-chevron-up" : "ti-chevron-down"} text-[11px]`}></i>
                          </button>
                          <button
                            onClick={() => handleDisconnect(provider)}
                            disabled={disconnectMutation.isPending}
                            className="px-3 py-1.5 rounded-lg border border-red-900/40 hover:bg-red-950/30 hover:border-red-800 hover:text-red-400 text-zinc-500 text-[12px] font-medium transition-colors disabled:opacity-50"
                          >
                            {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedService === provider && status.scopes && (
                    <div className="border-t border-zinc-900 px-5 pb-5 pt-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Granted Scopes</h4>
                      <div className="flex flex-wrap gap-2">
                        {status.scopes.split(" ").map((scope) => (
                          <span key={scope} className="text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1">
                            {scope}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Available Integrations */}
      {availableProviders.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <i className="ti ti-plus-circle text-zinc-400"></i>
              Available Integrations
            </h2>
            <span className="text-[11px] text-zinc-600">{availableProviders.length} available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableProviders.map(([provider, config]) => (
              <div key={provider} className="bg-zinc-950/30 border border-zinc-900/80 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-800 hover:bg-zinc-950/60 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                    <i className={`ti ${config.icon} text-zinc-400 text-lg group-hover:text-zinc-200 transition-colors`}></i>
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-zinc-200 mb-1">{config.name}</p>
                  <p className="text-[12px] text-zinc-500 leading-relaxed">{config.desc}</p>
                </div>
                {canManageIntegrations ? (
                  <button
                    onClick={() => handleConnect(provider)}
                    className="w-full py-2 rounded-lg border border-zinc-800 text-[12px] font-semibold text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all"
                  >
                    Connect {config.name}
                  </button>
                ) : (
                  <div className="w-full py-2 rounded-lg border border-zinc-800 text-[12px] font-semibold text-zinc-600 text-center cursor-not-allowed">
                    Admin access required
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {connectedProviders.length === 0 && availableProviders.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-plug-connected text-zinc-500 text-xl"></i>
          </div>
          <p className="text-sm text-zinc-400 font-medium">No integrations available</p>
          <p className="text-xs text-zinc-600 mt-1">Contact your administrator to set up integrations.</p>
        </div>
      )}

      {/* RBAC notice for members */}
      {!canManageIntegrations && connectedProviders.length === 0 && (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-500">
            Only organization owners and admins can connect integrations.
          </p>
        </div>
      )}
    </div>
  );
}
