'use client';

import React from 'react';
import { ArenaWrapper } from './ArenaWrapper';

interface ArenaClientWrapperProps {
  spaceId: string;
  orgId?: string;
  workspaceId?: string;
}

export function ArenaClientWrapper({ spaceId, orgId, workspaceId }: ArenaClientWrapperProps) {
  return <ArenaWrapper spaceId={spaceId} orgId={orgId} workspaceId={workspaceId} />;
}
