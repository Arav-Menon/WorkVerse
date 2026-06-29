"use client";

import React from "react";
import { useParams } from "next/navigation";
import AiLabDeck from "@/app/workspace/components/AiLabDeck";
import { useWorkspace } from "@/hooks/use-workspaces";

export default function WorkspaceAiLabPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  const workspaceId = params.workspaceId as string;

  const { data: workspace } = useWorkspace(orgId, workspaceId);

  return <AiLabDeck orgName={workspace?.name || ""} />;
}
