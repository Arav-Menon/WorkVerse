import React from 'react';
import { ArenaWrapper } from '../../../components/arena/ArenaWrapper';

interface PageProps {
  params: Promise<{ spaceId: string }>;
}

export default async function SpaceArenaPage({ params }: PageProps) {
  const { spaceId } = await params;

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#050505' }}>
      <ArenaWrapper spaceId={spaceId} />
    </div>
  );
}
