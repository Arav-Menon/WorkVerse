import React from "react";
import type { Workflow } from "./data";

interface AiLabWorkflowsProps {
  workflows: Workflow[];
}

export default function AiLabWorkflows({ workflows }: AiLabWorkflowsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <i className="ti ti-arrows-split text-emerald-400"></i>
          Workflows
        </h3>
        <span className="text-[11px] text-zinc-600">{workflows.filter(w => w.status === "active").length} active</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {workflows.map(wf => (
          <div key={wf.id} className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-3 hover:border-zinc-800 transition-colors group cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <i className="ti ti-arrows-split text-emerald-400 text-sm"></i>
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                wf.status === "active"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
              }`}>
                {wf.status}
              </span>
            </div>

            <div className="flex-grow">
              <p className="text-[13px] font-bold text-zinc-200 group-hover:text-white transition-colors mb-1">{wf.name}</p>
              <p className="text-[10px] text-zinc-600 font-mono mb-2">{wf.trigger}</p>

              {/* Step indicators */}
              <div className="flex items-center gap-1">
                {wf.steps.map((step, i) => (
                  <React.Fragment key={i}>
                    <span className="text-[9px] text-zinc-500 bg-zinc-900/60 border border-zinc-800 rounded px-1.5 py-0.5 truncate max-w-[80px]">
                      {step}
                    </span>
                    {i < wf.steps.length - 1 && (
                      <i className="ti ti-chevron-right text-[8px] text-zinc-700 shrink-0"></i>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-900/60">
              <span className="text-[10px] text-zinc-600 font-mono">{wf.runCount} runs</span>
              <span className="text-[10px] text-zinc-500">{wf.lastRun}</span>
            </div>
          </div>
        ))}

        {/* Create Workflow Card */}
        <div className="bg-transparent border border-dashed border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 min-h-[180px] transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-zinc-300 transition-colors">
            <i className="ti ti-plus text-sm"></i>
          </div>
          <p className="text-[12px] font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">Create Workflow</p>
        </div>
      </div>
    </section>
  );
}
