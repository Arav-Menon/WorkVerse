import { RoomTokens } from './roomTokens.config';

export const WorldConfig = {
  bounds: {
    width: 2400,
    height: 1800,
  },
  player: {
    speed: 220,
    radius: 16,
    color: 0xffffff, // Pure white — matches landing page primary
  },
  remotePlayer: {
    radius: 16,
    color: 0x71717a, // zinc-500
  },
  colors: {
    // Floor — warm light base
    background:      0xf5f0eb,
    floorTile:       0xf0ebe5,
    floorTileAlt:    0xede8e2,
    floorGrid:       0xe0dbd5,

    // Walls / Room dividers — warm light greys
    wall:            0xc8c0b8,
    wallHighlight:   0xb8b0a8,

    // Desk / furniture — light wood tones
    deskBase:        0xe8e0d8,
    deskTop:         0xf0e8e0,
    deskSurface:     0xfaf5f0,
    chairBody:       0xd0c8c0,
    chairBack:       0xb8b0a8,
    monitorFrame:    0x2a221c,
    monitorScreen:   0x1a1512,
    monitorGlow:     0x3d5060,

    // Meeting room — light fabric tones
    carpetMeeting:   0xe8e2dc,
    carpetBorder:    0xc8c0b8,
    tableBase:       0xd0c0b0,
    tableTop:        0xe0d0c0,

    // AI Lab zone — warm with amber accent
    carpetAiLab:     0xf0ebe5,
    aiLabAccent:     0xa07050,
    aiLabGlow:       0x6080a0,
    aiServer:        0x3a3530,
    aiServerLight:   0x5a9a50,

    // Plants — natural greens
    potClay:         0xc0a890,
    leafDark:        0x4a7a40,
    leafLight:       0x60a050,

    // Lighting / ambience — warm whites
    lightWarm:       0xfff8f0,
    lightCool:       0xd8d0c8,
    glowWhite:       0xfff8f0,
  },

  // Room-specific accent colors (from roomTokens)
  roomAccents: {
    open_office: RoomTokens.open_office.accent,
    workspace: RoomTokens.workspace.accent,
    engineering: RoomTokens.engineering.accent,
    design: RoomTokens.design.accent,
    product: RoomTokens.product.accent,
    operations: RoomTokens.operations.accent,
    meeting: RoomTokens.meeting.accent,
    quiet: RoomTokens.quiet.accent,
    ai_labs: RoomTokens.ai_labs.accent,
  },
};
