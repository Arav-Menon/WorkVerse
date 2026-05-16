"use client";

import React from "react";
const CircleCheckIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default function UseCases() {
  return (
    <section id="use-cases" className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-zinc-50 mb-3">
        Use cases
      </div>
      <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-50 mb-3 leading-tight">
        One prompt. Real execution.
      </h2>
      <p className="text-base text-zinc-400 leading-relaxed max-w-2xl mb-12">
        Whether you&apos;re a founder, developer, or sales lead — WorkVerse handles the ops.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Use Case 1 */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 hover:bg-zinc-900 transition-colors group">
          <div className="text-[10px] font-medium tracking-[0.8px] uppercase text-zinc-200 mb-3 bg-zinc-900/40 inline-block px-2 py-1 rounded">
            Founder ops
          </div>
          <h4 className="text-sm font-medium text-zinc-50 mb-3">Investor outreach</h4>
          <div className="font-mono text-[11px] text-zinc-200 bg-zinc-900/20 px-3 py-2.5 rounded-md border border-zinc-800/30 mb-4 leading-relaxed group-hover:border-white/30 transition-colors">
            &quot;Schedule call, attach deck, follow up Thursday&quot;
          </div>
          <div className="flex items-start gap-2 text-xs text-zinc-400">
            <CircleCheckIcon size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="leading-relaxed">Calendar blocked, email sent, reminder scheduled</span>
          </div>
        </div>

        {/* Use Case 2 */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 hover:bg-zinc-900 transition-colors group">
          <div className="text-[10px] font-medium tracking-[0.8px] uppercase text-zinc-200 mb-3 bg-zinc-900/40 inline-block px-2 py-1 rounded">
            Dev work
          </div>
          <h4 className="text-sm font-medium text-zinc-50 mb-3">Deploy pipeline</h4>
          <div className="font-mono text-[11px] text-zinc-200 bg-zinc-900/20 px-3 py-2.5 rounded-md border border-zinc-800/30 mb-4 leading-relaxed group-hover:border-white/30 transition-colors">
            &quot;Deploy backend with CI/CD and alert team&quot;
          </div>
          <div className="flex items-start gap-2 text-xs text-zinc-400">
            <CircleCheckIcon size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="leading-relaxed">Dockerfile built, pipeline configured, Slack notified</span>
          </div>
        </div>

        {/* Use Case 3 */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 hover:bg-zinc-900 transition-colors group">
          <div className="text-[10px] font-medium tracking-[0.8px] uppercase text-zinc-200 mb-3 bg-zinc-900/40 inline-block px-2 py-1 rounded">
            Sales
          </div>
          <h4 className="text-sm font-medium text-zinc-50 mb-3">Lead outreach</h4>
          <div className="font-mono text-[11px] text-zinc-200 bg-zinc-900/20 px-3 py-2.5 rounded-md border border-zinc-800/30 mb-4 leading-relaxed group-hover:border-white/30 transition-colors">
            &quot;Email last week&apos;s leads, personalize each one&quot;
          </div>
          <div className="flex items-start gap-2 text-xs text-zinc-400">
            <CircleCheckIcon size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="leading-relaxed">Emails sent, CRM updated, replies tracked</span>
          </div>
        </div>

        {/* Use Case 4 */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-6 hover:bg-zinc-900 transition-colors group">
          <div className="text-[10px] font-medium tracking-[0.8px] uppercase text-zinc-200 mb-3 bg-zinc-900/40 inline-block px-2 py-1 rounded">
            Productivity
          </div>
          <h4 className="text-sm font-medium text-zinc-50 mb-3">Day planning</h4>
          <div className="font-mono text-[11px] text-zinc-200 bg-zinc-900/20 px-3 py-2.5 rounded-md border border-zinc-800/30 mb-4 leading-relaxed group-hover:border-white/30 transition-colors">
            &quot;Block deep work, reschedule 3pm, send standup&quot;
          </div>
          <div className="flex items-start gap-2 text-xs text-zinc-400">
            <CircleCheckIcon size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <span className="leading-relaxed">Calendar updated, meeting rescheduled, standup done</span>
          </div>
        </div>
      </div>
    </section>
  );
}
