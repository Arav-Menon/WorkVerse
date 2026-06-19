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

    // Glow aura
    const glow = scene.add.graphics();
    glow.fillStyle(WorldConfig.player.color, 0.15);
    glow.fillCircle(0, 0, radius + 8);

    // Avatar body
    const body = scene.add.graphics();
    body.fillStyle(WorldConfig.player.color, 1);
    body.fillCircle(0, 0, radius);
    // Sheen highlight
    body.fillStyle(0xffffff, 0.25);
    body.fillCircle(-4, -5, radius * 0.4);

    // Name tag background
    const tagBg = scene.add.graphics();
    const tagW = name.length * 7 + 18;
    tagBg.fillStyle(0x000000, 0.5);
    tagBg.fillRoundedRect(-tagW / 2, -radius - 28, tagW, 18, 5);

    // Name text
    const text = scene.add.text(0, -radius - 20, name, {
      fontSize: '12px',
      color: '#ffffff',
      fontFamily: '"Inter", "Segoe UI", sans-serif',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // "You" indicator dot
    const dot = scene.add.graphics();
    dot.fillStyle(0x10b981, 1); // emerald-500
    dot.fillCircle(radius - 3, -radius + 3, 5);
    dot.lineStyle(2, 0x000000, 1);
    dot.strokeCircle(radius - 3, -radius + 3, 5);

    this.container = scene.add.container(x, y, [glow, body, tagBg, text, dot]);
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
