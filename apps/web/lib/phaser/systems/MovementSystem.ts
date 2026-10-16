import { WorldConfig } from '../config/world.config';
import type { Player } from '../entities/Player';

export class MovementSystem {
  private keysDown = new Set<string>();
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp:   (e: KeyboardEvent) => void;

  // Maps e.code (physical key, layout-independent) → direction
  private static readonly CODE_MAP: Record<string, string> = {
    KeyW: 'up',    ArrowUp:    'up',
    KeyS: 'down',  ArrowDown:  'down',
    KeyA: 'left',  ArrowLeft:  'left',
    KeyD: 'right', ArrowRight: 'right',
  };

  constructor(_scene: any) {
    this.boundKeyDown = (e: KeyboardEvent) => {
      if (this.isTyping()) return;
      const dir = MovementSystem.CODE_MAP[e.code] ?? null;
      if (dir) {
        e.preventDefault();
        this.keysDown.add(dir);
      }
    };

    this.boundKeyUp = (e: KeyboardEvent) => {
      const dir = MovementSystem.CODE_MAP[e.code] ?? null;
      if (dir) this.keysDown.delete(dir);
    };

    window.addEventListener('keydown', this.boundKeyDown, { capture: true });
    window.addEventListener('keyup',   this.boundKeyUp,   { capture: true });
  }

  private isTyping(): boolean {
    const active = document.activeElement;
    if (!active || active === document.body || active === document.documentElement) return false;
    const tag = active.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    const ce = active.getAttribute('contenteditable');
    if (ce !== null && ce !== 'false') return true;
    const role = active.getAttribute('role');
    if (role === 'textbox' || role === 'combobox' || role === 'searchbox') return true;
    return false;
  }

  update(player: Player, _delta: number) {
    if (this.isTyping()) { player.stop(); return; }

    let dx = 0;
    let dy = 0;
    if (this.keysDown.has('up'))    dy -= 1;
    if (this.keysDown.has('down'))  dy += 1;
    if (this.keysDown.has('left'))  dx -= 1;
    if (this.keysDown.has('right')) dx += 1;

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

  destroy() {
    window.removeEventListener('keydown', this.boundKeyDown, { capture: true });
    window.removeEventListener('keyup',   this.boundKeyUp,   { capture: true });
  }
}
