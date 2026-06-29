import type { Player } from '../entities/Player';
import type { RemotePlayer } from '../entities/RemotePlayer';
import type { ProximityWebRTCManager } from '../../webrtc/proximity-manager';

export interface ProximityUser {
  userId: string;
  username: string;
  color?: string;
  distance: number;
}

export class ProximitySystem {
  private threshold: number = 250;
  private proximityManager: ProximityWebRTCManager | null = null;
  private nearbyPlayers: Map<string, ProximityUser> = new Map();
  private onProximityChange: ((users: ProximityUser[]) => void) | null = null;

  constructor() { }

  setProximityManager(manager: ProximityWebRTCManager) {
    this.proximityManager = manager;
  }

  setOnProximityChange(callback: (users: ProximityUser[]) => void) {
    this.onProximityChange = callback;
  }

  update(localPlayer: Player, remotePlayers: Map<string, RemotePlayer>) {
    const localContainer = localPlayer.getContainer();
    const lx = localContainer.x;
    const ly = localContainer.y;

    const currentNearby = new Map<string, ProximityUser>();

    remotePlayers.forEach((remotePlayer, id) => {
      const remoteContainer = remotePlayer.getContainer();
      const rx = remoteContainer.x;
      const ry = remoteContainer.y;

      const dist = Math.sqrt(Math.pow(lx - rx, 2) + Math.pow(ly - ry, 2));

      if (dist < this.threshold) {
        const user: ProximityUser = {
          userId: id,
          username: remotePlayer.getName(),
          color: `#${remotePlayer.getColor().toString(16).padStart(6, '0')}`,
          distance: Math.round(dist),
        };
        currentNearby.set(id, user);

        if (!this.nearbyPlayers.has(id)) {
          console.log(`[PROXIMITY] Player entered range: ${remotePlayer.getName()} (${id}) dist=${Math.round(dist)}px`);
          this.proximityManager?.onProximityEnter(id);
        }
      }
    });

    for (const [id] of this.nearbyPlayers) {
      if (!currentNearby.has(id)) {
        console.log(`[PROXIMITY] Player left range: ${id}`);
        this.proximityManager?.onProximityExit(id);
      }
    }

    const changed = this.nearbyPlayers.size !== currentNearby.size ||
      ![...currentNearby.keys()].every(k => this.nearbyPlayers.has(k));

    this.nearbyPlayers = currentNearby;

    if (changed) {
      this.onProximityChange?.(Array.from(this.nearbyPlayers.values()));
    }
  }

  isNearby(userId: string): boolean {
    return this.nearbyPlayers.has(userId);
  }

  getNearbyUsers(): ProximityUser[] {
    return Array.from(this.nearbyPlayers.values());
  }

  cleanup() {
    for (const [id] of this.nearbyPlayers) {
      this.proximityManager?.onProximityExit(id);
    }
    this.nearbyPlayers.clear();
    this.onProximityChange = null;
    this.proximityManager = null;
  }
}
