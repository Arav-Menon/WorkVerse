"use client";

import React from "react";
import { useParams } from "next/navigation";
import OrgHeroSection from "@/app/workspace/components/OrgHeroSection";
import { useWorkspace } from "@/hooks/use-workspaces";

export default function WorkspaceWorkspacesPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const workspaceId = params.workspaceId as string;

  const { data: workspace } = useWorkspace(orgId, workspaceId);

  const workspaceName = workspace?.name || "Workspace";

  return (
    <>
      <OrgHeroSection
        orgName={workspaceName}
        onLaunchClick={() => alert(`Spawning voice server nodes inside ${workspaceName}...`)}
        workspaceCount={workspace?.spaceCount}
      />
      {workspace?.description && (
        <p className="text-xs text-zinc-500 mb-6 max-w-[480px] leading-relaxed">{workspace.description}</p>
      )}
    </>
  );
}
