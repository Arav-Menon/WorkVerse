import React from 'react';
import { ArenaHUD } from '../../../components/arena/ArenaHUD';
import { ArenaWrapper } from '../../../components/arena/ArenaWrapper';
import { BottomNavBar } from '../../../components/arena/BottomNavBar';
import { AiLabsPanel } from '../../../components/arena/AiLabsPanel';

interface PageProps {
  params: Promise<{ spaceId: string }>;
}

export default async function SpaceArenaPage({ params }: PageProps) {
  const { spaceId } = await params;

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#050505' }}>
      <ArenaWrapper spaceId={spaceId} />
      <ArenaHUD spaceId={spaceId} />
      <AiLabsPanel />
      <BottomNavBar />
    </div>
  );
}
