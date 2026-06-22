"use client";

import React from "react";
import type { UserProfile } from "@/lib/api/profile.api";

interface ConnectedAccountsProps {
  profile: UserProfile;
}

const PROVIDER_ICONS: Record<string, string> = {
  GITHUB: "ti-brand-github",
  GOOGLE: "ti-brand-google",
  SLACK: "ti-brand-slack",
};

const PROVIDER_LABELS: Record<string, string> = {
  GITHUB: "GitHub",
  GOOGLE: "Google",
  SLACK: "Slack",
};

export default function ConnectedAccounts({ profile }: ConnectedAccountsProps) {
  const accounts = profile.connectedAccounts ?? [];

  return (
    <section aria-labelledby="connected-accounts-heading">
      <h2
        id="connected-accounts-heading"
        className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4"
      >
        Connected Accounts
      </h2>

      {accounts.length === 0 ? (
        <div className="border border-zinc-800/60 rounded-xl px-5 py-4">
          <p className="text-[13px] text-zinc-500">
            No accounts connected yet.
          </p>
        </div>
      ) : (
        <div className="border border-zinc-800/60 rounded-xl overflow-hidden divide-y divide-zinc-800/30">
          {accounts.map((account) => (
            <div
              key={account.provider}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-900/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <i
                  className={`ti ${PROVIDER_ICONS[account.provider] || "ti-link"} text-white text-sm`}
                />
              </div>
              <span className="text-[13px] text-white font-medium flex-1">
                {PROVIDER_LABELS[account.provider] || account.provider}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                <span className="w-1 h-1 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
