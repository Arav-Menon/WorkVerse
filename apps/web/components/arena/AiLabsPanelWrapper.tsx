'use client';

import React from 'react';
import { AiLabsPanel } from '@/components/arena/AiLabsPanel';

interface AiLabsPanelWrapperProps {
  spaceId: string;
}

export function AiLabsPanelWrapper({ spaceId }: AiLabsPanelWrapperProps) {
  return (
    <AiLabsPanel
      workspaceId={spaceId}
      spaceId={spaceId}
      organizationId=""
      teamName="Workspace"
    />
  );
}
