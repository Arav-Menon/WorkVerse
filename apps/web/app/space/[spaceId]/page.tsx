import React from 'react';
import { ArenaHUD } from '../../../components/arena/ArenaHUD';
import { ArenaClientWrapper } from '../../../components/arena/ArenaClientWrapper';
import { BottomNavBar } from '../../../components/arena/BottomNavBar';
import { AiLabsPanel } from '../../../components/arena/AiLabsPanel';

interface PageProps {
  params: Promise<{ spaceId: string }>;
}

export default async function SpaceArenaPage({ params }: PageProps) {
  const { spaceId } = await params;

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#050505' }}>
      {/* Phaser game canvas */}
      <ArenaClientWrapper spaceId={spaceId} />

      {/* React UI overlays — all pointer-events-none at root, specific children opt back in */}
      <ArenaHUD spaceId={spaceId} />

      {/* AI Labs slide-in panel + trigger button */}
      <AiLabsPanel />

      {/* Bottom control bar */}
      <BottomNavBar />
    </div>
  );
}
