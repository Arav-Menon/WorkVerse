"use client";

import React from "react";
import { useParams } from "next/navigation";
import AiLabDeck from "@/app/workspace/components/AiLabDeck";
import { useOrganization } from "@/hooks/use-organization";

export default function AiLabPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  const { data: org } = useOrganization(orgId);

  return <AiLabDeck orgName={org?.name || ""} />;
}
