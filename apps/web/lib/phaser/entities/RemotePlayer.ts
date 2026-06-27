import Phaser from "phaser";
import { WorldConfig } from '../config/world.config';
import { hexColorToNumber } from '../types/arena.types';

export class RemotePlayer {
  private container: Phaser.GameObjects.Container;
  private id: string;
  private name: string;
  private avatarColor: { bg: number; label: string };

  constructor(scene: Phaser.Scene, id: string, name: string, x: number, y: number, colorHex?: string) {
    this.id = id;
    this.name = name;

    const bgColor = colorHex ? hexColorToNumber(colorHex) : 0x708898;
    this.avatarColor = { bg: bgColor, label: '#ffffff' };

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
    this.container.setInteractive({ useHandCursor: true });

    this.container.on('pointerover', () => {
      this.container.setScale(1.08);
    });

    this.container.on('pointerout', () => {
      this.container.setScale(1.0);
    });
  }

  getContainer() { return this.container; }
  getId() { return this.id; }
  getName() { return this.name; }
  getColor() { return this.avatarColor.bg; }

  updatePosition(x: number, y: number) {
    this.container.setPosition(x, y);
  }

  destroy() { this.container.destroy(); }
}
