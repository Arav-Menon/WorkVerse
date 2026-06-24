import Phaser from 'phaser';
import { ArenaScene } from './scenes/ArenaScene';

export function initGame(
  parent: HTMLDivElement,
  spaceId: string
): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: parent,
    width: 800,
    height: 600,
    backgroundColor: '#050505',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scene: [ArenaScene],
    transparent: true,
  };

  const game = new Phaser.Game(config);

  // Pass data to the initial scene
  game.scene.start('ArenaScene', { spaceId });

  return game;
}
