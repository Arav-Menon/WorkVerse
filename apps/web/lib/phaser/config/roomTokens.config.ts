export type LightProfile = 'cool' | 'warm' | 'warm-bright' | 'even' | 'bright' | 'dim-warm' | 'cool-dim' | 'warm-dim';

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
    accent: 0x8a7a6a,
    ambientTint: 0xf0ebe5,
    lightProfile: 'even',
    labelColor: '#6a5a4a',
    floorTint: 0xf0ebe5,
  },
  workspace: {
    name: 'Workspace',
    accent: 0x8a7a6a,
    ambientTint: 0xf0ebe5,
    lightProfile: 'even',
    labelColor: '#6a5a4a',
    floorTint: 0xf0ebe5,
  },
  engineering: {
    name: 'Engineering',
    accent: 0x4a70c0,
    ambientTint: 0xe0e5f0,
    lightProfile: 'cool',
    labelColor: '#3a5aa0',
    floorTint: 0xe8edf5,
  },
  design: {
    name: 'Design',
    accent: 0xd06858,
    ambientTint: 0xf5e8ea,
    lightProfile: 'warm',
    labelColor: '#c05040',
    floorTint: 0xf5ece8,
  },
  product: {
    name: 'Product',
    accent: 0xc09030,
    ambientTint: 0xf5f0e0,
    lightProfile: 'warm-bright',
    labelColor: '#a07820',
    floorTint: 0xf5f0e5,
  },
  operations: {
    name: 'Operations',
    accent: 0x5a9060,
    ambientTint: 0xe8f0e8,
    lightProfile: 'even',
    labelColor: '#3a7040',
    floorTint: 0xeaf0ea,
  },
  meeting: {
    name: 'Meeting Room',
    accent: 0x9070b0,
    ambientTint: 0xede8f5,
    lightProfile: 'bright',
    labelColor: '#7050a0',
    floorTint: 0xeee8f5,
  },
  quiet: {
    name: 'Quiet Zone',
    accent: 0x808888,
    ambientTint: 0xeeeceb,
    lightProfile: 'dim-warm',
    labelColor: '#606868',
    floorTint: 0xf0eeed,
  },
  ai_labs: {
    name: 'AI Labs',
    accent: 0xa07050,
    ambientTint: 0xf5ede5,
    lightProfile: 'warm-dim',
    labelColor: '#805030',
    floorTint: 0xf5efe8,
  },
};

export const ElevationSystem = {
  level0: { shadowOffset: 0, shadowAlpha: 0 },      // Floor
  level1: { shadowOffset: 3, shadowAlpha: 0.25 },   // Low furniture (desks, chairs)
  level2: { shadowOffset: 6, shadowAlpha: 0.35 },   // Tall furniture (server racks, plants)
  level3: { shadowOffset: 0, shadowAlpha: 0 },      // Walls (hard edge)
};

export const LightProfiles: Record<LightProfile, { ambientAlpha: number; accentIntensity: number; shadowColor: number }> = {
  cool:          { ambientAlpha: 0.06, accentIntensity: 0.5, shadowColor: 0xd0d5e0 },
  warm:          { ambientAlpha: 0.08, accentIntensity: 0.4, shadowColor: 0xe0d5d8 },
  'warm-bright': { ambientAlpha: 0.10, accentIntensity: 0.4, shadowColor: 0xe0ddd0 },
  even:          { ambientAlpha: 0.04, accentIntensity: 0.3, shadowColor: 0xe0dbd5 },
  bright:        { ambientAlpha: 0.10, accentIntensity: 0.5, shadowColor: 0xd8d0e0 },
  'dim-warm':    { ambientAlpha: 0.03, accentIntensity: 0.2, shadowColor: 0xe0ded8 },
  'cool-dim':    { ambientAlpha: 0.04, accentIntensity: 0.4, shadowColor: 0xd0d5e0 },
  'warm-dim':    { ambientAlpha: 0.04, accentIntensity: 0.3, shadowColor: 0xe0d8d0 },
};
