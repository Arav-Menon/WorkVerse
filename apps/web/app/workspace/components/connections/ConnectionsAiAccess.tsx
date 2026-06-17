import React from "react";
import type { ConnectedService } from "./data";

interface ConnectionsAiAccessProps {
  services: ConnectedService[];
}

export default function ConnectionsAiAccess({ services }: ConnectionsAiAccessProps) {
  const healthyServices = services.filter(s => s.health === "healthy");

  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2 mb-1">
          <i className="ti ti-robot text-blue-400"></i>
          AI Access Overview
        </h2>
        <p className="text-[12px] text-zinc-600">What WorkVerse AI can do on your behalf</p>
      </div>

      <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl overflow-hidden">
        {healthyServices.map((service, i, arr) => (
          <div key={service.id} className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-zinc-900/60" : ""}`}>
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
              <i className={`ti ${service.icon} text-zinc-400 text-base`}></i>
            </div>
            <div className="flex-grow">
              <p className="text-[13px] font-semibold text-zinc-200 mb-2">{service.name}</p>
              <div className="flex flex-wrap gap-2">
                {service.aiAccess.map(a => (
                  <span key={a} className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-900/60 border border-zinc-800 rounded-full px-2.5 py-1">
                    <i className="ti ti-check text-emerald-500 text-[10px]"></i>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
