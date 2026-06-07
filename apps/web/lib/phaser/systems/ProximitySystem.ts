import type { Player } from '../entities/Player';
import type { RemotePlayer } from '../entities/RemotePlayer';

export class ProximitySystem {
  private threshold: number = 150; // Distance in pixels

  constructor() { }

  update(localPlayer: Player, remotePlayers: Map<string, RemotePlayer>) {
    const localContainer = localPlayer.getContainer();
    const lx = localContainer.x;
    const ly = localContainer.y;

    remotePlayers.forEach((remotePlayer, id) => {
      const remoteContainer = remotePlayer.getContainer();
      const rx = remoteContainer.x;
      const ry = remoteContainer.y;

      const dist = Math.sqrt(Math.pow(lx - rx, 2) + Math.pow(ly - ry, 2));

      if (dist < this.threshold) {
        // Stub for Mediasoup / WebRTC connection logic
        // Only log sporadically or manage state to avoid console spam in a real implementation
        // console.log(`Nearby player detected: ${remotePlayer.getName()}`);
      }
    });
  }
}
