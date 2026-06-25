"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ArenaHUD } from "@/components/arena/ArenaHUD";
import { BottomNavBar } from "@/components/arena/BottomNavBar";
import { AiLabsPanel } from "@/components/arena/AiLabsPanel";
import { useOrganization } from "@/hooks/use-organization";
import { useWorkspace } from "@/hooks/use-workspaces";

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const orgId = params.orgId as string;
  const workspaceId = params.workspaceId as string;
  const spaceId = params.spaceId as string;

  const { data: org } = useOrganization(orgId);
  const { data: workspace } = useWorkspace(orgId, workspaceId);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Phaser game canvas */}
      {children}

      {/* HUD overlays */}
      <ArenaHUD
        spaceId={spaceId}
        orgName={org?.name}
        workspaceName={workspace?.name}
        spaceName="Main"
        orgId={orgId}
        workspaceId={workspaceId}
      />

      {/* AI Labs slide-in panel */}
      <AiLabsPanel
        workspaceId={workspaceId}
        spaceId={spaceId}
        organizationId={orgId}
        teamName={workspace?.name ?? 'Workspace'}
      />

      {/* Bottom control bar */}
      <BottomNavBar />
    </div>
  );
}
