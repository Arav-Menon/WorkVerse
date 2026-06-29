"use client";

import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useN8nStatus, useConnectN8n, useTestN8nConnection, useDisconnectN8n } from "@/hooks/use-n8n-connection";
import { usePermission } from "@/lib/rbac/usePermission";
import DisconnectConfirmModal from "@/components/shared/DisconnectConfirmModal";

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

export default function N8nConnectionPage() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.orgId as string;

  const { canManageIntegrations } = usePermission(orgId);
  const { data: n8nStatus, isLoading, refetch } = useN8nStatus(orgId);
  const connectMutation = useConnectN8n(orgId);
  const testMutation = useTestN8nConnection(orgId);
  const disconnectMutation = useDisconnectN8n(orgId);

  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateBaseUrl, setUpdateBaseUrl] = useState("");
  const [updateApiKey, setUpdateApiKey] = useState("");
  const [showUpdateApiKey, setShowUpdateApiKey] = useState(false);

  const isConnected = n8nStatus?.connected === true;

  const handleConnect = useCallback(() => {
    if (!baseUrl.trim() || !apiKey.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      new URL(baseUrl);
    } catch {
      toast.error("Please enter a valid URL (e.g., https://n8n.company.com)");
      return;
    }

    connectMutation.mutate(
      { baseUrl: baseUrl.trim(), apiKey: apiKey.trim() },
      {
        onSuccess: () => {
          toast.success("n8n instance connected successfully");
          setBaseUrl("");
          setApiKey("");
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || "Failed to connect";
          toast.error(message);
        },
      }
    );
  }, [baseUrl, apiKey, connectMutation]);

  const handleTest = useCallback(() => {
    testMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.success) {
          toast.success("Connection verified successfully");
          refetch();
        } else {
          toast.error(result.message);
        }
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || "Connection test failed";
        toast.error(message);
      },
    });
  }, [testMutation, refetch]);

  const handleDisconnect = useCallback(() => {
    setShowDisconnectModal(true);
  }, []);

  const handleConfirmDisconnect = useCallback(() => {
    disconnectMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("n8n instance disconnected");
        setShowDisconnectModal(false);
        setUpdateBaseUrl("");
        setUpdateApiKey("");
        setShowUpdateForm(false);
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || "Failed to disconnect";
        toast.error(message);
        setShowDisconnectModal(false);
      },
    });
  }, [disconnectMutation]);

  const handleUpdateCredentials = useCallback(() => {
    if (!updateBaseUrl.trim() || !updateApiKey.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      new URL(updateBaseUrl);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    connectMutation.mutate(
      { baseUrl: updateBaseUrl.trim(), apiKey: updateApiKey.trim() },
      {
        onSuccess: () => {
          toast.success("Credentials updated successfully");
          setUpdateBaseUrl("");
          setUpdateApiKey("");
          setShowUpdateForm(false);
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || "Failed to update credentials";
          toast.error(message);
        },
      }
    );
  }, [updateBaseUrl, updateApiKey, connectMutation]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="h-8 w-48 bg-zinc-900 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-zinc-900 rounded animate-pulse"></div>
        </div>
        <div className="h-64 bg-zinc-950/40 border border-zinc-900 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back Navigation */}
      <button
        onClick={() => router.push(`/organization/${orgId}/connections`)}
        className="flex items-center gap-2 text-zinc-500 hover:text-white text-[13px] font-medium mb-6 transition-colors"
      >
        <i className="ti ti-arrow-left text-sm"></i>
        Back to Connections
      </button>

      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-lg">
              <i className="ti ti-device-analytics text-zinc-300 text-lg"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">n8n Integration</h1>
              <p className="text-[13px] text-zinc-500 font-medium mt-0.5">
                Connect your own n8n instance
              </p>
            </div>
          </div>
          <p className="text-[14px] text-zinc-400 max-w-lg leading-relaxed">
            Connect your self-hosted or cloud n8n instance to deploy workflows generated by WorkVerse. Each organization uses its own n8n credentials.
          </p>
        </div>
      </div>

      {/* Connection Card */}
      <div className={`rounded-2xl border overflow-hidden ${
        isConnected
          ? "bg-zinc-950/40 border-emerald-500/20"
          : "bg-zinc-950/30 border-zinc-900/80"
      }`}>
        {/* Status Header */}
        <div className="p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
            <i className="ti ti-device-analytics text-zinc-200 text-xl"></i>
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <p className="text-[14px] font-bold text-zinc-100">n8n</p>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                isConnected
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
              }`}>
                {isConnected ? "Connected" : "Not Connected"}
              </span>
            </div>
            {isConnected && n8nStatus.baseUrl && (
              <div className="flex items-center gap-4 text-[12px] text-zinc-500">
                <span className="truncate font-mono">{n8nStatus.baseUrl}</span>
                {n8nStatus.lastValidatedAt && (
                  <span className="shrink-0">Verified {timeAgo(n8nStatus.lastValidatedAt)}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Connected Details */}
        {isConnected && n8nStatus && (
          <div className="border-t border-zinc-900 px-5 py-4">
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <p className="text-zinc-600 uppercase tracking-wider font-semibold text-[10px] mb-1">Instance URL</p>
                <p className="text-zinc-300 font-mono truncate">{n8nStatus.baseUrl}</p>
              </div>
              <div>
                <p className="text-zinc-600 uppercase tracking-wider font-semibold text-[10px] mb-1">API Key</p>
                <p className="text-zinc-300 font-mono">{n8nStatus.maskedApiKey}</p>
              </div>
              <div>
                <p className="text-zinc-600 uppercase tracking-wider font-semibold text-[10px] mb-1">Connected By</p>
                <p className="text-zinc-300">{n8nStatus.connectedBy?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-zinc-600 uppercase tracking-wider font-semibold text-[10px] mb-1">Connected At</p>
                <p className="text-zinc-300">{n8nStatus.connectedAt ? timeAgo(n8nStatus.connectedAt) : "Unknown"}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {canManageIntegrations && (
              <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-zinc-900">
                <button
                  onClick={handleTest}
                  disabled={testMutation.isPending}
                  className="px-4 py-2 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400 text-[12px] font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {testMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Testing...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-refresh text-[11px]"></i>
                      Test Connection
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setUpdateBaseUrl(n8nStatus.baseUrl || "");
                    setShowUpdateForm(!showUpdateForm);
                  }}
                  className="px-4 py-2 rounded-lg border border-zinc-800 hover:bg-zinc-900 hover:text-white text-zinc-400 text-[12px] font-medium transition-colors flex items-center gap-1.5"
                >
                  <i className="ti ti-pencil text-[11px]"></i>
                  Update Credentials
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnectMutation.isPending}
                  className="px-4 py-2 rounded-lg border border-red-900/40 hover:bg-red-950/30 hover:border-red-800 hover:text-red-400 text-zinc-500 text-[12px] font-medium transition-colors disabled:opacity-50"
                >
                  Disconnect
                </button>
              </div>
            )}

            {/* Update Form */}
            {showUpdateForm && canManageIntegrations && (
              <div className="mt-5 pt-4 border-t border-zinc-900">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Update Credentials</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[12px] text-zinc-500 font-medium mb-1.5">n8n Base URL</label>
                    <input
                      type="text"
                      value={updateBaseUrl}
                      onChange={(e) => setUpdateBaseUrl(e.target.value)}
                      placeholder="https://n8n.company.com"
                      className="flex h-10 w-full rounded-xl border border-zinc-900 bg-zinc-950/70 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-zinc-700 focus:ring-2 focus:ring-white/5 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] text-zinc-500 font-medium mb-1.5">API Key</label>
                    <div className="relative">
                      <input
                        type={showUpdateApiKey ? "text" : "password"}
                        value={updateApiKey}
                        onChange={(e) => setUpdateApiKey(e.target.value)}
                        placeholder="Enter new API key"
                        className="flex h-10 w-full rounded-xl border border-zinc-900 bg-zinc-950/70 px-4 py-2 pr-10 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-zinc-700 focus:ring-2 focus:ring-white/5 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowUpdateApiKey(!showUpdateApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                      >
                        <i className={`ti ${showUpdateApiKey ? "ti-eye-off" : "ti-eye"} text-sm`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleUpdateCredentials}
                      disabled={connectMutation.isPending}
                      className="px-4 py-2 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {connectMutation.isPending ? (
                        <>
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Updating...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowUpdateForm(false);
                        setUpdateBaseUrl("");
                        setUpdateApiKey("");
                      }}
                      className="px-4 py-2 rounded-lg border border-zinc-800 text-zinc-400 text-[12px] font-medium hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Connect Form (Not Connected) */}
        {!isConnected && canManageIntegrations && (
          <div className="border-t border-zinc-900 px-5 py-5">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Connect your n8n instance</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] text-zinc-500 font-medium mb-1.5">n8n Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="https://n8n.company.com"
                  className="flex h-10 w-full rounded-xl border border-zinc-900 bg-zinc-950/70 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-zinc-700 focus:ring-2 focus:ring-white/5 font-mono"
                />
                <p className="text-[11px] text-zinc-600 mt-1.5">The URL of your n8n instance (including https://)</p>
              </div>
              <div>
                <label className="block text-[12px] text-zinc-500 font-medium mb-1.5">API Key</label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your n8n API key"
                    className="flex h-10 w-full rounded-xl border border-zinc-900 bg-zinc-950/70 px-4 py-2 pr-10 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-zinc-700 focus:ring-2 focus:ring-white/5 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    <i className={`ti ${showApiKey ? "ti-eye-off" : "ti-eye"} text-sm`}></i>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-600 mt-1.5">Generate an API key in n8n Settings &gt; API</p>
              </div>
              <button
                onClick={handleConnect}
                disabled={connectMutation.isPending || !baseUrl.trim() || !apiKey.trim()}
                className="px-5 py-2.5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {connectMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="ti ti-plug-connected text-sm"></i>
                    Connect
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* No Permission */}
        {!isConnected && !canManageIntegrations && (
          <div className="border-t border-zinc-900 px-5 py-5 text-center">
            <p className="text-[13px] text-zinc-500">
              Only organization owners and admins can connect n8n instances.
            </p>
          </div>
        )}
      </div>

      {/* Disconnect Modal */}
      <DisconnectConfirmModal
        isOpen={showDisconnectModal}
        providerName="n8n"
        providerIcon="ti-device-analytics"
        onConfirm={handleConfirmDisconnect}
        onCancel={() => setShowDisconnectModal(false)}
        isPending={disconnectMutation.isPending}
      />
    </div>
  );
}
