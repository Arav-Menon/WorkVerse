import Phaser from "phaser";
import { WorldConfig } from '../config/world.config';

export class Player {
  private container: Phaser.GameObjects.Container;
  private id: string;
  private name: string;

  constructor(scene: Phaser.Scene, id: string, name: string, x: number, y: number) {
    this.id = id;
    this.name = name;

    const radius = WorldConfig.player.radius;

    // Outer ring — "You" indicator
    const ring = scene.add.graphics();
    ring.lineStyle(3, 0x4a8040, 1);
    ring.strokeCircle(0, 0, radius + 4);

    // Glow aura
    const glow = scene.add.graphics();
    glow.fillStyle(0xa07050, 0.15);
    glow.fillCircle(0, 0, radius + 10);

    // Avatar body — solid warm color
    const body = scene.add.graphics();
    body.fillStyle(0xa07050, 1);
    body.fillCircle(0, 0, radius);
    // Subtle inner highlight
    body.fillStyle(0xffffff, 0.15);
    body.fillCircle(-3, -4, radius * 0.4);

    // Initials
    const initial = name.charAt(0).toUpperCase();
    const text = scene.add.text(0, 0, initial, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Name tag background
    const tagBg = scene.add.graphics();
    const tagW = name.length * 7 + 22;
    tagBg.fillStyle(0x3a3230, 0.85);
    tagBg.fillRoundedRect(-tagW / 2, -radius - 30, tagW, 20, 6);

    // Name text
    const nameText = scene.add.text(0, -radius - 21, name, {
      fontSize: '11px',
      color: '#ffffff',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      fontStyle: '600',
    }).setOrigin(0.5);

    // "You" badge
    const badgeBg = scene.add.graphics();
    badgeBg.fillStyle(0x4a8040, 1);
    badgeBg.fillRoundedRect(-14, radius + 6, 28, 14, 4);
    const badgeText = scene.add.text(0, radius + 13, 'You', {
      fontSize: '8px',
      color: '#ffffff',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.container = scene.add.container(x, y, [glow, ring, body, text, tagBg, nameText, badgeBg, badgeText]);
    this.container.setSize(radius * 2, radius * 2);
    this.container.setDepth(20);

    // Enable Arcade physics body on the container
    scene.physics.world.enable(this.container);
    (this.container.body as Phaser.Physics.Arcade.Body).setCircle(radius);
    (this.container.body as Phaser.Physics.Arcade.Body).setOffset(-radius, -radius);
    (this.container.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
  }

  getContainer() { return this.container; }
  getId() { return this.id; }
  getName() { return this.name; }

  move(dx: number, dy: number) {
    (this.container.body as Phaser.Physics.Arcade.Body).setVelocity(dx, dy);
  }

  stop() {
    (this.container.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
  }

  getBody(): Phaser.Physics.Arcade.Body {
    return this.container.body as Phaser.Physics.Arcade.Body;
  }
}
