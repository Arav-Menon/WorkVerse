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
  private occupancyThreshold: number = 80; // pixels from desk center to be "at" the desk

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

    // Update visual states
    this.updateVisuals();
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
    // Visual updates will be handled by the scene's draw methods
    // This system only tracks state — the scene reads occupancy when drawing
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
