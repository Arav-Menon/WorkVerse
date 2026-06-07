import { WorldConfig } from '../config/world.config';
import type { Player } from '../entities/Player';

export class CollisionSystem {
  constructor() { }

  update(player: Player) {
    const container = player.getContainer();
    const radius = WorldConfig.player.radius;

    let { x, y } = container;

    // Enforce map boundaries
    if (x < radius) {
      x = radius;
    } else if (x > WorldConfig.bounds.width - radius) {
      x = WorldConfig.bounds.width - radius;
    }

    if (y < radius) {
      y = radius;
    } else if (y > WorldConfig.bounds.height - radius) {
      y = WorldConfig.bounds.height - radius;
    }

    container.setPosition(x, y);
  }
}
