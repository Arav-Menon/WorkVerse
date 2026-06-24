import React from 'react';
import { ArenaWrapper } from '../../../../../../../components/arena/ArenaWrapper';

interface PageProps {
  params: Promise<{ orgId: string; workspaceId: string; spaceId: string }>;
}

export default async function SpaceArenaPage({ params }: PageProps) {
  const { spaceId } = await params;

  return <ArenaWrapper spaceId={spaceId} />;
}
