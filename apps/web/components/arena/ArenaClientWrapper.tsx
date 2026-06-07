'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LoadingScreen } from './LoadingScreen';

// Dynamically import the Phaser Canvas to avoid SSR and hydration issues
// By keeping next/dynamic with ssr: false inside a 'use client' file, Next.js allows it.
const ArenaCanvas = dynamic(
  () => import('./ArenaCanvas'),
  { 
    ssr: false,
    loading: () => <LoadingScreen />
  }
);

interface ArenaClientWrapperProps {
  spaceId: string;
}

export function ArenaClientWrapper({ spaceId }: ArenaClientWrapperProps) {
  return <ArenaCanvas spaceId={spaceId} />;
}
