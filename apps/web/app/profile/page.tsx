"use client";

import React, { useState, useEffect } from "react";
import AppNavbar from "@/components/shared/AppNavbar";
import ProfileHero from "./components/ProfileHero";
import AccountDetails from "./components/AccountDetails";
import WorkspaceStats from "./components/WorkspaceStats";
import ConnectedAccounts from "./components/ConnectedAccounts";
import ProfileActions from "./components/ProfileActions";
import { fetchProfile, type UserProfile } from "@/lib/api/profile.api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Minimal AppNavbar state (profile page doesn't need workspace switcher)
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProfile();
        setProfile(data);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans antialiased selection:bg-white/10 selection:text-white flex flex-col relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] blur-[140px] pointer-events-none" />
      </div>

      <AppNavbar
        currentWorkspace="Profile"
        switcherOpen={switcherOpen}
        setSwitcherOpen={setSwitcherOpen}
        onWorkspaceChange={() => {}}
        onSearchClick={() => {}}
        setSidebarOpen={setSidebarOpen}
        breadcrumb="Profile"
      />

      <main className="flex-1 w-full relative z-10">
        {/* Loading State */}
        {loading && (
          <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 py-12 space-y-10">
            {/* Hero skeleton */}
            <div className="flex items-center gap-6">
              <div className="w-[100px] h-[100px] rounded-full bg-zinc-900 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-8 w-56 bg-zinc-900 rounded-lg animate-pulse" />
                <div className="h-4 w-48 bg-zinc-900 rounded animate-pulse" />
                <div className="h-3 w-64 bg-zinc-900 rounded animate-pulse" />
              </div>
            </div>
            {/* Details skeleton */}
            <div className="space-y-4">
              <div className="h-4 w-32 bg-zinc-900 rounded animate-pulse" />
              <div className="border border-zinc-900 rounded-xl space-y-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-5 py-4 ${
                      i < 5 ? "border-b border-zinc-900" : ""
                    }`}
                  >
                    <div className="h-3 w-16 bg-zinc-900 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-zinc-900 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-zinc-900 rounded-xl px-5 py-5"
                >
                  <div className="h-4 w-4 bg-zinc-900 rounded animate-pulse mb-3" />
                  <div className="h-7 w-12 bg-zinc-900 rounded animate-pulse mb-2" />
                  <div className="h-3 w-20 bg-zinc-900 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-14 h-14 rounded-2xl border border-red-500/20 bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <i className="ti ti-alert-circle text-2xl text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">
              Failed to load profile
            </h2>
            <p className="text-sm text-zinc-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-5 py-2.5 text-sm font-medium text-zinc-100 transition-all hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer"
            >
              <i className="ti ti-refresh text-[14px]" />
              Try again
            </button>
          </div>
        )}

        {/* Profile Content */}
        {profile && !loading && (
          <div className="max-w-5xl mx-auto px-6 sm:px-8 md:px-12 py-10 space-y-10">
            <ProfileHero profile={profile} />
            <AccountDetails profile={profile} />
            <WorkspaceStats profile={profile} />
            <ConnectedAccounts profile={profile} />
            <ProfileActions />
          </div>
        )}
      </main>
    </div>
  );
}
