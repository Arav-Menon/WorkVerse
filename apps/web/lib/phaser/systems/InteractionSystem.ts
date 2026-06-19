import Phaser from 'phaser';
import { InteractionZoneTypes, InteractionZones } from '../config/interaction.config';
import type { Player } from '../entities/Player';

interface ActiveZoneState {
  currentNearbyZones: Set<string>;
  activeZoneId: string | null;
}

export class InteractionSystem {
  private scene: Phaser.Scene;
  private interactionZones: Phaser.GameObjects.Group;
  private interactKey: Phaser.Input.Keyboard.Key | null;
  private state: ActiveZoneState;
  private promptContainer: Phaser.GameObjects.Container | null;
  private promptText: Phaser.GameObjects.Text | null;
  private promptKeycap: Phaser.GameObjects.Graphics | null;
  private previousActiveZoneId: string | null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.interactionZones = scene.add.group();
    this.interactKey = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) ?? null;
    this.state = {
      currentNearbyZones: new Set(),
      activeZoneId: null,
    };
    this.promptContainer = null;
    this.promptText = null;
    this.promptKeycap = null;
    this.previousActiveZoneId = null;

    this.createZones();
    this.createPromptUI();
  }

  private createZones() {
    InteractionZones.forEach(zone => {
      const phaserZone = this.scene.add.zone(
        zone.x + zone.width / 2,
        zone.y + zone.height / 2,
        zone.width,
        zone.height
      );
      this.scene.physics.world.enable(phaserZone, Phaser.Physics.Arcade.STATIC_BODY);
      phaserZone.setData('zoneId', zone.id);
      phaserZone.setData('zoneType', zone.type);
      phaserZone.setData('targetId', zone.targetId);
      this.interactionZones.add(phaserZone);
    });
  }

  private createPromptUI() {
    this.promptContainer = this.scene.add.container(0, 0);
    this.promptContainer.setDepth(100);
    this.promptContainer.setAlpha(0);

    // Keycap background
    this.promptKeycap = this.scene.add.graphics();
    this.promptKeycap.fillStyle(0x18181b, 0.95);
    this.promptKeycap.fillRoundedRect(-60, -16, 48, 24, 4);
    this.promptKeycap.lineStyle(1, 0x3f3f46, 1);
    this.promptKeycap.strokeRoundedRect(-60, -16, 48, 24, 4);

    // Keycap text
    const keycapText = this.scene.add.text(-36, -4, 'SPACE', {
      fontSize: '9px',
      fontFamily: '"Inter", monospace',
      color: '#a1a1aa',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Prompt label
    this.promptText = this.scene.add.text(0, -4, '', {
      fontSize: '11px',
      fontFamily: '"Inter", sans-serif',
      color: '#e4e4e7',
    }).setOrigin(0, 0.5);

    this.promptContainer.add([this.promptKeycap, keycapText, this.promptText]);
  }

  update(player: Player) {
    const playerContainer = player.getContainer();
    const playerX = playerContainer.x;
    const playerY = playerContainer.y;

    // Recompute nearby zones
    this.state.currentNearbyZones.clear();
    this.interactionZones.getChildren().forEach(zone => {
      const phaserZone = zone as Phaser.GameObjects.Zone;
      const bounds = phaserZone.getBounds();
      if (bounds.contains(playerX, playerY)) {
        this.state.currentNearbyZones.add(phaserZone.getData('zoneId'));
      }
    });

    // Find nearest zone
    const nearestZone = this.findNearestZone(playerX, playerY);
    this.state.activeZoneId = nearestZone ? nearestZone.getData('zoneId') : null;

    // Update prompt if zone changed
    if (this.state.activeZoneId !== this.previousActiveZoneId) {
      this.previousActiveZoneId = this.state.activeZoneId;
      this.updatePromptUI(nearestZone, playerX, playerY);
    }

    // Update prompt position to follow player
    if (this.promptContainer && this.state.activeZoneId) {
      this.promptContainer.x = playerX;
      this.promptContainer.y = playerY - 40;
    }

    // Handle SPACE press
    if (this.interactKey && Phaser.Input.Keyboard.JustDown(this.interactKey) && this.state.activeZoneId) {
      this.triggerInteraction(nearestZone!);
    }
  }

  private findNearestZone(playerX: number, playerY: number): Phaser.GameObjects.Zone | null {
    let nearest: Phaser.GameObjects.Zone | null = null;
    let minDistance = Infinity;

    this.interactionZones.getChildren().forEach(zone => {
      const phaserZone = zone as Phaser.GameObjects.Zone;
      const zoneId = phaserZone.getData('zoneId');
      if (this.state.currentNearbyZones.has(zoneId)) {
        const bounds = phaserZone.getBounds();
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        const dist = Phaser.Math.Distance.Between(playerX, playerY, centerX, centerY);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = phaserZone;
        }
      }
    });

    return nearest;
  }

  private updatePromptUI(zone: Phaser.GameObjects.Zone | null, _playerX: number, _playerY: number) {
    if (!this.promptContainer || !this.promptText) return;

    if (zone) {
      const zoneType = zone.getData('zoneType');
      const config = InteractionZoneTypes[zoneType];
      if (config) {
        this.promptText.setText(config.prompt);
        this.promptContainer.x = _playerX;
        this.promptContainer.y = _playerY - 40;
        this.scene.tweens.add({
          targets: this.promptContainer,
          alpha: 1,
          duration: 120,
          ease: 'Power2',
        });
      }
    } else {
      this.scene.tweens.add({
        targets: this.promptContainer,
        alpha: 0,
        duration: 120,
        ease: 'Power2',
      });
    }
  }

  private triggerInteraction(zone: Phaser.GameObjects.Zone) {
    const zoneType = zone.getData('zoneType');
    const targetId = zone.getData('targetId');
    const config = InteractionZoneTypes[zoneType];

    if (config) {
      this.scene.events.emit('interaction-triggered', {
        type: zoneType,
        targetId: targetId,
        tier: config.tier,
        prompt: config.prompt,
      });
    }
  }

  getActiveZone(): string | null {
    return this.state.activeZoneId;
  }

  destroy() {
    if (this.promptContainer) {
      this.promptContainer.destroy();
    }
  }
}
