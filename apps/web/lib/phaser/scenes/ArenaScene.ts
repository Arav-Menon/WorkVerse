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
import type { SpaceUser } from '../types/arena.types';
import type { SpaceClient } from '../../ws/space-client';

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
  private localUserId: string = '';
  private spaceClient: SpaceClient | null = null;
  private lastSentPosition = { x: 0, y: 0 };

  constructor() {
    super({ key: 'ArenaScene' });
  }

  init(data: { spaceId: string; localUserId: string; spaceClient?: SpaceClient }) {
    this.spaceId = data.spaceId;
    this.localUserId = data.localUserId;
    this.spaceClient = data.spaceClient || null;
  }

  preload() { /* Shapes-only MVP — no external assets needed */ }

  create() {
    this.cameras.main.setBackgroundColor(C.background);
    this.physics.world.setBounds(0, 0, W, H);

    this.drawFloor();
    this.drawFloorTints();
    this.drawRoomDividers();
    this.drawDoorways();
    this.drawOpenOfficeZone();
    this.drawMeetingRoomZone();
    this.drawAiLabZone();
    this.drawPlants();
    this.drawRoomLabels();
    this.drawRoomLightingOverlays();

    // Local Player — MUST be created before collision layers
    this.localPlayer = new Player(this, this.localUserId, 'You', 700, 600);

    // Collision layers (invisible physics bodies) — requires localPlayer
    this.createCollisionLayers();

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

    // Broadcast local player position to server (throttled)
    this.broadcastPosition();
  }

  // ─────────────────────────────────────────────────────────
  // WebSocket event handlers (called from ArenaCanvas)
  // ─────────────────────────────────────────────────────────

  handleSpaceState(users: SpaceUser[]) {
    // Clear existing remote players
    this.remotePlayers.forEach((rp) => rp.destroy());
    this.remotePlayers.clear();

    for (const user of users) {
      if (user.userId === this.localUserId) {
        // Set local player position from server state
        this.localPlayer.getContainer().setPosition(user.position.x, user.position.y);
        continue;
      }
      this.addRemotePlayer(user);
    }
    console.log(`[Arena] Space state synced: ${this.remotePlayers.size} remote players`);
  }

  handleUserJoined(user: SpaceUser) {
    if (user.userId === this.localUserId) return;
    if (this.remotePlayers.has(user.userId)) return;

    this.addRemotePlayer(user);
    console.log(`[Arena] ${user.username} joined`);
  }

  handleUserLeft(userId: string) {
    const remote = this.remotePlayers.get(userId);
    if (remote) {
      remote.destroy();
      this.remotePlayers.delete(userId);
      console.log(`[Arena] User ${userId} removed`);
    }
  }

  handlePlayerMoved(userId: string, position: { x: number; y: number }) {
    if (userId === this.localUserId) return;

    const remote = this.remotePlayers.get(userId);
    if (remote) {
      console.log(`[AVATAR UPDATE] userId=${userId} x=${position.x} y=${position.y}`);
      remote.updatePosition(position.x, position.y);
    } else {
      console.log(`[AVATAR UPDATE] No remote player found for userId=${userId}`);
    }
  }

  private addRemotePlayer(user: SpaceUser) {
    const rp = new RemotePlayer(
      this,
      user.userId,
      user.username,
      user.position.x,
      user.position.y,
      user.color,
    );
    this.remotePlayers.set(user.userId, rp);
  }

  private broadcastPosition() {
    if (!this.spaceClient?.isConnected) return;

    const container = this.localPlayer.getContainer();
    const x = Math.round(container.x);
    const y = Math.round(container.y);

    // Only send if position changed meaningfully
    const dx = Math.abs(x - this.lastSentPosition.x);
    const dy = Math.abs(y - this.lastSentPosition.y);
    if (dx < 2 && dy < 2) return;

    this.lastSentPosition = { x, y };
    this.spaceClient.move(x, y);
  }

  private registerDesksForOccupancy() {
    // Pod A — Engineering cluster
    this.occupancySystem.registerDesk('desk-1', 180, 200, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-2', 400, 180, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-3', 380, 350, 200, 90, this.add.graphics());
    // Pod B — Design cluster
    this.occupancySystem.registerDesk('desk-4', 180, 450, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-5', 400, 470, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-6', 220, 610, 200, 90, this.add.graphics());
    // Workspace Pod C
    this.occupancySystem.registerDesk('desk-7', 180, 830, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-8', 400, 810, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-9', 280, 970, 200, 90, this.add.graphics());
    // Workspace Pod D
    this.occupancySystem.registerDesk('desk-10', 160, 1100, 200, 90, this.add.graphics());
    this.occupancySystem.registerDesk('desk-11', 400, 1080, 200, 90, this.add.graphics());
    // AI Labs
    this.occupancySystem.registerDesk('ai-desk-1', 1400, 120, 180, 90, this.add.graphics());
    this.occupancySystem.registerDesk('ai-desk-2', 1650, 120, 180, 90, this.add.graphics());
    this.occupancySystem.registerDesk('ai-desk-3', 1400, 460, 180, 90, this.add.graphics());
    this.occupancySystem.registerDesk('ai-desk-4', 1650, 460, 180, 90, this.add.graphics());
  }

  private registerAnimatedObjects() {
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

    const monitorPositions = [
      { x: 280, y: 225 }, { x: 500, y: 205 }, { x: 480, y: 375 },
      { x: 280, y: 475 }, { x: 500, y: 495 }, { x: 320, y: 635 },
      { x: 280, y: 855 }, { x: 500, y: 835 }, { x: 380, y: 995 },
      { x: 260, y: 1125 }, { x: 500, y: 1105 },
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

    const lightPositions = [
      { x: 600, y: 400 },
      { x: 1450, y: 1060 },
      { x: 1950, y: 400 },
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
    g.fillStyle(C.background, 1);
    g.fillRect(0, 0, W, H);

    g.fillStyle(0xe0d8d0, 0.5);
    for (let i = 0; i < 40; i++) {
      const rx = (i * 137 + 29) % W;
      const ry = (i * 211 + 53) % H;
      const rw = 200 + (i * 73) % 300;
      const rh = 200 + (i * 41) % 300;
      g.fillRect(rx, ry, rw, rh);
    }

    g.lineStyle(1, C.wallHighlight, 0.3);
    g.strokeRect(0, 0, W, H);
  }

  // ─────────────────────────────────────────────────────────
  // Floor Tints  (subtle zone differentiation)
  // ─────────────────────────────────────────────────────────
  private drawFloorTints() {
    const g = this.add.graphics();

    g.fillStyle(RoomTokens.open_office.floorTint, 0.3);
    g.fillRect(0, 0, 800, 720);

    g.fillStyle(RoomTokens.workspace.floorTint, 0.25);
    g.fillRect(0, 720, 800, 1080);

    g.fillStyle(RoomTokens.ai_labs.floorTint, 0.4);
    g.fillRect(1116, 0, W - 1116, 780);

    g.fillStyle(RoomTokens.meeting.floorTint, 0.3);
    g.fillRect(1150, 800, 600, 520);

    g.fillStyle(0xd8d0c8, 0.2);
    g.fillRect(800, 718, 400, 16);
  }

  // ─────────────────────────────────────────────────────────
  // Room Dividers  (thick inner walls)
  // ─────────────────────────────────────────────────────────
  private drawRoomDividers() {
    const g = this.add.graphics();

    g.fillStyle(C.wall, 1);
    g.fillRect(0, 720, 800, 12);
    g.fillRect(1200, 720, 120, 12);
    g.fillStyle(C.wallHighlight, 0.4);
    g.fillRect(0, 717, 800, 2);
    g.fillRect(1200, 717, 120, 2);

    g.fillStyle(C.wall, 1);
    g.fillRect(1100, 0, 8, 290);
    g.fillRect(1100, 410, 8, 760);
    g.fillStyle(0xa07050, 0.06);
    g.fillRect(1108, 0, 6, 290);
    g.fillRect(1108, 410, 6, 760);
    g.lineStyle(1, 0xa07050, 0.25);
    g.beginPath(); g.moveTo(1114, 0); g.lineTo(1114, 290); g.strokePath();
    g.beginPath(); g.moveTo(1114, 410); g.lineTo(1114, 1170); g.strokePath();

    const meetFrame = C.wall;
    const meetGlass = 0x9070b0;
    const meetW = 8;

    g.fillStyle(meetFrame, 1);
    g.fillRect(1150, 800, 200, meetW);
    g.fillRect(1450, 800, 300, meetW);
    g.fillStyle(meetGlass, 0.06);
    g.fillRect(1150, 808, 200, 4);
    g.fillRect(1450, 808, 300, 4);
    g.lineStyle(1, meetGlass, 0.2);
    g.beginPath(); g.moveTo(1150, 812); g.lineTo(1350, 812); g.strokePath();
    g.beginPath(); g.moveTo(1450, 812); g.lineTo(1750, 812); g.strokePath();

    g.fillStyle(meetFrame, 1);
    g.fillRect(1150, 800, meetW, 520);
    g.fillStyle(meetGlass, 0.06);
    g.fillRect(1158, 800, 4, 520);
    g.lineStyle(1, meetGlass, 0.2);
    g.beginPath(); g.moveTo(1162, 800); g.lineTo(1162, 1320); g.strokePath();

    g.fillStyle(meetFrame, 1);
    g.fillRect(1150, 1306, 600, meetW);
    g.fillStyle(meetGlass, 0.06);
    g.fillRect(1150, 1314, 600, 4);
    g.lineStyle(1, meetGlass, 0.2);
    g.beginPath(); g.moveTo(1150, 1318); g.lineTo(1750, 1318); g.strokePath();

    g.fillStyle(meetFrame, 1);
    g.fillRect(1736, 800, meetW, 520);
    g.fillStyle(meetGlass, 0.06);
    g.fillRect(1744, 800, 4, 520);
    g.lineStyle(1, meetGlass, 0.2);
    g.beginPath(); g.moveTo(1748, 800); g.lineTo(1748, 1320); g.strokePath();
  }

  // ─────────────────────────────────────────────────────────
  // Doorways  (floor markers at room entrances)
  // ─────────────────────────────────────────────────────────
  private drawDoorways() {
    const g = this.add.graphics();

    g.fillStyle(C.wallHighlight, 0.15);
    g.fillRect(800, 718, 400, 16);
    g.lineStyle(1, C.wallHighlight, 0.25);
    g.strokeRect(800, 718, 400, 16);

    g.fillStyle(0xa07050, 0.1);
    g.fillRect(1100, 290, 14, 120);
    g.lineStyle(1, 0xa07050, 0.35);
    g.strokeRect(1100, 290, 14, 120);

    g.fillStyle(0x9070b0, 0.1);
    g.fillRect(1350, 800, 100, 12);
    g.lineStyle(1, 0x9070b0, 0.35);
    g.strokeRect(1350, 800, 100, 12);
  }

  // ─────────────────────────────────────────────────────────
  // Open Office Zone  (top-left quadrant)
  // ─────────────────────────────────────────────────────────
  private drawOpenOfficeZone() {
    const g = this.add.graphics();

    this.drawDesk(g, 180, 200, 'open-desk-1-1');
    this.drawDesk(g, 400, 180, 'open-desk-1-2');
    this.drawDesk(g, 380, 350, 'open-desk-1-3');

    this.drawDesk(g, 180, 450, 'open-desk-2-1');
    this.drawDesk(g, 400, 470, 'open-desk-2-2');
    this.drawDesk(g, 220, 610, 'open-desk-2-3');

    this.drawDesk(g, 180, 830, 'workspace-desk-3-1');
    this.drawDesk(g, 400, 810, 'workspace-desk-3-2');
    this.drawDesk(g, 280, 970, 'workspace-desk-3-3');

    this.drawDesk(g, 160, 1100, 'workspace-desk-4-1');
    this.drawDesk(g, 400, 1080, 'workspace-desk-4-2');
  }

  // ─────────────────────────────────────────────────────────
  // Meeting Room Zone  (right side, enclosed box)
  // ─────────────────────────────────────────────────────────
  private drawMeetingRoomZone() {
    const g = this.add.graphics();

    g.fillStyle(C.carpetMeeting, 0.5);
    g.fillRect(1164, 814, 572, 492);
    g.lineStyle(3, C.carpetBorder, 0.8);
    g.strokeRect(1164, 814, 572, 492);

    g.fillStyle(0x8a8078, 0.18);
    g.fillRoundedRect(1294, 904, 360, 220, 30);
    g.fillStyle(C.tableBase, 1);
    g.fillRoundedRect(1290, 900, 360, 220, 30);
    g.fillStyle(C.tableTop, 1);
    g.fillRoundedRect(1296, 906, 348, 208, 26);

    g.fillStyle(0xffffff, 0.05);
    g.fillRoundedRect(1300, 910, 160, 60, 20);

    const chairs: [number, number][] = [
      [1360, 868], [1470, 868], [1580, 868],
      [1360, 1130], [1470, 1130], [1580, 1130],
      [1258, 950], [1258, 1060],
      [1668, 950], [1668, 1060],
    ];
    chairs.forEach(([cx, cy]) => this.drawChair(g, cx, cy));

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

    g.fillStyle(C.carpetAiLab, 0.6);
    g.fillRect(1116, 0, W - 1116, 780);

    g.lineStyle(2, C.aiLabAccent, 0.4);
    g.strokeRect(1116, 0, W - 1116, 780);

    this.drawServerRack(g, 1160, 80);
    this.drawServerRack(g, 1160, 340);
    this.drawServerRack(g, 1160, 580);

    this.drawAiDesk(g, 1400, 120, 'ai-desk-1');
    this.drawAiDesk(g, 1650, 120, 'ai-desk-2');
    this.drawAiDesk(g, 1400, 460, 'ai-desk-3');
    this.drawAiDesk(g, 1650, 460, 'ai-desk-4');

    this.drawDashboardDisplay(g, 1900, 80, 280, 160);
    this.drawDashboardDisplay(g, 1900, 300, 280, 120);
    this.drawDashboardDisplay(g, 1900, 480, 280, 100);

    this.drawTerminalMonitor(g, 1300, 20, 160, 100);
    this.drawTerminalMonitor(g, 1300, 140, 160, 100);

    this.drawDesk(g, 1900, 620, 'ai-desk-5');
    this.drawSmallPlant(g, 1140, 700);

    this.drawCommandHub(g, 1600, 350);
  }

  private drawCommandHub(g: Phaser.GameObjects.Graphics, cx: number, cy: number) {
    g.fillStyle(0xa07050, 0.04);
    g.fillCircle(cx, cy, 80);
    g.fillStyle(0xa07050, 0.06);
    g.fillCircle(cx, cy, 60);

    g.fillStyle(0xc0b8b0, 1);
    g.fillCircle(cx, cy, 48);
    g.lineStyle(2, 0xa07050, 0.35);
    g.strokeCircle(cx, cy, 48);

    g.lineStyle(1, 0xa07050, 0.2);
    g.strokeCircle(cx, cy, 32);

    g.fillStyle(0xa07050, 0.5);
    g.fillCircle(cx, cy, 8);
    g.lineStyle(1, 0xa07050, 0.3);
    const angles = [0, 60, 120, 180, 240, 300];
    angles.forEach(deg => {
      const rad = (deg * Math.PI) / 180;
      const nx = cx + Math.cos(rad) * 22;
      const ny = cy + Math.sin(rad) * 22;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(nx, ny); g.strokePath();
      g.fillStyle(0xa07050, 0.4);
      g.fillCircle(nx, ny, 4);
    });
  }

  private drawDashboardDisplay(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    g.fillStyle(0x8a8078, 0.15);
    g.fillRoundedRect(x + 3, y + 3, w, h, 4);
    g.fillStyle(0x2a2520, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    g.lineStyle(1, C.aiLabAccent, 0.3);
    g.strokeRoundedRect(x, y, w, h, 4);

    g.fillStyle(0xc0b8b0, 1);
    g.fillRect(x + 6, y + 6, w - 12, h - 12);

    const barCount = 6;
    const barWidth = (w - 24) / barCount - 2;
    for (let i = 0; i < barCount; i++) {
      const barHeight = 10 + Math.sin(i * 1.2) * 15 + 15;
      const barX = x + 12 + i * (barWidth + 2);
      const barY = y + h - 16 - barHeight;
      g.fillStyle(C.aiLabAccent, 0.4);
      g.fillRect(barX, barY, barWidth, barHeight);
    }

    g.fillStyle(0x5a9a50, 0.8);
    g.fillCircle(x + w - 14, y + 14, 4);
  }

  private drawTerminalMonitor(g: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) {
    g.fillStyle(0x8a8078, 0.15);
    g.fillRoundedRect(x + 3, y + 3, w, h, 4);
    g.fillStyle(0x2a2520, 1);
    g.fillRoundedRect(x, y, w, h, 4);
    g.lineStyle(1, C.aiLabAccent, 0.2);
    g.strokeRoundedRect(x, y, w, h, 4);

    g.fillStyle(0x1e1a18, 1);
    g.fillRect(x + 4, y + 4, w - 8, h - 8);

    const lineY = y + 16;
    for (let i = 0; i < 5; i++) {
      const lineWidth = 30 + Math.sin(i * 2) * 20 + 20;
      g.fillStyle(C.aiLabAccent, 0.3);
      g.fillRect(x + 12, lineY + i * 14, lineWidth, 6);
    }

    g.fillStyle(C.aiLabAccent, 0.6);
    g.fillRect(x + 12, lineY + 5 * 14, 8, 8);
  }

  private drawSmallPlant(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    g.fillStyle(0x8a8078, 0.12);
    g.fillEllipse(x + 2, y + 12, 22, 12);
    g.fillStyle(0xc0a890, 1);
    g.fillEllipse(x, y + 10, 20, 14);
    g.fillStyle(0x4a7a40, 1);
    g.fillCircle(x, y, 10);
    g.fillCircle(x + 6, y - 6, 8);
    g.fillCircle(x - 6, y - 6, 8);
    g.fillStyle(0x60a050, 1);
    g.fillCircle(x, y - 3, 6);
  }

  // ─────────────────────────────────────────────────────────
  // Furniture helpers (with variation system)
  // ─────────────────────────────────────────────────────────
  private drawDesk(g: Phaser.GameObjects.Graphics, x: number, y: number, deskId?: string) {
    const W = 200, H = 90;
    const variation = deskId ? getDeskVariation(deskId) : { monitors: 1, clutter: 'none' as const, chair: 'pushed-in' as const };

    g.fillStyle(0x8a8078, 0.15);
    g.fillRoundedRect(x + 4, y + 4, W + 2, H + 2, 3);
    g.fillStyle(0x8a8078, 0.08);
    g.fillRoundedRect(x + 8, y + 8, W + 4, H + 4, 4);

    g.fillStyle(C.deskBase, 1);
    g.fillRect(x, y, W, H);
    g.fillStyle(C.deskTop, 1);
    g.fillRect(x + 4, y + 4, W - 8, H - 8);
    g.fillStyle(C.deskSurface, 1);
    g.fillRect(x + 8, y + 8, W - 16, 24);

    if (variation.monitors === 0) {
    } else if (variation.monitors === 1) {
      g.fillStyle(C.monitorFrame, 1);
      g.fillRect(x + W / 2 - 26, y + 10, 52, 34);
      g.fillStyle(C.monitorScreen, 1);
      g.fillRect(x + W / 2 - 22, y + 13, 44, 26);
      g.fillStyle(C.monitorGlow, 0.4);
      g.fillRect(x + W / 2 - 22, y + 13, 44, 6);
    } else {
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

    if (variation.clutter !== 'none') {
      const clutterColor = ClutterColors[variation.clutter];
      const clutterX = x + W - 30;
      const clutterY = y + 14;
      g.fillStyle(clutterColor, 0.9);
      g.fillRoundedRect(clutterX, clutterY, 16, 12, 2);
    }

    const chairOffsetY = variation.chair === 'pulled-out' ? 32 : 24;
    this.drawChair(g, x + W / 2, y + H + chairOffsetY);
  }

  private drawAiDesk(g: Phaser.GameObjects.Graphics, x: number, y: number, deskId?: string) {
    const W = 180, H = 90;
    const variation = deskId ? getDeskVariation(deskId) : { monitors: 2, clutter: 'none' as const, chair: 'pushed-in' as const };

    g.fillStyle(0x8a8078, 0.18);
    g.fillRoundedRect(x + 4, y + 4, W + 2, H + 2, 3);
    g.fillStyle(0x8a8078, 0.08);
    g.fillRoundedRect(x + 8, y + 8, W + 4, H + 4, 4);

    g.fillStyle(0xd8d0c8, 1);
    g.fillRect(x, y, W, H);
    g.fillStyle(0xc0b8b0, 1);
    g.fillRect(x + 4, y + 4, W - 8, H - 8);

    g.fillStyle(C.aiLabAccent, 0.3);
    g.fillRect(x + 8, y + 8, W - 16, 3);

    if (variation.monitors === 0) {
    } else if (variation.monitors === 1) {
      g.fillStyle(C.monitorFrame, 1);
      g.fillRect(x + W / 2 - 26, y + 14, 52, 38);
      g.fillStyle(C.monitorScreen, 1);
      g.fillRect(x + W / 2 - 22, y + 17, 44, 30);
      g.fillStyle(C.aiLabGlow, 0.3);
      g.fillRect(x + W / 2 - 22, y + 17, 44, 6);
    } else {
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

    if (variation.clutter !== 'none') {
      const clutterColor = ClutterColors[variation.clutter];
      const clutterX = x + W - 28;
      const clutterY = y + 16;
      g.fillStyle(clutterColor, 0.8);
      g.fillRoundedRect(clutterX, clutterY, 14, 10, 2);
    }

    const chairOffsetY = variation.chair === 'pulled-out' ? 30 : 22;
    const chairCx = x + W / 2;
    const chairCy = y + H + chairOffsetY;
    g.fillStyle(0x8a8078, 0.12);
    g.fillCircle(chairCx + 3, chairCy + 3, 18);
    g.fillStyle(0xd0c8c0, 1);
    g.fillCircle(chairCx, chairCy, 18);
    g.fillStyle(C.aiLabAccent, 0.3);
    g.fillCircle(chairCx, chairCy, 9);
  }

  private drawChair(g: Phaser.GameObjects.Graphics, cx: number, cy: number) {
    g.fillStyle(0x8a8078, 0.12);
    g.fillCircle(cx + 3, cy + 3, 18);
    g.fillStyle(C.chairBody, 1);
    g.fillCircle(cx, cy, 18);
    g.fillStyle(C.chairBack, 1);
    g.fillCircle(cx, cy, 10);
    g.lineStyle(1, C.wallHighlight, 0.3);
    g.strokeCircle(cx, cy, 18);
  }

  private drawServerRack(g: Phaser.GameObjects.Graphics, x: number, y: number) {
    const rW = 90, rH = 200;

    g.fillStyle(0x8a8078, 0.18);
    g.fillRoundedRect(x + 5, y + 5, rW + 2, rH + 2, 6);
    g.fillStyle(C.aiServer, 1);
    g.fillRoundedRect(x, y, rW, rH, 6);
    g.lineStyle(2, C.aiLabAccent, 0.5);
    g.strokeRoundedRect(x, y, rW, rH, 6);

    for (let i = 0; i < 7; i++) {
      const slotY = y + 12 + i * 26;
      g.fillStyle(0xd8d0c8, 1);
      g.fillRect(x + 8, slotY, rW - 16, 18);
      const lightColors = [C.aiServerLight, C.aiLabAccent, 0x5a9a50, C.aiServerLight, C.aiLabAccent, 0x5a9a50, C.aiLabAccent];
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
      g.fillStyle(0x8a8078, 0.15);
      g.fillEllipse(px + 3, py + 17, 34, 20);
      g.fillStyle(C.potClay, 1);
      g.fillEllipse(px, py + 14, 32, 22);
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
      fontSize: '13px',
      fontFamily: '"Inter", sans-serif',
      color: '#5a5048',
      alpha: 0.7,
      letterSpacing: 2,
      padding: { x: 0, y: 0 },
    };

    const labels = [
      { text: 'OPEN OFFICE', x: 30, y: 20, color: RoomTokens.open_office.labelColor },
      { text: 'WORKSPACE', x: 30, y: 750, color: RoomTokens.workspace.labelColor },
      { text: 'MEETING ROOM', x: 1170, y: 810, color: RoomTokens.meeting.labelColor },
      { text: 'AI LABS', x: 1130, y: 15, color: RoomTokens.ai_labs.labelColor },
    ];

    labels.forEach(({ text, x, y, color }) => {
      this.add.text(x, y, text, { ...labelStyle, color }).setAlpha(0.8).setDepth(2);
      const underline = this.add.graphics();
      underline.fillStyle(
        parseInt(color.replace('#', ''), 16),
        0.4
      );
      underline.fillRect(x, y + 18, text.length * 7.5, 1.5);
      underline.setDepth(2);
    });
  }

  // ─────────────────────────────────────────────────────────
  // Room Lighting Overlays (subtle accent-tinted rectangles)
  // ─────────────────────────────────────────────────────────
  private drawRoomLightingOverlays() {
    const meetingToken = RoomTokens.meeting;
    const meetingLight = LightProfiles[meetingToken.lightProfile];
    const meetingOverlay = this.add.rectangle(
      1450, 1060, 572, 492,
      meetingToken.accent, meetingLight.ambientAlpha
    );
    meetingOverlay.setDepth(1);

    const aiToken = RoomTokens.ai_labs;
    const aiLight = LightProfiles[aiToken.lightProfile];
    const aiOverlay = this.add.rectangle(
      (1116 + W) / 2, 390, W - 1116, 780,
      aiToken.accent, aiLight.ambientAlpha
    );
    aiOverlay.setDepth(1);

    const meetingBorder = this.add.graphics();
    meetingBorder.lineStyle(2, meetingToken.accent, 0.3);
    meetingBorder.strokeRect(1150, 800, 600, 520);
    meetingBorder.setDepth(1);

    const aiBorder = this.add.graphics();
    aiBorder.lineStyle(2, aiToken.accent, 0.4);
    aiBorder.strokeRect(1116, 0, W - 1116, 780);
    aiBorder.setDepth(1);

    const glowG = this.add.graphics();
    glowG.setDepth(1);

    glowG.fillStyle(0xa07050, 0.06);
    glowG.fillRect(1080, 260, 60, 180);

    glowG.fillStyle(0x9070b0, 0.05);
    glowG.fillRect(1320, 780, 160, 50);

    glowG.fillStyle(0xffffff, 0.02);
    glowG.fillRect(800, 700, 400, 50);
  }

  // ─────────────────────────────────────────────────────────
  // Collision Layers (invisible physics bodies)
  // ─────────────────────────────────────────────────────────
  private createCollisionLayers() {
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
