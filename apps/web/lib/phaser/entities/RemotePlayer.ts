import Phaser from "phaser";
import { WorldConfig } from '../config/world.config';

// Distinct shades of zinc for remote players
const PLAYER_COLORS = [0x52525b, 0x3f3f46, 0x27272a];
let colorIndex = 0;

export class RemotePlayer {
  private container: Phaser.GameObjects.Container;
  private id: string;
  private name: string;
  private avatarColor: number;

  constructor(scene: Phaser.Scene, id: string, name: string, x: number, y: number) {
    this.id = id;
    this.name = name;
    this.avatarColor = PLAYER_COLORS[colorIndex % PLAYER_COLORS.length];
    colorIndex++;

    const radius = WorldConfig.remotePlayer.radius;

    // Subtle glow
    const glow = scene.add.graphics();
    glow.fillStyle(this.avatarColor, 0.12);
    glow.fillCircle(0, 0, radius + 6);

    // Body
    const body = scene.add.graphics();
    body.fillStyle(this.avatarColor, 0.85);
    body.fillCircle(0, 0, radius);
    // Sheen
    body.fillStyle(0xffffff, 0.2);
    body.fillCircle(-4, -5, radius * 0.35);

    // Name tag
    const tagW = name.length * 7 + 18;
    const tagBg = scene.add.graphics();
    tagBg.fillStyle(0x000000, 0.45);
    tagBg.fillRoundedRect(-tagW / 2, -radius - 28, tagW, 18, 5);

    const text = scene.add.text(0, -radius - 20, name, {
      fontSize: '12px',
      color: '#e2e8f0',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.container = scene.add.container(x, y, [glow, body, tagBg, text]);
    this.container.setSize(radius * 2, radius * 2);
    this.container.setDepth(10);
  }

  getContainer() { return this.container; }
  getId() { return this.id; }
  getName() { return this.name; }

  updatePosition(x: number, y: number) {
    // TODO: lerp to new position for network-jitter smoothing
    this.container.setPosition(x, y);
  }

  destroy() { this.container.destroy(); }
}
