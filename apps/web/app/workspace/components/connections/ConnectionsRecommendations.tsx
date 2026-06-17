import React from "react";
import type { Recommendation } from "./data";

interface ConnectionsRecommendationsProps {
  recommendations: Recommendation[];
}

export default function ConnectionsRecommendations({ recommendations }: ConnectionsRecommendationsProps) {
  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-1">
          <i className="ti ti-lightbulb text-amber-400"></i>
          Recommendations
        </h2>
        <p className="text-[12px] text-zinc-600">Suggestions to improve your workspace connections</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {recommendations.map((rec, i) => (
          <div key={i} className={`bg-zinc-950/30 border rounded-2xl p-5 flex flex-col gap-4 ${
            rec.type === "reconnect"
              ? "border-amber-500/20 hover:border-amber-500/30"
              : "border-zinc-900/80 hover:border-zinc-800"
          } transition-all`}>
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                rec.type === "reconnect"
                  ? "bg-amber-500/10 border-amber-500/25"
                  : "bg-zinc-900 border-zinc-800"
              }`}>
                <i className={`ti ${rec.icon} text-lg ${
                  rec.type === "reconnect" ? "text-amber-400" : "text-zinc-400"
                }`}></i>
              </div>
              {rec.type === "reconnect" && (
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-amber-500/10 border-amber-500/25 text-amber-400">
                  Action Needed
                </span>
              )}
            </div>
            <div className="flex-grow">
              <p className="text-[13px] font-bold text-zinc-200 mb-1">{rec.title}</p>
              <p className="text-[12px] text-zinc-500 leading-relaxed">{rec.desc}</p>
            </div>
            <button className={`self-start px-4 py-2 rounded-lg border text-[12px] font-semibold transition-all ${
              rec.type === "reconnect"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                : "border-zinc-800 text-zinc-300 hover:bg-white hover:text-black hover:border-white"
            }`}>
              {rec.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
