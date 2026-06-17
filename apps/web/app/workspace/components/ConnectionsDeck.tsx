import React, { useState } from "react";
import {
  ConnectionsHeader,
  ConnectionsStats,
  ConnectionsQuickActions,
  ConnectionsFilterPills,
  ConnectionsEmptyState,
  ConnectedServiceCard,
  AvailableIntegrationCard,
  ConnectionsActivity,
  ConnectionsRecommendations,
  ConnectionsAiAccess,
  connectedServices,
  availableIntegrations,
  healthStats,
  recentActivity,
  recommendations,
  filterPills,
} from "./connections";

export default function ConnectionsDeck({ workspaceName }: { workspaceName: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const filteredConnected = connectedServices.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || s.category === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredAvailable = availableIntegrations.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "All" || s.category === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const noResults = filteredConnected.length === 0 && filteredAvailable.length === 0;

  return (
    <div className="w-full">
      <ConnectionsHeader
        workspaceName={workspaceName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ConnectionsStats stats={healthStats} />

      <ConnectionsQuickActions />

      <ConnectionsFilterPills
        pills={filterPills}
        activeFilter={filterCategory}
        onFilterChange={setFilterCategory}
      />

      {noResults && (
        <ConnectionsEmptyState
          onClearFilters={() => { setSearchQuery(""); setFilterCategory("All"); }}
        />
      )}

      {filteredConnected.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <i className="ti ti-check-circle text-emerald-500"></i>
              Connected Services
            </h2>
            <span className="text-[11px] text-zinc-600">{filteredConnected.length} services</span>
          </div>

          <div className="space-y-3">
            {filteredConnected.map(service => (
              <ConnectedServiceCard
                key={service.id}
                service={service}
                isExpanded={expandedService === service.id}
                onToggleExpand={() => setExpandedService(expandedService === service.id ? null : service.id)}
              />
            ))}
          </div>
        </section>
      )}

      {filteredAvailable.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <i className="ti ti-plus-circle text-zinc-400"></i>
              Available Integrations
            </h2>
            <span className="text-[11px] text-zinc-600">{filteredAvailable.length} available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {filteredAvailable.map(int => (
              <AvailableIntegrationCard key={int.id} integration={int} />
            ))}
          </div>
        </section>
      )}

      <ConnectionsActivity activities={recentActivity} />

      <ConnectionsRecommendations recommendations={recommendations} />

      <ConnectionsAiAccess services={connectedServices} />
    </div>
  );
}
