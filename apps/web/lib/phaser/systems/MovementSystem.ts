import { WorldConfig } from '../config/world.config';
import type { Player } from '../entities/Player';
import Phaser from "phaser";

export class MovementSystem {
  private scene: Phaser.Scene;
  private keys: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    if (!scene.input.keyboard) {
      throw new Error('Keyboard not found in scene');
    }

    this.keys = {
      W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  private isInputFocused(): boolean {
    const active = document.activeElement;
    return active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || active?.getAttribute('contenteditable') === 'true';
  }

  update(player: Player, delta: number) {
    if (this.isInputFocused()) {
      // Release all keys so Phaser stops capturing them
      this.scene.input.keyboard?.disableGlobalCapture();
      player.stop();
      return;
    }

    // Re-enable capture when not typing
    this.scene.input.keyboard?.enableGlobalCapture();

    let dx = 0;
    let dy = 0;

    if (this.keys.W.isDown) dy -= 1;
    if (this.keys.S.isDown) dy += 1;
    if (this.keys.A.isDown) dx -= 1;
    if (this.keys.D.isDown) dx += 1;

    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;
    }

    // Apply velocity — physics engine handles collision + position
    const speed = WorldConfig.player.speed;

    if (dx !== 0 || dy !== 0) {
      player.move(dx * speed, dy * speed);
    } else {
      player.stop();
    }
  }
}
