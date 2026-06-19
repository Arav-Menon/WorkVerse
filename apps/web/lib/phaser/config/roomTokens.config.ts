export type LightProfile = 'cool' | 'warm' | 'warm-bright' | 'even' | 'bright' | 'dim-warm' | 'cool-dim';

export interface RoomToken {
  name: string;
  accent: number;
  ambientTint: number;
  lightProfile: LightProfile;
  labelColor: string;
  floorTint: number;
}

export interface RoomTokenMap {
  open_office: RoomToken;
  workspace: RoomToken;
  engineering: RoomToken;
  design: RoomToken;
  product: RoomToken;
  operations: RoomToken;
  meeting: RoomToken;
  quiet: RoomToken;
  ai_labs: RoomToken;
}

export const RoomTokens: RoomTokenMap = {
  open_office: {
    name: 'Open Office',
    accent: 0x94a3b8,        // zinc-400 — neutral, default
    ambientTint: 0x0a0a0a,
    lightProfile: 'even',
    labelColor: '#94a3b8',
    floorTint: 0x0a0a0a,
  },
  workspace: {
    name: 'Workspace',
    accent: 0x94a3b8,        // zinc-400 — neutral, default
    ambientTint: 0x0a0a0a,
    lightProfile: 'even',
    labelColor: '#94a3b8',
    floorTint: 0x0a0a0a,
  },
  engineering: {
    name: 'Engineering',
    accent: 0x4F8EF7,        // Cool blue — code editors, terminals
    ambientTint: 0x1a2433,
    lightProfile: 'cool',
    labelColor: '#4F8EF7',
    floorTint: 0x0c0e14,
  },
  design: {
    name: 'Design',
    accent: 0xF77D7D,        // Warm coral/pink — creative tools
    ambientTint: 0x2a1f24,
    lightProfile: 'warm',
    labelColor: '#F77D7D',
    floorTint: 0x140f12,
  },
  product: {
    name: 'Product',
    accent: 0xE8B14C,        // Amber/gold — strategic, roadmap
    ambientTint: 0x2a2418,
    lightProfile: 'warm-bright',
    labelColor: '#E8B14C',
    floorTint: 0x14120c,
  },
  operations: {
    name: 'Operations',
    accent: 0x6FAF8B,        // Slate green — calm, infrastructure
    ambientTint: 0x1c241f,
    lightProfile: 'even',
    labelColor: '#6FAF8B',
    floorTint: 0x0e1210,
  },
  meeting: {
    name: 'Meeting Room',
    accent: 0x9D7FE8,        // Violet — distinct, "different mode"
    ambientTint: 0x241f2e,
    lightProfile: 'bright',
    labelColor: '#a5b4fc',
    floorTint: 0x12101a,
  },
  quiet: {
    name: 'Quiet Zone',
    accent: 0x7C8A9A,        // Desaturated blue-grey — lowest energy
    ambientTint: 0x1a1d22,
    lightProfile: 'dim-warm',
    labelColor: '#7C8A9A',
    floorTint: 0x0d0e11,
  },
  ai_labs: {
    name: 'AI Labs',
    accent: 0x4FD1C5,        // Cyan/teal — restrained, not neon
    ambientTint: 0x16242a,
    lightProfile: 'cool-dim',
    labelColor: '#38bdf8',
    floorTint: 0x0b1215,
  },
};

export const ElevationSystem = {
  level0: { shadowOffset: 0, shadowAlpha: 0 },      // Floor
  level1: { shadowOffset: 3, shadowAlpha: 0.25 },   // Low furniture (desks, chairs)
  level2: { shadowOffset: 6, shadowAlpha: 0.35 },   // Tall furniture (server racks, plants)
  level3: { shadowOffset: 0, shadowAlpha: 0 },      // Walls (hard edge)
};

export const LightProfiles: Record<LightProfile, { ambientAlpha: number; accentIntensity: number; shadowColor: number }> = {
  cool:          { ambientAlpha: 0.08, accentIntensity: 0.6, shadowColor: 0x1a2433 },
  warm:          { ambientAlpha: 0.10, accentIntensity: 0.5, shadowColor: 0x2a1f24 },
  'warm-bright': { ambientAlpha: 0.12, accentIntensity: 0.5, shadowColor: 0x2a2418 },
  even:          { ambientAlpha: 0.06, accentIntensity: 0.4, shadowColor: 0x0a0a0a },
  bright:        { ambientAlpha: 0.14, accentIntensity: 0.6, shadowColor: 0x241f2e },
  'dim-warm':    { ambientAlpha: 0.04, accentIntensity: 0.3, shadowColor: 0x1a1d22 },
  'cool-dim':    { ambientAlpha: 0.06, accentIntensity: 0.5, shadowColor: 0x16242a },
};
