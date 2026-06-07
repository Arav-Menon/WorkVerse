import Phaser from 'phaser';
import { WorldConfig } from '../config/world.config';
import { Player } from '../entities/Player';
import { RemotePlayer } from '../entities/RemotePlayer';
import { MovementSystem } from '../systems/MovementSystem';
import { CameraSystem } from '../systems/CameraSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ProximitySystem } from '../systems/ProximitySystem';

const C = WorldConfig.colors;
const { width: W, height: H } = WorldConfig.bounds;

export class ArenaScene extends Phaser.Scene {
  private localPlayer!: Player;
  private remotePlayers: Map<string, RemotePlayer> = new Map();

  private movementSystem!: MovementSystem;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private proximitySystem!: ProximitySystem;

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
    this.drawOpenOfficeZone();
    this.drawMeetingRoomZone();
    this.drawAiLabZone();
    this.drawPlants();
    this.drawRoomLabels();

    // Local Player — spawn at open office center
    this.localPlayer = new Player(this, 'local-1', 'Arav', 700, 600);

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
    this.cameraSystem.startFollowing(this.localPlayer);
  }

  update(_time: number, delta: number) {
    this.movementSystem.update(this.localPlayer, delta);
    this.collisionSystem.update(this.localPlayer);
    this.proximitySystem.update(this.localPlayer, this.remotePlayers);
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

    // Horizontal divider: open office / bottom area
    g.fillRect(0, 720, W * 0.55, 16);

    // Vertical divider: separates open office from AI Lab
    g.fillRect(1100, 0, 16, H * 0.65);

    // Meeting room box walls
    g.fillRect(1150, 800, 600, 14);   // top wall
    g.fillRect(1150, 800, 14, 520);   // left wall
    g.fillRect(1150, 1306, 600, 14);  // bottom wall
    g.fillRect(1736, 800, 14, 520);   // right wall

    // Highlights on dividers
    g.fillStyle(C.wallHighlight, 0.5);
    g.fillRect(0, 716, W * 0.55, 4);
    g.fillRect(1100, 0, 6, H * 0.65);
  }

  // ─────────────────────────────────────────────────────────
  // Open Office Zone  (top-left quadrant)
  // ─────────────────────────────────────────────────────────
  private drawOpenOfficeZone() {
    const g = this.add.graphics();

    // Row 1 desks — three in a row
    this.drawDesk(g, 160, 180);
    this.drawDesk(g, 380, 180);
    this.drawDesk(g, 600, 180);

    // Row 2 desks
    this.drawDesk(g, 160, 460);
    this.drawDesk(g, 380, 460);
    this.drawDesk(g, 600, 460);

    // Row 3 desks (below horizontal divider)
    this.drawDesk(g, 160, 800);
    this.drawDesk(g, 380, 800);
    this.drawDesk(g, 600, 800);

    this.drawDesk(g, 160, 1020);
    this.drawDesk(g, 380, 1020);
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
  // AI Labs Zone  (right column, top)
  // ─────────────────────────────────────────────────────────
  private drawAiLabZone() {
    const g = this.add.graphics();

    // Zone floor — distinct cyan-tint carpet
    g.fillStyle(C.carpetAiLab, 0.8);
    g.fillRect(1116, 0, W - 1116, 780);

    // Pulsing accent border
    g.lineStyle(3, C.aiLabAccent, 0.7);
    g.strokeRect(1116, 0, W - 1116, 780);

    // Inner glow effect (nested rect)
    g.lineStyle(1, C.aiLabGlow, 0.3);
    g.strokeRect(1122, 6, W - 1122 - 6, 768);

    // Server rack — left column of zone
    this.drawServerRack(g, 1160, 80);
    this.drawServerRack(g, 1160, 340);
    this.drawServerRack(g, 1160, 580);

    // AI Workstation desks — right side
    this.drawAiDesk(g, 1400, 120);
    this.drawAiDesk(g, 1650, 120);
    this.drawAiDesk(g, 1400, 460);
    this.drawAiDesk(g, 1650, 460);

    // Holographic "brain" decoration — center circle motif
    g.lineStyle(2, C.aiLabAccent, 0.25);
    g.strokeCircle(1950, 600, 80);
    g.lineStyle(1, C.aiLabGlow, 0.15);
    g.strokeCircle(1950, 600, 60);
    g.strokeCircle(1950, 600, 40);

    // Neural net dots
    const dotPositions = [
      [1910, 570], [1950, 540], [1990, 570],
      [1880, 610], [1950, 600], [2020, 610],
      [1910, 640], [1950, 660], [1990, 640],
    ] as [number, number][];
    g.fillStyle(C.aiLabAccent, 0.8);
    dotPositions.forEach(([dx, dy]) => g.fillCircle(dx, dy, 4));

    // Lines between dots
    g.lineStyle(1, C.aiLabAccent, 0.2);
    const edges = [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [0, 4], [1, 4], [2, 4], [3, 4], [4, 5], [4, 6], [4, 7], [4, 8]];
    edges.forEach(([a, b]) => {
      g.moveTo(dotPositions[a][0], dotPositions[a][1]);
      g.lineTo(dotPositions[b][0], dotPositions[b][1]);
    });
    g.strokePath();
  }

  // ─────────────────────────────────────────────────────────
  // Furniture helpers
  // ─────────────────────────────────────────────────────────
  private drawDesk(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    const W = 200, H = 90;

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

    // Monitor
    g.fillStyle(C.monitorFrame, 1);
    g.fillRect(x + W / 2 - 26, y + 10, 52, 34);
    g.fillStyle(C.monitorScreen, 1);
    g.fillRect(x + W / 2 - 22, y + 13, 44, 26);
    // Screen glow top stripe
    g.fillStyle(C.monitorGlow, 0.4);
    g.fillRect(x + W / 2 - 22, y + 13, 44, 6);

    // Chair (below desk)
    this.drawChair(g, x + W / 2, y + H + 24);
  }

  private drawAiDesk(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    const W = 180, H = 90;

    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillRect(x + 6, y + 6, W, H);

    // Desk body — cyan-tinted for AI zone
    g.fillStyle(0x0a1628, 1);
    g.fillRect(x, y, W, H);
    g.fillStyle(0x0d1f38, 1);
    g.fillRect(x + 4, y + 4, W - 8, H - 8);

    // Glowing strip along desk top
    g.fillStyle(C.aiLabAccent, 0.5);
    g.fillRect(x + 8, y + 8, W - 16, 4);

    // Dual monitors
    g.fillStyle(C.monitorFrame, 1);
    g.fillRect(x + 14, y + 14, 60, 38);
    g.fillRect(x + W - 74, y + 14, 60, 38);
    g.fillStyle(C.monitorScreen, 1);
    g.fillRect(x + 17, y + 17, 54, 30);
    g.fillRect(x + W - 71, y + 17, 54, 30);
    g.fillStyle(C.aiLabGlow, 0.35);
    g.fillRect(x + 17, y + 17, 54, 8);
    g.fillRect(x + W - 71, y + 17, 54, 8);

    // Chair
    g.fillStyle(0x0f1f35, 1);
    g.fillCircle(x + W / 2, y + H + 22, 20);
    g.fillStyle(C.aiLabAccent, 0.4);
    g.fillCircle(x + W / 2, y + H + 22, 10);
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
      g.fillStyle(lightColors[i % lightColors.length], 0.9);
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
  // Zone Labels (rendered in world space)
  // ─────────────────────────────────────────────────────────
  private drawRoomLabels() {
    const labelStyle = {
      fontSize: '18px',
      fontFamily: '"Inter", sans-serif',
      color: '#ffffff',
      alpha: 0.5,
      padding: { x: 10, y: 6 },
    };

    this.add.text(50, 30, '🖥  Open Office', { ...labelStyle, color: '#94a3b8' }).setAlpha(0.7).setDepth(2);
    this.add.text(50, 760, '📋  Workspace', { ...labelStyle, color: '#94a3b8' }).setAlpha(0.7).setDepth(2);
    this.add.text(1170, 820, '🤝  Meeting Room', { ...labelStyle, color: '#a5b4fc' }).setAlpha(0.8).setDepth(2);
    this.add.text(1130, 20, '🧠  AI Labs', { ...labelStyle, color: '#38bdf8' }).setAlpha(0.9).setDepth(2);
  }
}
