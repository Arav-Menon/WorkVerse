export type MonitorCount = 0 | 1 | 2;
export type ClutterType = 'none' | 'papers' | 'coffee' | 'plant' | 'headphones';
export type ChairState = 'pushed-in' | 'pulled-out';

export interface DeskVariation {
  monitors: MonitorCount;
  clutter: ClutterType;
  chair: ChairState;
}

// Simple hash function for deterministic variations per desk ID
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

const MONITOR_OPTIONS: MonitorCount[] = [0, 1, 2];
const CLUTTER_OPTIONS: ClutterType[] = ['none', 'papers', 'coffee', 'plant', 'headphones'];
const CHAIR_OPTIONS: ChairState[] = ['pushed-in', 'pulled-out'];

export function getDeskVariation(deskId: string): DeskVariation {
  const seed = hashString(deskId);
  return {
    monitors: MONITOR_OPTIONS[seed % MONITOR_OPTIONS.length]!,
    clutter: CLUTTER_OPTIONS[(seed >> 2) % CLUTTER_OPTIONS.length]!,
    chair: CHAIR_OPTIONS[(seed >> 4) % CHAIR_OPTIONS.length]!,
  };
}

export const ClutterColors: Record<ClutterType, number> = {
  none: 0x000000,
  papers: 0xe8e0d8,
  coffee: 0x6a4020,
  plant: 0x4a8040,
  headphones: 0x5a5048,
};

export const ClutterSizes: Record<ClutterType, { w: number; h: number }> = {
  none: { w: 0, h: 0 },
  papers: { w: 20, h: 14 },
  coffee: { w: 12, h: 14 },
  plant: { w: 16, h: 16 },
  headphones: { w: 18, h: 12 },
};
