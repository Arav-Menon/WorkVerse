"use client";

import React from "react";
import { useParams } from "next/navigation";
import ConnectionsDeck from "@/app/workspace/components/ConnectionsDeck";
import { useWorkspace } from "@/hooks/use-workspaces";

export default function WorkspaceConnectionsPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const workspaceId = params.workspaceId as string;

  const { data: workspace } = useWorkspace(orgId, workspaceId);

  return (
    <ConnectionsDeck workspaceName={workspace?.name || ""} />
  );
}
