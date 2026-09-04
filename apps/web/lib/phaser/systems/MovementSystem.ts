import { WorldConfig } from '../config/world.config';
import type { Player } from '../entities/Player';

/**
 * MovementSystem — uses raw window-level keydown/keyup listeners instead of
 * Phaser's keyboard plugin. This bypasses all of Phaser's capture/focus
 * machinery and gives us direct, reliable state tracking for WASD.
 */
export class MovementSystem {
  private keysDown = new Set<string>();
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  private static MOVE_KEYS = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'w', 'a', 's', 'd']);

  constructor(_scene: any) {
    this.boundKeyDown = (e: KeyboardEvent) => {
      // Never interfere when a real text-entry element has focus
      if (this.isTyping()) return;
      if (MovementSystem.MOVE_KEYS.has(e.code) || MovementSystem.MOVE_KEYS.has(e.key.toLowerCase())) {
        e.preventDefault();
        this.keysDown.add(e.code || ('Key' + e.key.toUpperCase()));
      }
    };

    this.boundKeyUp = (e: KeyboardEvent) => {
      this.keysDown.delete(e.code || ('Key' + e.key.toUpperCase()));
    };

    window.addEventListener('keydown', this.boundKeyDown, { capture: true });
    window.addEventListener('keyup', this.boundKeyUp, { capture: true });
  }

  /**
   * Only suppress movement when the user is actively typing in a real text field.
   */
  private isTyping(): boolean {
    const active = document.activeElement;
    if (!active || active === document.body || active === document.documentElement) {
      return false;
    }
    const tag = active.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    const ce = active.getAttribute('contenteditable');
    if (ce !== null && ce !== 'false') return true;
    const role = active.getAttribute('role');
    if (role === 'textbox' || role === 'combobox' || role === 'searchbox' || role === 'spinbutton') return true;
    return false;
  }

  update(player: Player, _delta: number) {
    if (this.isTyping()) {
      player.stop();
      return;
    }

    const up    = this.keysDown.has('KeyW');
    const down  = this.keysDown.has('KeyS');
    const left  = this.keysDown.has('KeyA');
    const right = this.keysDown.has('KeyD');

    let dx = 0;
    let dy = 0;
    if (up)    dy -= 1;
    if (down)  dy += 1;
    if (left)  dx -= 1;
    if (right) dx += 1;

    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }

    const speed = WorldConfig.player.speed;
    if (dx !== 0 || dy !== 0) {
      player.move(dx * speed, dy * speed);
    } else {
      player.stop();
    }
  }

  /** Call this when the scene is destroyed to avoid memory leaks. */
  destroy() {
    window.removeEventListener('keydown', this.boundKeyDown, { capture: true });
    window.removeEventListener('keyup', this.boundKeyUp, { capture: true });
  }
}
