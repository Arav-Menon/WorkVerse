import Phaser from 'phaser';
import { WorldConfig } from '../config/world.config';
import { StructuralCollisions, FurnitureCollisions } from '../config/collision.config';
import { RoomTokens, LightProfiles } from '../config/roomTokens.config';
import { getDeskVariation, ClutterColors } from '../config/furnitureVariation.config';
import { Player } from '../entities/Player';
import { RemotePlayer } from '../entities/RemotePlayer';
import { MovementSystem } from '../systems/MovementSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ProximitySystem } from '../systems/ProximitySystem';
import { InteractionSystem } from '../systems/InteractionSystem';
import { OccupancySystem } from '../systems/OccupancySystem';
import { MicroAnimationSystem } from '../systems/MicroAnimationSystem';

const C = WorldConfig.colors;
const { width: W, height: H } = WorldConfig.bounds;

export class ArenaScene extends Phaser.Scene {
  private localPlayer!: Player;
  private remotePlayers: Map<string, RemotePlayer> = new Map();

  private movementSystem!: MovementSystem;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private proximitySystem!: ProximitySystem;
  private interactionSystem!: InteractionSystem;
  private occupancySystem!: OccupancySystem;
  private microAnimationSystem!: MicroAnimationSystem;

  private structuralLayer!: Phaser.Physics.Arcade.StaticGroup;
  private furnitureLayer!: Phaser.Physics.Arcade.StaticGroup;

  private spaceId: string = '';

  constructor() {
    super({ key: 'ArenaScene' });
  }

  init(data: { spaceId: string }) {
    this.spaceId = data.spaceId;
  }

  preload() { /* Shapes-only MVP — no external assets needed */ }

  create() {
    this.cameras.main.setBackgroundColor(C.background);
    this.physics.world.setBounds(0, 0, W, H);

    this.drawFloor();
    this.drawRoomDividers();
    this.drawDoorways();
    this.drawOpenOfficeZone();
    this.drawMeetingRoomZone();
    this.drawAiLabZone();
    this.drawPlants();
    this.drawRoomLabels();
    this.drawRoomLightingOverlays();

    // Local Player — MUST be created before collision layers
    this.localPlayer = new Player(this, 'local-1', 'Arav', 700, 600);

    // Collision layers (invisible physics bodies) — requires localPlayer
    this.createCollisionLayers();

    // Dummy remote players distributed across zones
    const dummies = [
      { id: 'rem-1', name: 'Ansh', x: 350, y: 280 },
      { id: 'rem-2', name: 'Raj', x: 600, y: 280 },
      { id: 'rem-3', name: 'Sarah', x: 350, y: 900 },
      { id: 'rem-4', name: 'Alex', x: 1750, y: 500 },
      { id: 'rem-5', name: 'Priya', x: 1750, y: 1300 },
    ];
    dummies.forEach(d => {
      this.remotePlayers.set(d.id, new RemotePlayer(this, d.id, d.name, d.x, d.y));
    });

    // Systems
    this.movementSystem = new MovementSystem(this);
    this.cameraSystem = new CameraSystem(this);
    this.collisionSystem = new CollisionSystem();
    this.proximitySystem = new ProximitySystem();
    this.interactionSystem = new InteractionSystem(this);
    this.occupancySystem = new OccupancySystem(this);
    this.microAnimationSystem = new MicroAnimationSystem(this);
    this.cameraSystem.startFollowing(this.localPlayer);

    // Register desks for occupancy tracking
    this.registerDesksForOccupancy();

    // Register animated objects for micro-animations
    this.registerAnimatedObjects();

    // Set camera bounds for animation culling
    this.microAnimationSystem.setCameraBounds(new Phaser.Geom.Rectangle(0, 0, W, H));
  }

  update(time: number, delta: number) {
    this.movementSystem.update(this.localPlayer, delta);
    this.collisionSystem.update();
    this.proximitySystem.update(this.localPlayer, this.remotePlayers);
    this.interactionSystem.update(this.localPlayer);
    this.occupancySystem.update(this.localPlayer, this.remotePlayers);
    this.microAnimationSystem.update(time);
  }

