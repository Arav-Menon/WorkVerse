'use client';

import React from 'react';
import { AiLabsPanel } from '@/components/arena/AiLabsPanel';

interface AiLabsPanelWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  spaceId: string;
}

export function AiLabsPanelWrapper({ isOpen, onClose, spaceId }: AiLabsPanelWrapperProps) {
  return (
    <AiLabsPanel
      isOpen={isOpen}
      onClose={onClose}
      workspaceId={spaceId}
      spaceId={spaceId}
      organizationId=""
      teamName="Workspace"
    />
  );
}
