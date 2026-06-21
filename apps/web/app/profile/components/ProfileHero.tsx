"use client";

import React from "react";
import type { UserProfile } from "@/lib/api/profile.api";

interface ProfileHeroProps {
  profile: UserProfile;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function ProfileHero({ profile }: ProfileHeroProps) {
  const initials = getInitials(profile.name);
  const memberSince = formatDate(profile.createdAt);

  return (
    <section className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
      {/* Avatar */}
      <div className="relative flex-shrink-0 self-start sm:self-center">
        <div className="relative w-[100px] h-[100px] rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 flex items-center justify-center text-[28px] font-semibold text-white">
          {initials}
        </div>
        <div
          className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-black"
          aria-label="Online"
        />
      </div>

      {/* Identity */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[28px] font-semibold text-white tracking-tight leading-tight mb-1">
          {profile.name}
        </h1>
        <p className="font-mono text-[13px] text-zinc-400 mb-1.5">
          {profile.email}
        </p>
        <div className="flex items-center gap-3 text-[12px] text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <i className="ti ti-calendar text-[13px] text-zinc-600" />
            Member since {memberSince}
          </span>
          {profile.counts?.organizations != null && (
            <>
              <span className="text-zinc-700">·</span>
              <span>{profile.counts.organizations} organizations</span>
            </>
          )}
          {profile.counts?.workspaces != null && (
            <>
              <span className="text-zinc-700">·</span>
              <span>{profile.counts.workspaces} workspaces</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
