'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { WorkflowDeploymentData } from '../../../hooks/use-ai-labs';

const SERVICE_DISPLAY: Record<string, { name: string; icon: string }> = {
  slack: { name: 'Slack', icon: 'ti-brand-slack' },
  notion: { name: 'Notion', icon: 'ti-notes' },
  github: { name: 'GitHub', icon: 'ti-brand-github' },
  gmail: { name: 'Gmail', icon: 'ti-mail' },
  linear: { name: 'Linear', icon: 'ti-arrow-forward-up' },
  calendar: { name: 'Calendar', icon: 'ti-calendar' },
  webhook: { name: 'Webhook', icon: 'ti-webhook' },
  search: { name: 'Search', icon: 'ti-search' },
  internal_ai: { name: 'AI', icon: 'ti-robot' },
};

function formatServiceName(service: string): string {
  return SERVICE_DISPLAY[service]?.name || service.charAt(0).toUpperCase() + service.slice(1);
}

function formatAction(action: string): string {
  return action
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(date: Date): string {
  const now = Date.now();
  const then = date.getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function generateSummary(steps: { service: string; action: string }[]): string {
  if (steps.length === 0) return 'Workflow has been deployed and is ready to use.';
  if (steps.length === 1) {
    const step = steps[0]!;
    return `This workflow will ${formatAction(step.action)} using ${formatServiceName(step.service)}.`;
  }
  const first = steps[0]!;
  const rest = steps.slice(1);
  const serviceNames = rest.map((s) => formatServiceName(s.service));
  return `When triggered, this workflow will ${formatAction(first.action)} using ${formatServiceName(first.service)}, then ${serviceNames.join(', ')}.`;
}

interface WorkflowDeploymentCardProps {
  data: WorkflowDeploymentData;
  orgId?: string;
}

export function WorkflowDeploymentCard({ data, orgId }: WorkflowDeploymentCardProps) {
  const router = useRouter();
  const isSuccess = data.status === 'completed';

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isSuccess
          ? 'bg-zinc-950/60 border-emerald-500/20'
          : 'bg-zinc-950/60 border-red-500/20'
      }`}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 flex items-center gap-2.5 border-b ${
          isSuccess
            ? 'border-emerald-500/10 bg-emerald-500/5'
            : 'border-red-500/10 bg-red-500/5'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            isSuccess ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`}
        >
          <i
            className={`ti ${
              isSuccess ? 'ti-check text-emerald-400' : 'ti-x text-red-400'
            } text-xs`}
          />
        </div>
        <span className="text-[12px] font-bold text-white">
          {isSuccess ? 'Workflow Deployed Successfully' : 'Workflow Deployment Failed'}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5 space-y-3.5">
        {/* Name + Status row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">
              Workflow
            </p>
            <p className="text-[13px] text-zinc-100 font-bold truncate">
              {data.workflowName}
            </p>
          </div>
          <span
            className={`shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
              isSuccess
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : 'bg-red-500/10 border-red-500/25 text-red-400'
            }`}
          >
            {isSuccess ? 'Active' : 'Failed'}
          </span>
        </div>

        {/* Summary */}
        <div>
          <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">
            Summary
          </p>
          <p className="text-[12px] text-zinc-400 leading-relaxed">
            {generateSummary(data.steps)}
          </p>
        </div>

        {/* Integrations */}
        {data.integrations.length > 0 && (
          <div>
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">
              Integrations
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.integrations.map((service) => {
                const display = SERVICE_DISPLAY[service];
                return (
                  <span
                    key={service}
                    className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1"
                  >
                    <i className={`ti ${display?.icon || 'ti-circle'} text-[10px]`} />
                    {display?.name || formatServiceName(service)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Steps */}
        {data.steps.length > 0 && (
          <div>
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">
              Actions
            </p>
            <div className="space-y-1">
              {data.steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-2 text-[11px]">
                  <span className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[9px] text-zinc-400 font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-zinc-400">
                    {formatAction(step.action)}
                  </span>
                  <span className="text-zinc-600">via</span>
                  <span className="text-zinc-500 font-medium">
                    {formatServiceName(step.service)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow ID + Timestamp */}
        <div className="flex items-center justify-between text-[11px] text-zinc-600 pt-1 border-t border-zinc-900">
          <span className="font-mono">ID: {data.workflowId.slice(0, 12)}...</span>
          <span>{timeAgo(data.timestamp)}</span>
        </div>
      </div>

      {/* Footer - Action buttons */}
      {isSuccess && (
        <div className="px-4 py-3 border-t border-zinc-900 bg-zinc-950/40 space-y-2">
          {orgId && data.workflowDbId && (
            <button
              onClick={() => router.push(`/organization/${orgId}/workflows/${data.workflowDbId}`)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-[12px] font-semibold hover:bg-blue-500/30 transition-colors"
            >
              <i className="ti ti-eye text-[11px]" />
              View Workflow
            </button>
          )}
          {data.workflowUrl && (
            <a
              href={data.workflowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-black text-[12px] font-semibold hover:bg-zinc-200 transition-colors"
            >
              <i className="ti ti-external-link text-[11px]" />
              Open in n8n
            </a>
          )}
        </div>
      )}
    </div>
  );
}
