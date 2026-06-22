"use client";

import React, { useState } from "react";
import type { UserProfile } from "@/lib/api/profile.api";

interface AccountDetailsProps {
  profile: UserProfile;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function AccountDetails({ profile }: AccountDetailsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(profile.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Name", value: <span className="text-white">{profile.name}</span> },
    { label: "Email", value: <span className="text-white">{profile.email}</span> },
    {
      label: "User ID",
      value: (
        <div className="flex items-center gap-2">
          <code className="font-mono text-zinc-500 text-[13px] bg-zinc-900/60 px-2 py-0.5 rounded">
            {profile.id.substring(0, 8)}...
          </code>
          <button
            onClick={handleCopyId}
            className="text-zinc-600 hover:text-white transition-colors cursor-pointer"
            aria-label="Copy user ID"
          >
            <i className={`ti ${copied ? "ti-check" : "ti-copy"} text-sm`} />
          </button>
        </div>
      ),
    },
    {
      label: "Status",
      value: (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Active
        </span>
      ),
    },
    {
      label: "Joined",
      value: <span className="text-white">{formatDate(profile.createdAt)}</span>,
    },
  ];

  return (
    <section aria-labelledby="account-details-heading">
      <h2
        id="account-details-heading"
        className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4"
      >
        Account Details
      </h2>

      <div className="border border-zinc-800/60 rounded-xl overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-3.5 ${
              i < rows.length - 1 ? "border-b border-zinc-800/30" : ""
            } hover:bg-zinc-900/30 transition-colors`}
          >
            <span className="text-[13px] text-zinc-500">{row.label}</span>
            <span className="text-[13px]">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
