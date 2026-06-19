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
    // Floor — pure black base matching landing page
    background:      0x050505,
    floorTile:       0x0a0a0a,
    floorTileAlt:    0x080808,
    floorGrid:       0x18181b, // zinc-900

    // Walls / Room dividers — zinc tones
    wall:            0x18181b, // zinc-900
    wallHighlight:   0x27272a, // zinc-800

    // Desk / furniture — monochrome greys
    deskBase:        0x18181b, // zinc-900
    deskTop:         0x27272a, // zinc-800
    deskSurface:     0x3f3f46, // zinc-700
    chairBody:       0x18181b,
    chairBack:       0x09090b,
    monitorFrame:    0x09090b,
    monitorScreen:   0x27272a, // zinc-800, dim
    monitorGlow:     0x3f3f46, // zinc-700 glow

    // Meeting room — subtle white accents
    carpetMeeting:   0x0a0a0a,
    carpetBorder:    0x27272a,
    tableBase:       0x18181b,
    tableTop:        0x27272a,

    // AI Lab zone — same monochrome, slight lift
    carpetAiLab:     0x09090b,
    aiLabAccent:     0x52525b, // zinc-600
    aiLabGlow:       0x3f3f46, // zinc-700
    aiServer:        0x0a0a0a,
    aiServerLight:   0x10b981, // emerald-500 (the one accent color used on landing)

    // Plants — subtle grey-greens to keep monochrome feel
    potClay:         0x27272a,
    leafDark:        0x3f3f46,
    leafLight:       0x52525b,

    // Lighting / ambience — white only
    lightWarm:       0xffffff,
    lightCool:       0xa1a1aa, // zinc-400
    glowWhite:       0xffffff,
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
