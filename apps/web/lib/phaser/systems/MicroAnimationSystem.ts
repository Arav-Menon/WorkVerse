import Phaser from 'phaser';

export type AnimationType = 'monitor-flicker' | 'server-blink' | 'light-breathe';

export interface AnimatedObject {
  id: string;
  type: AnimationType;
  graphics: Phaser.GameObjects.Graphics;
  x: number;
  y: number;
  baseAlpha: number;
  currentAlpha: number;
  phase: number;
  speed: number;
}

export class MicroAnimationSystem {
  private scene: Phaser.Scene;
  private animatedObjects: AnimatedObject[] = [];
  private cameraBounds: Phaser.Geom.Rectangle | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setCameraBounds(bounds: Phaser.Geom.Rectangle) {
    this.cameraBounds = bounds;
  }

  registerObject(
    id: string,
    type: AnimationType,
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    baseAlpha: number = 0.4,
    speed: number = 1
  ) {
    this.animatedObjects.push({
      id,
      type,
      graphics,
      x,
      y,
      baseAlpha,
      currentAlpha: baseAlpha,
      phase: Math.random() * Math.PI * 2, // Random starting phase
      speed,
    });
  }

  update(time: number) {
    // Use camera's actual viewport for culling (not world bounds)
    const cam = this.scene.cameras.main;
    const view = cam.worldView;

    this.animatedObjects.forEach(obj => {
      // Only animate objects within camera view (performance optimization)
      if (!view.contains(obj.x, obj.y)) return;

      // Calculate animation based on type
      switch (obj.type) {
        case 'monitor-flicker':
          this.animateMonitorFlicker(obj, time);
          break;
        case 'server-blink':
          this.animateServerBlink(obj, time);
          break;
        case 'light-breathe':
          this.animateLightBreathe(obj, time);
          break;
      }
    });
  }

  private animateMonitorFlicker(obj: AnimatedObject, time: number) {
    // Subtle screen flicker — 2-4% brightness variation
    const flicker = Math.sin(time * 0.003 * obj.speed + obj.phase) * 0.03;
    obj.currentAlpha = obj.baseAlpha + flicker;
    obj.graphics.setAlpha(Math.max(0.3, Math.min(0.5, obj.currentAlpha)));
  }

  private animateServerBlink(obj: AnimatedObject, time: number) {
    // Server LED blink — on/off cycle
    const blink = Math.sin(time * 0.002 * obj.speed + obj.phase) > 0.7 ? 0.9 : 0.3;
    obj.graphics.setAlpha(blink);
  }

  private animateLightBreathe(obj: AnimatedObject, time: number) {
    // Light breathing — very subtle 2-4% brightness pulse
    const breathe = Math.sin(time * 0.001 * obj.speed + obj.phase) * 0.03;
    obj.currentAlpha = obj.baseAlpha + breathe;
    obj.graphics.setAlpha(Math.max(0.1, Math.min(0.4, obj.currentAlpha)));
  }

  getObjectCount(): number {
    return this.animatedObjects.length;
  }

  destroy() {
    this.animatedObjects = [];
  }
}
