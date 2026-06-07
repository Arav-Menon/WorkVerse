import Phaser from 'phaser';
import { ArenaScene } from './scenes/ArenaScene';

export function initGame(
  parent: HTMLDivElement,
  spaceId: string
): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: parent,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [ArenaScene],
    // Essential for transparent overlay / React integration
    transparent: true,
  };

  const game = new Phaser.Game(config);

  // Pass data to the initial scene
  game.scene.start('ArenaScene', { spaceId });

  return game;
}
