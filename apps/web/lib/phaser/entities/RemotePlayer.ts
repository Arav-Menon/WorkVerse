import Phaser from "phaser";
import { WorldConfig } from '../config/world.config';

// Warm distinct avatar colors — each remote player gets a unique one
const AVATAR_COLORS = [
  { bg: 0xd06858, label: '#ffffff' },  // coral
  { bg: 0x4a70c0, label: '#ffffff' },  // blue
  { bg: 0x5a9060, label: '#ffffff' },  // green
  { bg: 0x9070b0, label: '#ffffff' },  // purple
  { bg: 0xc09030, label: '#ffffff' },  // amber
  { bg: 0x708898, label: '#ffffff' },  // slate
];
let colorIndex = 0;

export class RemotePlayer {
  private container: Phaser.GameObjects.Container;
  private id: string;
  private name: string;
  private avatarColor: { bg: number; label: string };

  constructor(scene: Phaser.Scene, id: string, name: string, x: number, y: number) {
    this.id = id;
    this.name = name;
    this.avatarColor = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length]!;
    colorIndex++;

    const radius = WorldConfig.remotePlayer.radius;

    // Subtle glow
    const glow = scene.add.graphics();
    glow.fillStyle(this.avatarColor.bg, 0.12);
    glow.fillCircle(0, 0, radius + 8);

    // Body — solid color
    const body = scene.add.graphics();
    body.fillStyle(this.avatarColor.bg, 1);
    body.fillCircle(0, 0, radius);
    // Subtle highlight
    body.fillStyle(0xffffff, 0.15);
    body.fillCircle(-3, -4, radius * 0.35);

    // Initials
    const initial = name.charAt(0).toUpperCase();
    const text = scene.add.text(0, 0, initial, {
      fontSize: '13px',
      color: this.avatarColor.label,
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Name tag
    const tagW = name.length * 7 + 22;
    const tagBg = scene.add.graphics();
    tagBg.fillStyle(0x3a3230, 0.75);
    tagBg.fillRoundedRect(-tagW / 2, -radius - 28, tagW, 18, 5);

    const nameText = scene.add.text(0, -radius - 19, name, {
      fontSize: '11px',
      color: '#ffffff',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      fontStyle: '600',
    }).setOrigin(0.5);

    this.container = scene.add.container(x, y, [glow, body, text, tagBg, nameText]);
    this.container.setSize(radius * 2, radius * 2);
    this.container.setDepth(10);
  }

  getContainer() { return this.container; }
  getId() { return this.id; }
  getName() { return this.name; }

  updatePosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  destroy() { this.container.destroy(); }
}
