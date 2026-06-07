import { WorldConfig } from '../config/world.config';
import type { Player } from '../entities/Player';
import Phaser from "phaser"

export class CameraSystem {
  private camera: Phaser.Cameras.Scene2D.Camera;

  constructor(scene: Phaser.Scene) {
    this.camera = scene.cameras.main;

    // Set world boundaries for the camera
    this.camera.setBounds(0, 0, WorldConfig.bounds.width, WorldConfig.bounds.height);
  }

  startFollowing(player: Player) {
    // Follow with a slight lerp for smooth tracking
    this.camera.startFollow(player.getContainer(), true, 0.09, 0.09);
  }
}