  private registerDesksForOccupancy() {
    // Open Office desks
    this.occupancySystem.registerDesk('desk-1', 160, 180, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-2', 380, 180, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-3', 600, 180, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-4', 160, 460, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-5', 380, 460, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-6', 600, 460, 200, 90, this.add.graphics());
    // Workspace desks
    this.occupancySystem.registerDesk('desk-7', 160, 800, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-8', 380, 800, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-9', 600, 800, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-10', 160, 1020, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-11', 380, 1020, 200, 90, this.add.graphics());
    // AI Labs desks
    this.occupancySystem.registerDesk('ai-desk-1', 1400, 120, 180, 90, this.add.graphics());
    this.occupancySystem.registerDesk('ai-desk-2', 1650, 120, 180, 90, this.add.graphics());
    this.occupancySystem.registerDesk('ai-desk-3', 1400, 460, 180, 90, this.add.graphics());
    this.occupancySystem.registerDesk('ai-desk-4', 1650, 460, 180, 90, this.add.graphics());
  }

  private registerAnimatedObjects() {
    // Server rack status lights — blink animation
    const serverPositions = [
      { x: 1160, y: 80 }, { x: 1160, y: 340 }, { x: 1160, y: 580 },
    ];
    serverPositions.forEach((pos, i) => {
      this.microAnimationSystem.registerObject(
        `server-light-${i}`,
        'server-blink',
        this.add.graphics(),
        pos.x + 74,
        pos.y + 100,
        0.9,
        0.5 + i * 0.2
      );
    });

    // Monitor screens — subtle flicker
    const monitorPositions = [
      { x: 260, y: 210 }, { x: 480, y: 210 }, { x: 700, y: 210 },
      { x: 260, y: 490 }, { x: 480, y: 490 }, { x: 700, y: 490 },
    ];
    monitorPositions.forEach((pos, i) => {
      this.microAnimationSystem.registerObject(
        `monitor-${i}`,
        'monitor-flicker',
        this.add.graphics(),
        pos.x,
        pos.y,
        0.4,
        0.8 + i * 0.1
      );
    });

    // Light sources — breathing animation
    const lightPositions = [
      { x: 600, y: 400 },   // Open office center light
      { x: 1450, y: 1060 }, // Meeting room light
      { x: 1950, y: 400 },  // AI Labs light
    ];
    lightPositions.forEach((pos, i) => {
      this.microAnimationSystem.registerObject(
        `light-${i}`,
        'light-breathe',
        this.add.graphics(),
        pos.x,
        pos.y,
        0.2,
        0.3 + i * 0.1
      );
    });
  }

  // ─────────────────────────────────────────────────────────
  // Floor
  // ─────────────────────────────────────────────────────────
  private drawFloor() {
    const g = this.add.graphics();

    // Checkerboard tiles 80×80
    for (let row = 0; row < H / 80; row++) {
      for (let col = 0; col < W / 80; col++) {
        const color = (row + col) % 2 === 0 ? C.floorTile : C.floorTileAlt;
        g.fillStyle(color, 1);
        g.fillRect(col * 80, row * 80, 80, 80);
      }
    }

    // Subtle grid lines on top
    g.lineStyle(1, C.floorGrid, 0.6);
    for (let x = 0; x <= W; x += 80) {
      g.moveTo(x, 0); g.lineTo(x, H);
    }
    for (let y = 0; y <= H; y += 80) {
      g.moveTo(0, y); g.lineTo(W, y);
    }
    g.strokePath();

    // World border
    g.lineStyle(6, C.wallHighlight, 1);
    g.strokeRect(0, 0, W, H);
  }

  // ─────────────────────────────────────────────────────────
  // Room Dividers  (thick inner walls)
  // ─────────────────────────────────────────────────────────
  private drawRoomDividers() {
    const g = this.add.graphics();
    g.fillStyle(C.wall, 1);

    // Horizontal divider: open office / bottom area (with gap at x=1000–1100)
    g.fillRect(0, 720, 1000, 16);
    g.fillRect(1100, 720, 220, 16);

    // Vertical divider: separates open office from AI Lab (doorway at y=290–410)
    g.fillRect(1100, 0, 16, 290);
    g.fillRect(1100, 410, 16, 760);

    // Meeting room box walls (doorway in top wall at x=1350–1450)
    g.fillRect(1150, 800, 200, 14);   // top wall — left segment
    g.fillRect(1450, 800, 300, 14);   // top wall — right segment
    g.fillRect(1150, 800, 14, 520);   // left wall
    g.fillRect(1150, 1306, 600, 14);  // bottom wall
    g.fillRect(1736, 800, 14, 520);   // right wall

    // Highlights on dividers
    g.fillStyle(C.wallHighlight, 0.5);
    g.fillRect(0, 716, 1000, 4);
    g.fillRect(1100, 716, 220, 4);
    g.fillRect(1100, 0, 6, 290);
    g.fillRect(1100, 410, 6, 760);
  }

  // ─────────────────────────────────────────────────────────
  // Doorways  (floor markers at room entrances)
  // ─────────────────────────────────────────────────────────
  private drawDoorways() {
    const g = this.add.graphics();

    // AI Labs doorway — floor strip at x=1100, y=290–410
    g.fillStyle(C.aiLabAccent, 0.15);
    g.fillRect(1100, 290, 16, 120);
    g.lineStyle(2, C.aiLabAccent, 0.5);
    g.strokeRect(1100, 290, 16, 120);

    // Meeting Room doorway — floor strip at x=1350–1450, y=800
    g.fillStyle(C.carpetMeeting, 0.25);
    g.fillRect(1350, 800, 100, 14);
    g.lineStyle(2, C.carpetBorder, 0.5);
    g.strokeRect(1350, 800, 100, 14);
  }

  // ─────────────────────────────────────────────────────────
  // Open Office Zone  (top-left quadrant)
  // ─────────────────────────────────────────────────────────
  private drawOpenOfficeZone() {
    const g = this.add.graphics();

    // Row 1 desks — three in a row (with desk IDs for variations)
    this.drawDesk(g, 160, 180, 'open-desk-1-1');
    this.drawDesk(g, 380, 180, 'open-desk-1-2');
    this.drawDesk(g, 600, 180, 'open-desk-1-3');

    // Row 2 desks
    this.drawDesk(g, 160, 460, 'open-desk-2-1');
    this.drawDesk(g, 380, 460, 'open-desk-2-2');
    this.drawDesk(g, 600, 460, 'open-desk-2-3');

    // Row 3 desks (below horizontal divider)
    this.drawDesk(g, 160, 800, 'workspace-desk-3-1');
    this.drawDesk(g, 380, 800, 'workspace-desk-3-2');
    this.drawDesk(g, 600, 800, 'workspace-desk-3-3');

    this.drawDesk(g, 160, 1020, 'workspace-desk-4-1');
    this.drawDesk(g, 380, 1020, 'workspace-desk-4-2');
  }

  // ─────────────────────────────────────────────────────────
  // Meeting Room Zone  (right side, enclosed box)
  // ─────────────────────────────────────────────────────────
  private drawMeetingRoomZone() {
    const g = this.add.graphics();

    // Carpet
    g.fillStyle(C.carpetMeeting, 0.5);
    g.fillRect(1164, 814, 572, 492);
    g.lineStyle(3, C.carpetBorder, 0.8);
    g.strokeRect(1164, 814, 572, 492);

    // Big oval-ish table (rounded rect)
    g.fillStyle(C.tableBase, 1);
    g.fillRoundedRect(1290, 900, 360, 220, 30);
    g.fillStyle(C.tableTop, 1);
    g.fillRoundedRect(1296, 906, 348, 208, 26);

    // Table sheen
    g.fillStyle(0xffffff, 0.05);
    g.fillRoundedRect(1300, 910, 160, 60, 20);

    // Chairs around table
    const chairs: [number, number][] = [
      [1360, 868], [1470, 868], [1580, 868],
      [1360, 1130], [1470, 1130], [1580, 1130],
      [1258, 950], [1258, 1060],
      [1668, 950], [1668, 1060],
    ];
    chairs.forEach(([cx, cy]) => this.drawChair(g, cx, cy));

    // Projector screen on left wall of meeting room
    g.fillStyle(0xffffff, 0.08);
    g.fillRect(1170, 850, 80, 50);
    g.lineStyle(2, C.aiLabAccent, 0.4);
    g.strokeRect(1170, 850, 80, 50);
  }

  // ─────────────────────────────────────────────────────────
  // AI Labs Zone  (right column, top) — Premium, not sci-fi
  // ─────────────────────────────────────────────────────────
  private drawAiLabZone() {
    const g = this.add.graphics();

    // Zone floor — subtle cyan tint (not overwhelming)
    g.fillStyle(C.carpetAiLab, 0.6);
    g.fillRect(1116, 0, W - 1116, 780);

    // Subtle accent border
    g.lineStyle(2, C.aiLabAccent, 0.4);
    g.strokeRect(1116, 0, W - 1116, 780);

    // Server rack — left column of zone
    this.drawServerRack(g, 1160, 80);
    this.drawServerRack(g, 1160, 340);
    this.drawServerRack(g, 1160, 580);

    // AI Workstation desks — right side (with variations)
    this.drawAiDesk(g, 1400, 120, 'ai-desk-1');
    this.drawAiDesk(g, 1650, 120, 'ai-desk-2');
    this.drawAiDesk(g, 1400, 460, 'ai-desk-3');
    this.drawAiDesk(g, 1650, 460, 'ai-desk-4');

    // ── Dashboard wall displays (command center style) ──
    this.drawDashboardDisplay(g, 1900, 80, 280, 160);
    this.drawDashboardDisplay(g, 1900, 300, 280, 120);
    this.drawDashboardDisplay(g, 1900, 480, 280, 100);

    // ── Terminal-style monitors on wall (clean, real-looking UI) ──
    this.drawTerminalMonitor(g, 1300, 20, 160, 100);
    this.drawTerminalMonitor(g, 1300, 140, 160, 100);

    // ── Normal office elements (grounding) ──
    // Regular desk with plant (not sci-fi)
    this.drawDesk(g, 1900, 620, 'ai-desk-5');
    // Small plant near entrance
    this.drawSmallPlant(g, 1140, 700);
  }

  // ── Dashboard display (command center style) ──
  private drawDashboardDisplay(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    // Monitor frame
    g.fillStyle(0x09090b, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    g.lineStyle(1, C.aiLabAccent, 0.3);
    g.strokeRoundedRect(x, y, w, h, 4);

    // Screen content — subtle data visualization
    g.fillStyle(0x0d1f38, 1);
    g.fillRect(x + 6, y + 6, w - 12, h - 12);

    // Fake chart bars (dashboard feel)
    const barCount = 6;
    const barWidth = (w - 24) / barCount - 2;
    for (let i = 0; i < barCount; i++) {
      const barHeight = 10 + Math.sin(i * 1.2) * 15 + 15;
      const barX = x + 12 + i * (barWidth + 2);
      const barY = y + h - 16 - barHeight;
      g.fillStyle(C.aiLabAccent, 0.4);
      g.fillRect(barX, barY, barWidth, barHeight);
    }

    // Status indicator (green dot)
    g.fillStyle(0x22c55e, 0.8);
    g.fillCircle(x + w - 14, y + 14, 4);
  }

  // ── Terminal monitor (clean code editor style) ──
  private drawTerminalMonitor(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    // Monitor frame
    g.fillStyle(0x09090b, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    g.lineStyle(1, C.aiLabAccent, 0.2);
    g.strokeRoundedRect(x, y, w, h, 4);

    // Terminal screen
    g.fillStyle(0x0a0a0a, 1);
    g.fillRect(x + 4, y + 4, w - 8, h - 8);

    // Fake code lines (terminal feel)
    const lineY = y + 16;
    for (let i = 0; i < 5; i++) {
      const lineWidth = 30 + Math.sin(i * 2) * 20 + 20;
      g.fillStyle(C.aiLabAccent, 0.3);
      g.fillRect(x + 12, lineY + i * 14, lineWidth, 6);
    }

    // Cursor blink indicator
    g.fillStyle(C.aiLabAccent, 0.6);
    g.fillRect(x + 12, lineY + 5 * 14, 8, 8);
  }

  // ── Small plant (normal office element) ──
  private drawSmallPlant(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    // Pot
    g.fillStyle(0x27272a, 1);
    g.fillEllipse(x, y + 10, 20, 14);
    // Leaves
    g.fillStyle(0x3f3f46, 1);
    g.fillCircle(x, y, 10);
    g.fillCircle(x + 6, y - 6, 8);
    g.fillCircle(x - 6, y - 6, 8);
    g.fillStyle(0x52525b, 1);
    g.fillCircle(x, y - 3, 6);
  }

  // ─────────────────────────────────────────────────────────
  // Furniture helpers (with variation system)
  // ─────────────────────────────────────────────────────────
  private drawDesk(g: Phaser.GameObjects.Graphics, x: number, y: number, deskId?: string) {
    const W = 200, H = 90;
    const variation = deskId ? getDeskVariation(deskId) : { monitors: 1, clutter: 'none' as const, chair: 'pushed-in' as const };

    // Shadow
    g.fillStyle(0x000000, 0.25);
    g.fillRect(x + 6, y + 6, W, H);

    // Desk body
    g.fillStyle(C.deskBase, 1);
    g.fillRect(x, y, W, H);
    g.fillStyle(C.deskTop, 1);
    g.fillRect(x + 4, y + 4, W - 8, H - 8);
    g.fillStyle(C.deskSurface, 1);
    g.fillRect(x + 8, y + 8, W - 16, 24);

    // Monitors based on variation
    if (variation.monitors === 0) {
      // No monitor — empty desk
    } else if (variation.monitors === 1) {
      // Single monitor (center)
      g.fillStyle(C.monitorFrame, 1);
      g.fillRect(x + W / 2 - 26, y + 10, 52, 34);
      g.fillStyle(C.monitorScreen, 1);
      g.fillRect(x + W / 2 - 22, y + 13, 44, 26);
      g.fillStyle(C.monitorGlow, 0.4);
      g.fillRect(x + W / 2 - 22, y + 13, 44, 6);
    } else {
      // Dual monitors
      g.fillStyle(C.monitorFrame, 1);
      g.fillRect(x + 14, y + 10, 52, 34);
      g.fillRect(x + W - 66, y + 10, 52, 34);
      g.fillStyle(C.monitorScreen, 1);
      g.fillRect(x + 17, y + 13, 46, 26);
      g.fillRect(x + W - 63, y + 13, 46, 26);
      g.fillStyle(C.monitorGlow, 0.4);
      g.fillRect(x + 17, y + 13, 46, 6);
      g.fillRect(x + W - 63, y + 13, 46, 6);
    }

    // Clutter based on variation
    if (variation.clutter !== 'none') {
      const clutterColor = ClutterColors[variation.clutter];
      const clutterX = x + W - 30;
      const clutterY = y + 14;
      g.fillStyle(clutterColor, 0.9);
      g.fillRoundedRect(clutterX, clutterY, 16, 12, 2);
    }

    // Chair (below desk) — position varies by chair state
    const chairOffsetY = variation.chair === 'pulled-out' ? 32 : 24;
    this.drawChair(g, x + W / 2, y + H + chairOffsetY);
  }

  private drawAiDesk(g: Phaser.GameObjects.Graphics, x: number, y: number, deskId?: string) {
    const W = 180, H = 90;
    const variation = deskId ? getDeskVariation(deskId) : { monitors: 2, clutter: 'none' as const, chair: 'pushed-in' as const };

    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRect(x + 6, y + 6, W, H);

    // Desk body — subtle cyan tint (restrained)
    g.fillStyle(0x0a1628, 1);
    g.fillRect(x, y, W, H);
    g.fillStyle(0x0d1f38, 1);
    g.fillRect(x + 4, y + 4, W - 8, H - 8);

    // Subtle accent strip (not glowing)
    g.fillStyle(C.aiLabAccent, 0.3);
    g.fillRect(x + 8, y + 8, W - 16, 3);

    // Monitors based on variation
    if (variation.monitors === 0) {
      // No monitor — empty desk
    } else if (variation.monitors === 1) {
      // Single monitor (center)
      g.fillStyle(C.monitorFrame, 1);
      g.fillRect(x + W / 2 - 26, y + 14, 52, 38);
      g.fillStyle(C.monitorScreen, 1);
      g.fillRect(x + W / 2 - 22, y + 17, 44, 30);
      g.fillStyle(C.aiLabGlow, 0.3);
      g.fillRect(x + W / 2 - 22, y + 17, 44, 6);
    } else {
      // Dual monitors
      g.fillStyle(C.monitorFrame, 1);
      g.fillRect(x + 14, y + 14, 60, 38);
      g.fillRect(x + W - 74, y + 14, 60, 38);
      g.fillStyle(C.monitorScreen, 1);
      g.fillRect(x + 17, y + 17, 54, 30);
      g.fillRect(x + W - 71, y + 17, 54, 30);
      g.fillStyle(C.aiLabGlow, 0.3);
      g.fillRect(x + 17, y + 17, 54, 6);
      g.fillRect(x + W - 71, y + 17, 54, 6);
    }

    // Clutter based on variation
    if (variation.clutter !== 'none') {
      const clutterColor = ClutterColors[variation.clutter];
      const clutterX = x + W - 28;
      const clutterY = y + 16;
      g.fillStyle(clutterColor, 0.8);
      g.fillRoundedRect(clutterX, clutterY, 14, 10, 2);
    }

    // Chair (below desk) — position varies by chair state
    const chairOffsetY = variation.chair === 'pulled-out' ? 30 : 22;
    g.fillStyle(0x0f1f35, 1);
    g.fillCircle(x + W / 2, y + H + chairOffsetY, 18);
    g.fillStyle(C.aiLabAccent, 0.3);
    g.fillCircle(x + W / 2, y + H + chairOffsetY, 9);
  }

  private drawChair(g: Phaser.GameObjects.Graphics, cx: number, cy: number) {
    g.fillStyle(C.chairBody, 1);
    g.fillCircle(cx, cy, 18);
    g.fillStyle(C.chairBack, 1);
    g.fillCircle(cx, cy, 10);
    g.lineStyle(1, C.wallHighlight, 0.3);
    g.strokeCircle(cx, cy, 18);
  }

  private drawServerRack(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    const rW = 90, rH = 200;

    g.fillStyle(C.aiServer, 1);
    g.fillRoundedRect(x, y, rW, rH, 6);
    g.lineStyle(2, C.aiLabAccent, 0.5);
    g.strokeRoundedRect(x, y, rW, rH, 6);

    // Server unit slots
    for (let i = 0; i < 7; i++) {
      const slotY = y + 12 + i * 26;
      g.fillStyle(0x0a1628, 1);
      g.fillRect(x + 8, slotY, rW - 16, 18);
      // Status light
      const lightColors = [C.aiServerLight, C.aiLabAccent, 0x22c55e, C.aiServerLight, C.aiLabAccent, 0x22c55e, C.aiLabAccent];
      g.fillStyle(lightColors[i % lightColors.length]!, 0.9);
      g.fillCircle(x + rW - 16, slotY + 9, 4);
    }
  }

  // ─────────────────────────────────────────────────────────
  // Decorative Plants
  // ─────────────────────────────────────────────────────────
  private drawPlants() {
    const g = this.add.graphics();
    const spots: [number, number][] = [
      [60, 60], [W - 60, 60],
      [60, H - 60], [W - 60, H - 60],
      [1050, 60], [1050, 660],
      [60, 700], [900, 700],
    ];
    spots.forEach(([px, py]) => {
      // Pot
      g.fillStyle(C.potClay, 1);
      g.fillEllipse(px, py + 14, 32, 22);
      // Leaves
      g.fillStyle(C.leafDark, 1);
      g.fillCircle(px, py, 16);
      g.fillCircle(px + 10, py - 8, 12);
      g.fillCircle(px - 10, py - 8, 12);
      g.fillStyle(C.leafLight, 1);
      g.fillCircle(px, py - 4, 10);
      g.fillCircle(px + 10, py - 10, 8);
      g.fillCircle(px - 10, py - 10, 8);
    });
  }

  // ─────────────────────────────────────────────────────────
  // Zone Labels (rendered in world space, using room accent colors)
  // ─────────────────────────────────────────────────────────
  private drawRoomLabels() {
    const labelStyle = {
      fontSize: '18px',
      fontFamily: '"Inter", sans-serif',
      color: '#ffffff',
      alpha: 0.5,
      padding: { x: 10, y: 6 },
    };

    // Use accent colors from room tokens
    this.add.text(50, 30, '🖥  Open Office', { ...labelStyle, color: RoomTokens.open_office.labelColor }).setAlpha(0.7).setDepth(2);
    this.add.text(50, 760, '📋  Workspace', { ...labelStyle, color: RoomTokens.workspace.labelColor }).setAlpha(0.7).setDepth(2);
    this.add.text(1170, 820, '🤝  Meeting Room', { ...labelStyle, color: RoomTokens.meeting.labelColor }).setAlpha(0.8).setDepth(2);
    this.add.text(1130, 20, '🧠  AI Labs', { ...labelStyle, color: RoomTokens.ai_labs.labelColor }).setAlpha(0.9).setDepth(2);
  }

  // ─────────────────────────────────────────────────────────
  // Room Lighting Overlays (subtle accent-tinted rectangles)
  // ─────────────────────────────────────────────────────────
  private drawRoomLightingOverlays() {
    // Meeting room — violet accent overlay
    const meetingToken = RoomTokens.meeting;
    const meetingLight = LightProfiles[meetingToken.lightProfile];
    const meetingOverlay = this.add.rectangle(
      1450, 1060, 572, 492,
      meetingToken.accent, meetingLight.ambientAlpha
    );
    meetingOverlay.setDepth(1);

    // AI Labs — cyan accent overlay
    const aiToken = RoomTokens.ai_labs;
    const aiLight = LightProfiles[aiToken.lightProfile];
    const aiOverlay = this.add.rectangle(
      (1116 + W) / 2, 390, W - 1116, 780,
      aiToken.accent, aiLight.ambientAlpha
    );
    aiOverlay.setDepth(1);

    // Subtle accent border highlights on meeting room
    const meetingBorder = this.add.graphics();
    meetingBorder.lineStyle(2, meetingToken.accent, 0.3);
    meetingBorder.strokeRect(1150, 800, 600, 520);
    meetingBorder.setDepth(1);

    // Subtle accent border on AI Labs
    const aiBorder = this.add.graphics();
    aiBorder.lineStyle(2, aiToken.accent, 0.4);
    aiBorder.strokeRect(1116, 0, W - 1116, 780);
    aiBorder.setDepth(1);
  }

  // ─────────────────────────────────────────────────────────
  // Collision Layers (invisible physics bodies)
  // ─────────────────────────────────────────────────────────
  private createCollisionLayers() {
    // Structural layer (walls, dividers)
    this.structuralLayer = this.physics.add.staticGroup();
    StructuralCollisions.forEach(wall => {
      const rect = this.add.rectangle(
        wall.x + wall.width / 2,
        wall.y + wall.height / 2,
        wall.width,
        wall.height
      );
      rect.setVisible(false);
      this.structuralLayer.add(rect);
    });

    // Furniture layer (desks, tables, server racks)
    this.furnitureLayer = this.physics.add.staticGroup();
    FurnitureCollisions.forEach(furniture => {
      const rect = this.add.rectangle(
        furniture.x + furniture.width / 2,
        furniture.y + furniture.height / 2,
        furniture.width,
        furniture.height
      );
      rect.setVisible(false);
      this.furnitureLayer.add(rect);
    });

    // Register colliders — player collides with walls and furniture
    this.physics.add.collider(
      this.localPlayer.getContainer(),
      this.structuralLayer
    );
    this.physics.add.collider(
      this.localPlayer.getContainer(),
      this.furnitureLayer
    );
  }
}
