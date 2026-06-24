import Phaser from 'phaser';
import type { Player } from '../entities/Player';
import type { RemotePlayer } from '../entities/RemotePlayer';

export interface DeskState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  occupied: boolean;
  occupantId: string | null;
  graphics: Phaser.GameObjects.Graphics | null;
}

export class OccupancySystem {
  private scene: Phaser.Scene;
  private desks: Map<string, DeskState> = new Map();
  private occupancyThreshold: number = 80;
  private dirty: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  registerDesk(id: string, x: number, y: number, width: number, height: number, graphics: Phaser.GameObjects.Graphics) {
    this.desks.set(id, {
      id,
      x: x + width / 2,
      y: y + height / 2,
      width,
      height,
      occupied: false,
      occupantId: null,
      graphics,
    });
  }

  update(localPlayer: Player, remotePlayers: Map<string, RemotePlayer>) {
    // Snapshot previous occupancy
    const prevOccupancy = new Map<string, boolean>();
    this.desks.forEach((desk, id) => {
      prevOccupancy.set(id, desk.occupied);
    });

    // Reset all desks
    this.desks.forEach(desk => {
      desk.occupied = false;
      desk.occupantId = null;
    });

    // Check local player
    const localContainer = localPlayer.getContainer();
    this.checkPlayerAtDesk(localPlayer.getId(), localContainer.x, localContainer.y);

    // Check remote players
    remotePlayers.forEach((remotePlayer) => {
      const container = remotePlayer.getContainer();
      this.checkPlayerAtDesk(remotePlayer.getId(), container.x, container.y);
    });

    // Check if any desk changed state
    this.dirty = false;
    this.desks.forEach((desk, id) => {
      if (desk.occupied !== prevOccupancy.get(id)) {
        this.dirty = true;
      }
    });

    // Only redraw when something changed
    if (this.dirty) {
      this.updateVisuals();
    }
  }

  private checkPlayerAtDesk(playerId: string, playerX: number, playerY: number) {
    this.desks.forEach(desk => {
      const dist = Phaser.Math.Distance.Between(playerX, playerY, desk.x, desk.y);
      if (dist < this.occupancyThreshold) {
        desk.occupied = true;
        desk.occupantId = playerId;
      }
    });
  }

  private updateVisuals() {
    this.desks.forEach(desk => {
      if (!desk.graphics) return;
      desk.graphics.clear();

      if (desk.occupied) {
        desk.graphics.fillStyle(0xa07050, 0.12);
        desk.graphics.fillCircle(desk.x, desk.y, 40);
        desk.graphics.fillStyle(0x4a8040, 0.9);
        desk.graphics.fillCircle(desk.x + desk.width / 2 - 8, desk.y - desk.height / 2 + 8, 4);
        desk.graphics.lineStyle(1, 0xffffff, 0.3);
        desk.graphics.strokeCircle(desk.x + desk.width / 2 - 8, desk.y - desk.height / 2 + 8, 4);
      }
    });
  }

  isDeskOccupied(deskId: string): boolean {
    return this.desks.get(deskId)?.occupied ?? false;
  }

  getDeskOccupant(deskId: string): string | null {
    return this.desks.get(deskId)?.occupantId ?? null;
  }

  getOccupiedDesks(): DeskState[] {
    return Array.from(this.desks.values()).filter(d => d.occupied);
  }
}
